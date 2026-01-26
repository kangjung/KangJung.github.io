const DB_NAME = 'memoBoardDB';
const STORE = 'board';


function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);


    req.onupgradeneeded = e => {
      const db = e.target.result;
      db.createObjectStore(STORE);
    };


    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}


async function saveBoard(board) {
  const db = await openDB();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).put(board, getBoardKey());
}


async function loadBoard() {
  const db = await openDB();
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);


  return new Promise((resolve) => {
    const req = store.get(getBoardKey());
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}
