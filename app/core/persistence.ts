import { getSupportedLocale } from "./localization"

// Use only one storage key to avoid ever creating fragments from coding mistakes.
const localStorageKey = 'LocketGame'
export type localStorageVariables = {
  locale: string
}

/** This can safely be assumed to exist because it's called at the start of the app, before reading storage.
 * 
 *  Undefined until loadStorage is called. Then it gets filled, even if it fails to load (fills with defaults).
 * It remains defined at all times. */
export let loadedLocalStorage: localStorageVariables

/** Combines a partial local storage copy to fill in with current loaded data, else defaults. */
function fillDefaults(storage: Partial<localStorageVariables>) {
  storage.locale ??= getSupportedLocale(true)
  return storage as localStorageVariables
}

export function saveToLocalStorage(state: localStorageVariables) {
  localStorage.setItem(localStorageKey, JSON.stringify(fillDefaults(state)))
}

export function loadFromLocalStorage() {
  const json = localStorage.getItem(localStorageKey)

  if (json) {
    try { loadedLocalStorage = fillDefaults(JSON.parse(json) as Partial<localStorageVariables>) } 
    catch { loadedLocalStorage = fillDefaults({}); return }
  }
}
