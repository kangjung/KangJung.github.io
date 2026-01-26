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

    if (!title) {
      alert('제목은 필수입니다.');
      return;
    }
    if (editingCard) {
      editingCard.title = title;
      editingCard.memo = memo;
    }
    else {
      const list = currentBoard.lists.find(l => l.id === editingListId);
      list.cards.push({
        id: Date.now().toString(),
        title,
        memo
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


    const header = document.createElement('div');
    header.innerHTML = `
<h3>${list.title}</h3>
<button onclick="openNewCardModal('${list.id}')">+ 카드</button>
`;


    const ul = document.createElement('ul');
    ul.className = 'card-list';


    list.cards.forEach(card => {
      const li = document.createElement('li');
      li.className = 'card';
      li.dataset.id = card.id;
      li.innerHTML = `
<strong>${card.title}</strong>
${card.memo ? `<p class="memo">${card.memo}</p>` : ''}
`;


      li.onclick = () => {
        openCardModal(card, list.id);
      };

      li.oncontextmenu = (e) => {
        e.preventDefault();


        if (!confirm('이 카드 삭제할까?')) return;

        const list = currentBoard.lists.find(l =>
          l.cards.some(c => c.id === card.id)
        );

        list.cards = list.cards.filter(c => c.id !== card.id);


        saveBoard(currentBoard);
        render(currentBoard);
      };

      ul.appendChild(li);
    });


    section.appendChild(header);
    section.appendChild(ul);
    el.appendChild(section);


    new Sortable(ul, {
      group: 'cards',
      animation: 150,
      onEnd: () => {
        syncFromDOM();
        saveBoard(currentBoard);
      }
    });
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
  document.getElementById('cardModal').classList.remove('hidden');
}

function openNewCardModal(listId) {
  editingCard = null;
  editingListId = listId;
  document.getElementById('modalTitleText').textContent = '카드 추가';
  document.getElementById('modalTitle').value = '';
  document.getElementById('modalMemo').value = '';
  document.getElementById('cardModal').classList.remove('hidden');
}

function getBoardKey() {
  return `board:${location.host}`;
}
init();
