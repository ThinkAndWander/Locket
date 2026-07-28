import { allThemes, displayPreferences, milestone } from "./model/model"
import { deepMergeInto } from "./utils"

// Use only one storage key to avoid ever creating fragments from coding mistakes.
const _localStorageKey = 'LocketGame'
const _localStorageFlushDelay = 300
let _savingTimerId: number | undefined

/** The variables persisted in the user's local storage. Never add identifying info here. */
export type storageData = {
  /** The user's active theme by name, or an empty string if not explicitly set. */
  theme: keyof allThemes | ''

  /** The user's display settings. */
  display: displayPreferences

  /** All milestones the player has ever unlocked. */
  milestones: milestone[]
}

/** A record of storage data changes in this session, to power undo/redo. */
let _storageHistory: Partial<storageData[]>

/** Tracks location in redo history. */
let _storageHistoryIndex: number

/** This is called in start.ts, filling in defaults and is safe to use immediately. Do not reassign. Anything depending
 * on value changes here should coordinate with a function so they can receive updates. */
export let storage: storageData

/** Combines a partial local storage copy to fill in with current loaded data, else defaults. */
function _fillDefaults(storage: Partial<storageData>): storageData {
  storage.milestones ??= []
  storage.theme ??= ''
  storage.display ??= {}
  return storage as storageData
}

/** Saves all values in the local storage object after ~300ms of not calling this function (to allow rapid changes to
 * pool, such as active user input). Setting immediate = true will flush to local storage without waiting. */
export function saveToLocalStorage(immediate?: boolean): void {
  if (immediate) {
    window.clearTimeout(_savingTimerId)
    localStorage.setItem(_localStorageKey, JSON.stringify(_fillDefaults(storage)))
  } else {
    window.clearTimeout(_savingTimerId)
    _savingTimerId = window.setTimeout(() => {
      localStorage.setItem(_localStorageKey, JSON.stringify(_fillDefaults(storage)))
    }, _localStorageFlushDelay)
  }
}

/** Loads all persisted preferences, filling in defaults. */
export function loadFromLocalStorage(): void {
  const json = localStorage.getItem(_localStorageKey)

  try { storage = _fillDefaults(JSON.parse(json ?? '{}') as Partial<storageData>) } 
  catch { storage = _fillDefaults({}) }
}

export function recordChange(changes: Partial<storageData>): void {
  deepMergeInto(storage, changes)
}

export function redo(changes: Partial<storageData>): void {
  deepMergeInto(storage, changes)
}
