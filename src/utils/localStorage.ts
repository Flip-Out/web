export enum LOCAL_STORAGE {
  TELEGRAM_AUTH_DATA = 'TELEGRAM_AUTH_DATA',
  AEON_URL = 'AEON_URL',
  AEON_TITLE = 'AEON_TITLE',
}

export function saveToLocalStorage(key: LOCAL_STORAGE, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (_) {
    return false;
  }
}

export function loadFromLocalStorage<T>(key: LOCAL_STORAGE): T | null {
  try {
    const value = localStorage.getItem(key) as T;
    return value;
  } catch (_) {
    return null;
  }
}

export function removeFromLocalStorage(key: LOCAL_STORAGE): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (_) {
    return false;
  }
}
