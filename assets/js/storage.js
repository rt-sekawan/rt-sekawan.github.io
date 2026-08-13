// storage.js
const DB_NAME = 'jimpitan-db';
const DB_VERSION = 1;
const DRAFT_STORE = 'drafts';

let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        const store = db.createObjectStore(DRAFT_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('tanggal', 'tanggal', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function saveDraft(draft) {
  if (!db) await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE, 'readwrite');
    const store = tx.objectStore(DRAFT_STORE);
    draft.timestamp = Date.now();
    const request = store.add(draft);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getDraftsByTanggal(tanggal) {
  if (!db) await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE, 'readonly');
    const store = tx.objectStore(DRAFT_STORE);
    const index = store.index('tanggal');
    const request = index.getAll(tanggal);
    request.onsuccess = () => {
      // Filter drafts not older than 48 jam
      const now = Date.now();
      const valid = request.result.filter(d => now - d.timestamp < 48*60*60*1000);
      resolve(valid);
    };
    request.onerror = () => reject(request.error);
  });
}

async function deleteDraft(id) {
  if (!db) await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE, 'readwrite');
    const store = tx.objectStore(DRAFT_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}