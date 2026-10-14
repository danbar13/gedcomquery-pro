import { GedcomTree } from '../types/gedcom';

const DB_NAME = 'GedcomQueryProDB';
const STORE_NAME = 'treeStore';
const DB_VERSION = 1;
const CURRENT_TREE_KEY = 'active_tree';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveTreeToStorage(tree: GedcomTree): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(tree, CURRENT_TREE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback to localStorage if IndexedDB fails
    try {
      localStorage.setItem(CURRENT_TREE_KEY, JSON.stringify(tree));
    } catch (e) {
      console.warn('Local storage fallback save failed:', e);
    }
  }
}

export async function loadTreeFromStorage(): Promise<GedcomTree | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(CURRENT_TREE_KEY);
      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    try {
      const data = localStorage.getItem(CURRENT_TREE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

export async function clearTreeStorage(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(CURRENT_TREE_KEY);
  } catch {
    localStorage.removeItem(CURRENT_TREE_KEY);
  }
}
