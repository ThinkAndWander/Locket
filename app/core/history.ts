/** Simple undo-redo stack that stores diffs. No fancy stuff, but it can be expanded for that as needed. */
type history<T extends object> = {
    /** The current value of the history. */
    current: T,

    /** The changes in the history value. Deletions do not happen. */
    deltas: Partial<T>[],

    /** The position in the delta array. Earlier = undo, later = redo. Up-to-date is the last element. */
    deltaIndex: number
}

/** Redo one item in the history if there is anything to redo. */
export function redo<T extends object>(history: history<T>): void {

    if (history.deltaIndex < history.deltas.length - 1) {

        forEachProperty(history.current, (tree, keyIndex) => {
            
            tree.reduce()

            if (Array.isArray(container)) {
                history.current
                storage[keyIndex]
            } else {
                storage[keyIndex]
            }
        })

        history.deltaIndex++
    }
}

type container = {[key: string]: any} | any[]
type indexer = string | number

/** Simple object-array iterator. Does not detect cycles in graph, or expand iterators, or DOM. A callback is made on
 * each leaf node, giving the current container (array or object), the name of the key or index number to retrieve the
 * value (such as[this] for arrays or as.this, which will require checking the type), and an array of 2-tuples of prior
 * container+indexer values (in order from start to end). That tree is empty at root level, so it only has a value
 * after
 */
function forEachProperty(
    root: container,
    callback: (parentTree: [container, indexer][], keyOrIndex: indexer) => void,
    parentTree?: [container, indexer][])
{
    parentTree ??= []

    if (Array.isArray(root)) {
        root.forEach((entry, index) => {
            if (entry !== null && (Array.isArray(entry) || typeof entry === 'object')) {
                parentTree.push([root, entry])
                forEachProperty(entry, callback, parentTree.map(o => [...o]))
            } else {
                callback(parentTree, index)
            }
        })
    } else if (typeof root === 'object') {
        const keys = Object.keys(root)
        keys.forEach(key => {
            if (root[key] !== null && (Array.isArray(root[key]) || typeof root[key] === 'object')) {
                parentTree.push([root, key])
                forEachProperty(root[key], callback, parentTree)
            } else {
                callback(parentTree, key)
            }
        })
    }
}