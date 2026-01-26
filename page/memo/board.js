const defaultBoard = {
  lists: [
    { id: 'todo', title: '할 일', cards: [] },
    { id: 'doing', title: '진행중', cards: [] },
    { id: 'done', title: '완료', cards: [] }
  ]
};

let editingCard = null;
let editingListId = null;

async function init() {
  currentBoard = await loadBoard();
  document.querySelector('header').textContent =`📋 ${location.host}`;

  document.getElementById('modalCancel').onclick = () => {
    document.getElementById('cardModal').classList.add('hidden');
    editingCard = null;
  };

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


  board.lists.forEach(list => {
    const section = document.createElement('section');
    section.dataset.id = list.id;


    /* ===== header ===== */
    const header = document.createElement('div');
    header.className = 'list-header';


    const titleEl = document.createElement('h3');
    titleEl.textContent = list.title;


    titleEl.onclick = () => {
      const newTitle = prompt('리스트 이름', list.title);
      if (!newTitle) return;
      list.title = newTitle;
      saveBoard(currentBoard);
      render(currentBoard);
    };


    header.oncontextmenu = (e) => {
      e.preventDefault();
      if (list.cards.length && !confirm('카드가 있습니다. 삭제할까요?')) return;
      currentBoard.lists = currentBoard.lists.filter(l => l.id !== list.id);
      saveBoard(currentBoard);
      render(currentBoard);
    };


    const addBtn = document.createElement('button');
    addBtn.textContent = '+ 카드';
    addBtn.onclick = () => openNewCardModal(list.id);


    header.append(titleEl, addBtn);


    /* ===== cards ===== */
    const ul = document.createElement('ul');
    ul.className = 'card-list';


    list.cards.forEach(card => {
      const li = document.createElement('li');
      li.className = 'card';
      li.dataset.id = card.id;

      li.style.borderLeft = card.color
        ? `6px solid ${card.color}`
        : '';


      li.innerHTML = `
<strong>${card.title}</strong>


${card.tags?.length
        ? `<div class="tags">
${card.tags.map(t => `<span class="tag">${t}</span>`).join('')}
</div>`
        : ''}


${card.memo ? `<p class="memo">${card.memo}</p>` : ''}
`;

      li.onclick = () => openCardModal(card, list.id);


      li.oncontextmenu = (e) => {
        e.preventDefault();
        if (!confirm('이 카드 삭제할까?')) return;
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
        syncFromDOM();
        saveBoard(currentBoard);
      }
    });

    new Sortable(document.getElementById('board'), {
      animation: 200,
      handle: '.list-header', // 제목 잡고 이동
      draggable: 'section',
      onEnd: () => {
        syncListsFromDOM();
        saveBoard(currentBoard);
      }
    });
  });


  /* ===== 리스트 추가 버튼 (한 번만) ===== */
  const addListBtn = document.createElement('button');
  addListBtn.className = 'add-list';
  addListBtn.textContent = '+ 리스트 추가';
  addListBtn.onclick = () => {
    const title = prompt('리스트 이름');
    if (!title) return;
    currentBoard.lists.push({
      id: Date.now().toString(),
      title,
      cards: []
    });
    saveBoard(currentBoard);
    render(currentBoard);
  };
  el.appendChild(addListBtn);
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
  document.querySelectorAll('section').forEach(section => {
    const listId = section.dataset.id;
    const list = currentBoard.lists.find(l => l.id === listId);


    list.cards = [...section.querySelectorAll('.card')].map(cardEl => {
      const titleEl = cardEl.querySelector('strong');
      const memoEl = cardEl.querySelector('.memo');


      return {
        id: cardEl.dataset.id,
        title: titleEl ? titleEl.textContent : '',
        memo: memoEl ? memoEl.textContent : ''
      };
    });
  });
}

function openCardModal(card, listId) {
  editingCard = card;
  editingListId = listId;
  document.getElementById('modalTitleText').textContent = '카드 편집';
  document.getElementById('modalTitle').value = card.title;
  document.getElementById('modalMemo').value = card.memo || '';
  document.getElementById('modalTags').value =
    card.tags?.join(', ') || '';


  document.getElementById('modalColor').value =
    card.color || '#1e293b';


  document.getElementById('cardModal').classList.remove('hidden');
}

function openNewCardModal(listId) {
  editingCard = null;
  editingListId = listId;
  document.getElementById('modalTitleText').textContent = '카드 추가';
  document.getElementById('modalTitle').value = '';
  document.getElementById('modalMemo').value = '';
  document.getElementById('modalTags').value = '';
  document.getElementById('modalColor').value = '#1e293b';


  document.getElementById('cardModal').classList.remove('hidden');
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
init();
