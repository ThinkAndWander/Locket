// Use only one storage key to avoid ever creating fragments from coding mistakes.
const _localStorageKey = 'LocketGame'

export type localStorageVariables = {
  // TODO
}

/** This is called in start.ts, filling in defaults and is safe to use immediately. Do not reassign. */
export let loadedLocalStorage: Readonly<localStorageVariables>

/** Combines a partial local storage copy to fill in with current loaded data, else defaults. */
function _fillDefaults(storage: Partial<localStorageVariables>): localStorageVariables {
  // TODO
  return storage as localStorageVariables
}

/** Saves all values in the local storage object. */
export function saveToLocalStorage(state: localStorageVariables): void {
  localStorage.setItem(_localStorageKey, JSON.stringify(_fillDefaults(state)))
}

/** Loads all persisted preferences, filling in defaults. */
export function loadFromLocalStorage(): void {
  const json = localStorage.getItem(_localStorageKey)

  try { loadedLocalStorage = _fillDefaults(JSON.parse(json ?? '{}') as Partial<localStorageVariables>) } 
  catch { loadedLocalStorage = _fillDefaults({}) }
}