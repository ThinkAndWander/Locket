/** Simple undo-redo stack that stores diffs. No fancy stuff, but it can be expanded for that as needed. */
type history<T> = {
  /** The current value of the history. */
  current: T,

  /** The changes in the history value. Deletions do not happen. */
  deltas: Partial<T>[],

  /** The position in the delta array. Earlier = undo, later = redo. Up-to-date is the last element. */
  deltaIndex: number
}

export function redo(changes: Partial<storageData>): void {
  forEachProperty()
}

/** Iterates objects and arrays and performs a callback on each leaf node. Used for undo. */
function forEachProperty(
  root: {[key: string]: any} | any[],
  stufftodo: (container: {[key: string]: any} | any[], keyOrIndex: string|number) => void)
{
  if (Array.isArray(root)) {
      root.forEach((entry, index) => {
          if (entry !== null && (Array.isArray(entry) || typeof entry === 'object')) {
              forEachProperty(entry, stufftodo)
          } else {
              stufftodo(root, index)
          }
      })
  }
  else if (typeof root === 'object') {
      const keys = Object.keys(root)
      keys.forEach(key => {
          if (root[key] !== null && (Array.isArray(root[key]) || typeof root[key] === 'object')) {
              forEachProperty(root[key], stufftodo)
          } else {
              stufftodo(root, key)
          }
      })
  }
}