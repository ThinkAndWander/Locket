type trayBase<T> = { value?: T }
type trayItem<T> = trayBase<T> & { name: string }
type possibleTrayItem<T> = trayBase<T> & { name?: string }

const defaultSearchCutoff = 5
let uniqueIDCounter = -1

/** An opinionated input + suggestions list. T is the value of an optional element (use never to ensure none).
 * The browser-native DetailsList isn't fully available, does not read out changes in Firefox + Narrator, and has
 * various other issues as usual for native HTML (as of 2026). It needs to be well-supported for 5 years before we can
 * consider using it. Until then, we wrote an accessibility-friendly solution.
 * 
 * Classnames: suggestableInputSearchbox, suggestableInputTray, suggestableInputContainer, suggestableInputEntry */
export class SuggestedInput<T> {
    private _trayItems: trayItem<T>[] = []
    private _chosen: possibleTrayItem<T> = {}
    private _allEntries: trayItem<T>[] = []
    private _searchTray: HTMLDivElement
    public readonly searchbox: HTMLInputElement
    public readonly container: HTMLDivElement
    public searchCutoff = defaultSearchCutoff

    constructor(prefilledText?: string, items?: trayItem<T>[]) {
        this.searchbox = document.createElement('input')
        this.searchbox.className = "suggestableInputSearchbox"
        this.searchbox.type = "text"
        this.searchbox.ariaAutoComplete = 'list'
        this.searchbox.role = 'combobox'
        this.searchbox.ariaExpanded = 'false'
        this.searchbox.setAttribute('aria-controls', `searchbox${++uniqueIDCounter}`)

        this._searchTray = document.createElement('div')
        this._searchTray.className = "suggestableInputTray"
        this._searchTray.style.display = "none"
        this._searchTray.ariaLive = "polite"
        this._searchTray.id = `searchbox${uniqueIDCounter}`
        this.container = document.createElement('div')

        const containerItems = document.createElement('div')
        containerItems.className = "suggestableInputContainer"
        containerItems.appendChild(this.searchbox)
        containerItems.appendChild(this._searchTray)
        this.container.appendChild(containerItems)       

        this.container.addEventListener("keydown", this._onKeyDown)
        this.searchbox.addEventListener("input", this._onInput)

        if (prefilledText) {
            this.searchbox.value = prefilledText
        }
        if (items) {
            this.setSearchList(items)
        }

        this._searchTray.style.display = "none"
        this.searchbox.ariaExpanded = 'false'
    }

    /** Re-renders tray items without popping open. */
    public setSelection(text: string) {
        this.searchbox.value = text
        this._renderTrayItems(true)
    }

    /** Re-renders tray items without popping open. */
    public setSearchList = (items: trayItem<T>[]) => {
        this._allEntries = items
        this._renderTrayItems(true)
    }

    private _renderTrayItems = (noAutoShow?: boolean) => {
            this._trayItems = []
            const newItems: [HTMLElement, trayItem<T>][] = []
            const noFilter = !this.searchbox.value || this.searchbox.value.trim() === ""
            const lowercaseQuery = (this.searchbox.value.trim() ?? "").toLowerCase()

            const itemsExact: trayItem<T>[] = []
            const itemsStartsWith: trayItem<T>[] = []
            const itemsContains: trayItem<T>[] = []
            const itemsIncludes: trayItem<T>[] = []

            if (!noAutoShow) {
                this._searchTray.style.display = ""
                this.searchbox.ariaExpanded = 'true'
            }

            if (noFilter) {
                for (let i = 0; i < this._allEntries.length && i < defaultSearchCutoff; i++) {
                    newItems.push([this._renderTrayItem(this._allEntries[i]), this._allEntries[i]])
                    this._trayItems.push(this._allEntries[i])
                }
            } else {
                let lowercaseMatch: string

                this._allEntries.forEach(entry => {
                    lowercaseMatch = entry.name.toLowerCase()

                    if (lowercaseQuery === lowercaseMatch) {
                        itemsExact.push(entry)
                    } else if (lowercaseMatch.startsWith(lowercaseQuery)) {
                        itemsStartsWith.push(entry)
                    } else if (lowercaseMatch.includes(lowercaseQuery)) {
                        itemsContains.push(entry)
                    } else if (lowercaseMatch.split(' ').some(word => lowercaseQuery.includes(word))) {
                        itemsIncludes.push(entry)
                    }
                })

                ;[itemsExact, itemsStartsWith, itemsContains, itemsIncludes].every(list => {
                    list.sort((a, b) => a.name.localeCompare(b.name))

                    for (let i = 0; i < list.length && this._trayItems.length < defaultSearchCutoff; i++) {
                        this._trayItems.push(list[i])
                        newItems.push([this._renderTrayItem(list[i]), list[i]])
                    }

                    return this._trayItems.length < defaultSearchCutoff
                })
            }

            this._searchTray.replaceChildren(...newItems.map(o => o[0]))
    }

    private _renderTrayItem = (item: trayItem<T>) => {
        const buttonElements: (Node | string)[] = [item.name]
        const newButton = document.createElement('button')
        newButton.className = 'suggestableInputEntry'

        for (const element of buttonElements) {
            newButton.append(element)
        }

        newButton.addEventListener("click", () => this._selectTrayItem(item))
        return newButton
    }

    private _selectTrayItem = (item: trayItem<T>) => {
        this._chosen = {...item}
        this.searchbox.value = item.name
        this.searchbox.dispatchEvent(new InputEvent('input'))
        this._searchTray.style.display = "none"
        this.searchbox.ariaExpanded = 'false'
        this.searchbox.focus()
    }

    private _getIndexOfActiveTrayItem = (): number => {
        if (this._searchTray.contains(document.activeElement)) {
            for (let i = 0; i < this._searchTray.children.length; i++) {
                if (document.activeElement === this._searchTray.children.item(i)) {
                    return i
                }
            }
        }

        return -1
    }

    private _onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
            if (this._searchTray.style.display !== "none") {
                // Search tray is open with a button focused. Enter selects it. 
                if (this._searchTray.contains(document.activeElement)) {
                    const index = this._getIndexOfActiveTrayItem()
                    if (index !== -1) {
                        this._selectTrayItem(this._trayItems[index])
                    }
                }
                // Search tray is open/unfocused and we haven't matched the tray item yet. Match it.
                else if (!this._chosen.name) {
                    const match = this._trayItems.findIndex(o => o.name.toLowerCase() === this.searchbox.value.trim().toLowerCase())
                    this._chosen = {...this._trayItems[match !== -1 ? match : 0]}
                }
            }
        }
        else if (event.key === "Escape") {
            if (this._searchTray.style.display !== "none") {
                this._searchTray.style.display = "none"
                this.searchbox.ariaExpanded = 'false'
                this.searchbox.focus()
            }
        } else if (event.key === "ArrowDown") {
            if (this._searchTray.style.display === "none") {
                if (this._searchTray.children.length === 0) {
                    this._renderTrayItems()
                } else {
                    this._searchTray.style.display = ""
                    this.searchbox.ariaExpanded = 'true'
                }
                (this._searchTray.firstElementChild as HTMLButtonElement)?.focus()
            } else {
                const index = this._getIndexOfActiveTrayItem()
                if (index !== -1 && index < this._trayItems.length - 1) {
                    this._chosen = {...this._trayItems[index + 1]}
                    ;(this._searchTray.children.item(index + 1) as HTMLButtonElement)?.focus()
                } else if (index === -1) {
                    (this._searchTray.firstElementChild as HTMLButtonElement)?.focus()
                }
            }
        } else if (event.key === "ArrowUp") {
            if (this._searchTray.style.display !== "none") {
                const index = this._getIndexOfActiveTrayItem()
                if (index !== -1 && index > 0) {
                    this._chosen = {...this._trayItems[index - 1]}
                    ;(this._searchTray.children.item(index - 1) as HTMLButtonElement)?.focus()
                } else if (index === 0) {
                    this.searchbox.focus()
                    this.searchbox.select()
                }
            }
        } else if (document.activeElement !== this.searchbox) {
            // Forward keys to the searchbox and refocus it if the user types when it's unfocused.
            if (event.key === "Backspace" || event.key === "Delete") {
                if (this.searchbox.selectionStart !== this.searchbox.selectionEnd) {
                    this.searchbox.value = 
                        this.searchbox.value.slice(0, this.searchbox.selectionStart ?? 0) +
                        this.searchbox.value.slice(this.searchbox.selectionEnd ?? this.searchbox.selectionStart ?? 0)
                } else {
                    this.searchbox.value = this.searchbox.value.slice(0, -1)
                }

                this.searchbox.focus()
                this._renderTrayItems()
            } else if (event.key === " " && event.ctrlKey) {
                this._renderTrayItems() // Ctrl + Space to force visibility
            }  else if (event.key.length === 1) {
                this.searchbox.value += event.key
                this.searchbox.focus()
                this._renderTrayItems()
            }
        }

        // Avoid jumping around with arrowkeys and space (comma or slash, etc.)
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA' &&
            (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key.length === 1 /* space comma slash etc. */))
        {
            event.preventDefault()
        }

        event.stopImmediatePropagation()
    }

    private _onInput = (): void => {
        this._renderTrayItems()
    }
}
