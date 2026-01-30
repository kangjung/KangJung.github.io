const defaultBoard = {
  lists: [
    { id:'todo', title:'할 일', color:'#3b82f6', collapsed:false, cards:[], pinned: false, },
    { id: 'doing', title: '진행중', color:'#f97316', collapsed:false, cards:[], pinned: false, },
    { id: 'done', title: '완료', color:'#10b981', collapsed:false, cards:[], pinned: false, },
  ]
};

let editingCard = null;
let editingListId = null;
let editingList = null;
let searchQuery = '';
let showPinnedOnly = false;

const LIST_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#22c55e'  // green
];

function getRandomListColor() {
  return LIST_COLORS[Math.floor(Math.random() * LIST_COLORS.length)];
}

async function init() {
  currentBoard = await loadBoard();
  loadTheme();
  initThemeSettings();
  // IndexedDB에 데이터가 없으면 기본 보드 사용
  if (!currentBoard) {
    currentBoard = defaultBoard;
    await saveBoard(currentBoard);
  }

  document.getElementById('modalDelete').onclick = () => {
    if (!confirm('이 카드 삭제할까요?')) return;
    const list = currentBoard.lists.find(l => l.id === editingListId);
    list.cards = list.cards.filter(c => c.id !== editingCard.id);
    saveBoard(currentBoard);
    render(currentBoard);
    document.getElementById('cardModal').classList.add('hidden');
    editingCard = null;
  };

  document.getElementById('modalCancel').onclick = () => {
    document.getElementById('cardModal').classList.add('hidden');
    editingCard = null;
  };

  document
    .querySelectorAll('input[name="importMode"]')
    .forEach(radio => {
      radio.addEventListener('change', e => {
        const warning = document.getElementById('appendWarning');
        warning.style.display =
          e.target.value === 'append' ? 'block' : 'none';
      });
    });

  document.getElementById('modalSave').onclick = () => {
    const title = document.getElementById('modalTitle').value.trim();
    const memo = document.getElementById('modalMemo').value;
    const tags = document.getElementById('modalTags').value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);


    const color = document.getElementById('modalColor').value;

    if (!title) {
      alert('제목은 필수입니다.');
      return;
    }
    if (editingCard) {
      editingCard.title = title;
      editingCard.memo = memo;
      editingCard.tags = tags;
      editingCard.color = color;
    }
    else {
      const list = currentBoard.lists.find(l => l.id === editingListId);
      list.cards.push({
        id: Date.now().toString(),
        title,
        memo,
        tags,
        color
      });
    }
    saveBoard(currentBoard);
    render(currentBoard);
    closeModal();
  };

// help 버튼 클릭 → 모달 열기 (hidden 제거)
  document.getElementById('helpBtn').onclick = function () {
    document.getElementById("helpModal").classList.remove("hidden");
  };

// X 버튼 클릭 → 모달 닫기 (hidden 추가)
  document.getElementById('helpClose').onclick = function () {
    document.getElementById("helpModal").classList.add("hidden");
  };
  saveBoard(currentBoard);
  render(currentBoard);
  closeModal();
  document.getElementById('listCancel').onclick = closeListModal;

  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    render(currentBoard);
  });



  document.getElementById('listSave').onclick = () => {
    const title = document.getElementById('listTitle').value.trim();
    if (!title) {
      alert('리스트 이름은 필수입니다.');
      return;
    }

    const color = document.getElementById('listColor').value;
    const collapsed = document.getElementById('listCollapsed').checked;

    if (editingList) {
      editingList.title = title;
      editingList.color = color;
      editingList.collapsed = collapsed;
    } else {
      currentBoard.lists.push({
        id: crypto.randomUUID(),
        title,
        color,
        collapsed,
        cards: []
      });
    }

    saveBoard(currentBoard);
    render(currentBoard);
    closeListModal();
  };

  document.getElementById('listDelete').onclick = () => {
    if (!editingList) return;


    if (
      editingList.cards.length &&
      !confirm('카드가 있는 리스트입니다. 삭제할까요?')
    ) return;


    currentBoard.lists =
      currentBoard.lists.filter(l => l !== editingList);


    saveBoard(currentBoard);
    render(currentBoard);
    closeListModal();
  };
  document.getElementById('modalCancel').onclick = closeModal;


  if (!currentBoard) {
    currentBoard = defaultBoard;
    saveBoard(currentBoard);
  }
  render(currentBoard);
}
function closeModal() {
  document.getElementById('cardModal').classList.add('hidden');
  editingCard = null;
  editingListId = null;
}


function render(board) {
  const el = document.getElementById('board');
  el.innerHTML = '';

  /* ===== 즐겨찾기 필터 ===== */
  const listsToRender =
    showPinnedOnly && !searchQuery
      ? board.lists.filter(l => l.pinned)
      : board.lists;

  /* ===== 상단 표시 ===== */
  const indicator = document.getElementById('pinnedIndicator');
  indicator.innerHTML = '';

  if (showPinnedOnly) {
    indicator.innerHTML = `
      <div class="pinned-indicator">
        ⭐ 즐겨찾기 리스트만 표시 중
        <button onclick="togglePinnedView()">해제</button>
      </div>
    `;
  }

  if (showPinnedOnly && listsToRender.length === 0) {
    el.innerHTML = `
      <p style="font-size:13px; color:var(--muted); padding:16px;">
        ⭐ 즐겨찾기한 리스트가 없습니다
      </p>
    `;
    return;
  }

  /* ===== 리스트 렌더 ===== */
  listsToRender.forEach(list => {
    if (searchQuery) list.collapsed = false;

    const section = document.createElement('section');
    section.dataset.id = list.id;
    section.style.setProperty('--list-color', list.color || 'transparent');

    /* ===== header ===== */
    const header = document.createElement('div');
    header.className = 'list-header';

    /* collapse */
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'collapse-btn';
    collapseBtn.textContent = list.collapsed ? '▸' : '▾';
    collapseBtn.onclick = e => {
      e.stopPropagation();
      list.collapsed = !list.collapsed;
      saveBoard(currentBoard);
      render(currentBoard);
    };

    /* title */
    const titleEl = document.createElement('h3');
    titleEl.textContent = list.title;
    titleEl.title = list.title;
    titleEl.onclick = () => openListModal(list);

    const titleWrap = document.createElement('div');
    titleWrap.className = 'list-title';
    titleWrap.appendChild(titleEl);

    /* pin */
    const pinBtn = document.createElement('button');
    pinBtn.className = 'pin-btn' + (list.pinned ? ' active' : '');
    pinBtn.textContent = '⭐';
    pinBtn.title = '즐겨찾기';
    pinBtn.onclick = e => {
      e.stopPropagation();
      list.pinned = !list.pinned;
      saveBoard(currentBoard);
      render(currentBoard);
    };

    /* add card */
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ 카드';
    addBtn.onclick = e => {
      e.stopPropagation();
      openNewCardModal(list.id);
    };

    const actions = document.createElement('div');
    actions.className = 'list-actions';
    actions.append(pinBtn, collapseBtn, addBtn);

    header.append(titleWrap, actions);

    /* ===== cards ===== */
    const ul = document.createElement('ul');
    ul.className = 'card-list';
    if (list.collapsed) section.classList.add('collapsed');

    const matchCard = card => {
      if (!searchQuery) return true;
      const text = [
        card.title,
        card.memo,
        ...(card.tags || [])
      ].join(' ').toLowerCase();
      return text.includes(searchQuery);
    };

    if (searchQuery && list.cards.filter(matchCard).length === 0) {
      const empty = document.createElement('div');
      empty.style.fontSize = '12px';
      empty.style.color = 'var(--muted)';
      empty.style.padding = '6px';
      empty.textContent = '검색 결과 없음';
      ul.appendChild(empty);
    }

    list.cards.forEach(card => {
      if (!matchCard(card)) return;

      const li = document.createElement('li');
      li.className = 'card';
      li.dataset.id = card.id;
      li.style.borderLeft = card.color ? `6px solid ${card.color}` : '';

      li.innerHTML = `
        <strong>${highlight(card.title)}</strong>
        ${
        card.tags?.length
          ? `<div class="tags">${card.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
          : ''
      }
        ${
        card.memo
          ? `<p class="memo">${highlight(card.memo)}</p><span class="toggle-btn">펼치기</span>`
          : ''
      }
      `;

      if (card.memo) {
        const memoEl = li.querySelector('.memo');
        const toggleBtn = li.querySelector('.toggle-btn');
        toggleBtn.onclick = e => {
          e.stopPropagation();
          memoEl.classList.toggle('expanded');
          toggleBtn.textContent = memoEl.classList.contains('expanded') ? '접기' : '펼치기';
        };
      }

      li.onclick = () => openCardModal(card, list.id);
      li.oncontextmenu = e => {
        e.preventDefault();
        if (!confirm('이 카드 삭제할까요?')) return;
        list.cards = list.cards.filter(c => c.id !== card.id);
        saveBoard(currentBoard);
        render(currentBoard);
      };

      ul.appendChild(li);
    });

    section.append(header, ul);
    el.appendChild(section);

    new Sortable(ul, {
      group: 'cards',
      animation: 150,
      onEnd: () => {
        if (searchQuery) return;
        syncFromDOM();
        saveBoard(currentBoard);
      }
    });
  });

  /* ===== 리스트 추가 ===== */
  const addListBtn = document.createElement('button');
  addListBtn.className = 'add-list';
  addListBtn.textContent = '+ 리스트 추가';
  addListBtn.onclick = () => {
    openCreateListModal();
    // const title = prompt('리스트 이름');
    // if (!title) return;
    // currentBoard.lists.push({
    //   id: Date.now().toString(),
    //   title,
    //   color: '#64748b',
    //   collapsed: false,
    //   pinned: false,
    //   cards: []
    // });
    // saveBoard(currentBoard);
    // render(currentBoard);
  };
  el.appendChild(addListBtn);

  new Sortable(el, {
    animation: 200,
    draggable: 'section',
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: () => {
      syncListsFromDOM();
      saveBoard(currentBoard);
    }
  });
}

let currentBoard;


function addCard(listId) {
  const title = prompt('카드 제목');
  if (!title) return;


  const list = currentBoard.lists.find(l => l.id === listId);
  list.cards.push({
    id: Date.now().toString(),
    title,memo: ''
  });


  saveBoard(currentBoard);
  render(currentBoard);
}

function syncFromDOM() {
// 🔒 기존 카드들을 먼저 안전하게 백업
  const cardMap = new Map();


  currentBoard.lists.forEach(list => {
    list.cards.forEach(card => {
      cardMap.set(card.id, card);
    });
  });


// DOM 기준으로 카드 순서만 재구성
  document.querySelectorAll('section').forEach(section => {
    const listId = section.dataset.id;
    const list = currentBoard.lists.find(l => l.id === listId);
    if (!list) return;


    list.cards = [...section.querySelectorAll('.card')]
      .map(cardEl => cardMap.get(cardEl.dataset.id))
      .filter(Boolean);
  });
}

function openCardModal(card, listId) {
  editingCard = card;
  editingListId = listId;
  document.getElementById('modalDelete').style.display = 'inline-block';
  document.getElementById('modalTitleText').textContent = '카드 편집';
  document.getElementById('modalTitle').value = card.title;
  document.getElementById('modalMemo').value = card.memo || '';
  document.getElementById('modalTags').value = card.tags?.join(', ') || '';
  document.getElementById('modalColor').value = card.color || '#1e293b';
  document.getElementById('cardModal').classList.remove('hidden');
}

function openNewCardModal(listId) {
  editingCard = null;
  editingListId = listId;
  document.getElementById('modalDelete').style.display =  'none';
  document.getElementById('modalTitleText').textContent = '카드 추가';
  document.getElementById('modalTitle').value = '';
  document.getElementById('modalMemo').value = '';
  document.getElementById('modalTags').value = '';
  document.getElementById('modalColor').value = '#1e293b';
  document.getElementById('cardModal').classList.remove('hidden');
}

function openListModal(list) {
  editingList = list;


  document.getElementById('listDelete').style.display = 'inline-block';
  document.getElementById('listTitle').value = list.title;
  document.getElementById('listColor').value = list.color || '#64748b';
  document.getElementById('listCollapsed').checked = !!list.collapsed;
  document.getElementById('listModal').classList.remove('hidden');

  document.querySelector('#listModal h2').textContent = '리스트 설정';
}

function openCreateListModal() {
  editingList = null;
  document.getElementById('listDelete').style.display =  'none';
  document.getElementById('listTitle').value = '';
  document.getElementById('listColor').value = getRandomListColor();
  document.getElementById('listCollapsed').checked = false;
  document.getElementById('listModal').classList.remove('hidden');

  document.querySelector('#listModal h2').textContent = '리스트 추가';

  openModal('listModal');
}


function closeListModal() {
  editingList = null;
  document.getElementById('listModal').classList.add('hidden');
}

function getBoardKey() {
  return `board:${location.host}`;
}

function syncListsFromDOM() {
  const sections = [...document.querySelectorAll('#board section')];
  currentBoard.lists = sections.map(section =>
    currentBoard.lists.find(l => l.id === section.dataset.id)
  );
}
function highlight(text) {
  if (!searchQuery) return text;
  return text.replace(
    new RegExp(`(${searchQuery})`, 'gi'),
    '<mark>$1</mark>'
  );
}

function showLoading(text) {
  document.getElementById('loadingText').textContent = text;
  document.getElementById('loadingModal').classList.remove('hidden');
}


function hideLoading() {
  document.getElementById('loadingModal').classList.add('hidden');
}

function exportJSON() {
  showLoading('보드 데이터 준비 중…');


  setTimeout(() => {
    const data = JSON.stringify(currentBoard, null, 2);
    const blob = new Blob([data], { type: 'application/json' });


    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'board-backup.json';
    a.click();


    hideLoading();
  }, 400); // UX 안정용
}

function openSettingsPage() {
  document.getElementById('settingsPage').classList.remove('hidden');
  document.getElementById('board').style.display = 'none';
}


function closeSettingsPage() {
  document.getElementById('settingsPage').classList.add('hidden');
  document.getElementById('board').style.display = '';
}

function openExportModal() {
  document.getElementById('exportModal').classList.remove('hidden');
}


function closeExportModal() {
  document.getElementById('exportModal').classList.add('hidden');
}

function openImportModal() {
  document.getElementById('importModal').classList.remove('hidden');
}


function closeImportModal() {
  document.getElementById('importModal').classList.add('hidden');
  document.getElementById('importFileInput').value = '';
}


async function confirmImport() {
  const fileInput = document.getElementById('importFileInput');
  const file = fileInput.files[0];


  if (!file) {
    alert('JSON 파일을 선택해 주세요.');
    return;
  }


  const mode = document.querySelector(
    'input[name="importMode"]:checked'
  ).value;


  showLoading('파일 읽는 중…');


  try {
    const text = await file.text();


    document.getElementById('loadingText').textContent = '데이터 검증 중…';
    await new Promise(r => setTimeout(r, 300));


    const data = JSON.parse(text);


    if (!data || !Array.isArray(data.lists)) {
      throw new Error('형식 오류');
    }


    document.getElementById('loadingText').textContent = '보드 적용 중…';
    await new Promise(r => setTimeout(r, 300));


    if (mode === 'replace') {
      currentBoard = data;
    } else {
      currentBoard = mergeBoard(currentBoard, data);
    }


    await saveBoard(currentBoard);
    render(currentBoard);


    closeImportModal();
    closeSettingsPage();
  } catch (e) {
    alert('JSON 파일이 올바르지 않습니다.');
  } finally {
    hideLoading();
  }
}
function mergeBoard(current, imported) {
  const result = structuredClone(current);


  imported.lists.forEach(list => {
    const newListId = list.id + '-' + Date.now();


    result.lists.push({
      ...list,
      id: newListId,
      cards: list.cards.map(card => ({
        ...card,
        id: card.id + '-' + Math.random().toString(36).slice(2, 6)
      }))
    });
  });


  return result;
}
const THEME_KEY = 'memoBoardTheme';


function applyTheme(theme) {
  const html = document.documentElement;


  html.classList.remove('theme-light', 'theme-dark');


  if (theme === 'light') {
    html.classList.add('theme-light');
  } else if (theme === 'dark') {
    html.classList.add('theme-dark');
  }
// system이면 아무 클래스도 안 붙임
}


function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(saved);


// 라디오 상태 동기화
  document
    .querySelectorAll('input[name="theme"]')
    .forEach(radio => {
      radio.checked = radio.value === saved;
    });
}


function initThemeSettings() {
  document
    .querySelectorAll('input[name="theme"]')
    .forEach(radio => {
      radio.addEventListener('change', e => {
        const theme = e.target.value;
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
      });
    });
}

function togglePinnedView() {
  showPinnedOnly = !showPinnedOnly;
  document.querySelectorAll(".pinToggleBtn").forEach(btn => {
    btn.classList.toggle("active", showPinnedOnly);
  });
  render(currentBoard);
}
init();
