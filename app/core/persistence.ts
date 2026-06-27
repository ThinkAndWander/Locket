import { getSupportedLocale, ILocalizedStrings, ILocalizedStringSets, supportedLocales } from "./localization"
import { localizedStrings } from "./localizedStrings"

// Use only one storage key to avoid ever creating fragments from coding mistakes.
const _localStorageKey = 'LocketGame'

export type localStorageVariables = {
  locale: string
}

/** This is called in start.ts, filling in defaults and is safe to use immediately. Do not reassign. */
export let loadedLocalStorage: Readonly<localStorageVariables>

/** Combines a partial local storage copy to fill in with current loaded data, else defaults. */
function _fillDefaults(storage: Partial<localStorageVariables>): localStorageVariables {
  storage.locale ??= loadedLocalStorage?.locale ?? getSupportedLocale()
  return storage as localStorageVariables
}

/** Saves all values in the local storage object. */
export function saveToLocalStorage(state: localStorageVariables): void {
  localStorage.setItem(_localStorageKey, JSON.stringify(_fillDefaults(state)))
}

/** Loads all persisted preferences, filling in defaults and populating strings of the resolved locale. */
export function loadFromLocalStorage(): void {
  const json = localStorage.getItem(_localStorageKey)

  try { loadedLocalStorage = _fillDefaults(JSON.parse(json ?? '{}') as Partial<localStorageVariables>) } 
  catch { loadedLocalStorage = _fillDefaults({}) }

  // Local storage combines with locale, making it the source of truth. Exposing this from localization would require
  // a call to persistence.ts and create a circular reference, so it's done here instead.
  _locale = loadedLocalStorage.locale as keyof ILocalizedStringSets ?? getSupportedLocale()
  strings = localizedStrings[supportedLocales[_locale] as keyof typeof localizedStrings]
}

/** The current locale. Assigned only once at the start. Do not reassign. */
let _locale: keyof ILocalizedStringSets

/** Strings localized. This doesn't include placeholders. Assigned once at the start. Do not reassign. */
export let strings: Readonly<ILocalizedStrings>