import { storage } from "../core/persistence"
import { applyDisplayPreferences, initPreferencesPage, togglePreferences } from "./preferencesPage"

let _out: HTMLElement // Output region.
let _in: HTMLTextAreaElement // Input textbox.
let _readingRuler: HTMLDivElement // An optional reading ruler over the output.

/** Subscribers to input submission. */
let _onInputSubmitted: ((input: string) => void)[] = []

let _everInitDisplay = false

/** Handles submission. */
function _onInputKey(kbEvent: KeyboardEvent): void {
    if (kbEvent.key === 'Enter') {
        _onInputSubmitted.forEach(callback => callback(_in.textContent ?? ""))
        _in.textContent = ""
        clearInputListeners()
    }
}

/** Initializes the display elements for the game. */
export function initDisplay(): void {
    if (_everInitDisplay) { return }
    _everInitDisplay = true

    _out = document.getElementById('outputArea') as HTMLElement
    _in = document.getElementById('inputArea') as HTMLTextAreaElement
    _in.addEventListener('keydown', (kbEvent) => _onInputKey(kbEvent))

    _readingRuler = document.getElementById('readRuler') as HTMLDivElement

    _initHeaderBar()
    initPreferencesPage()

    hideInput() // Hide by default.
    togglePreferences(false) // Hide the preferences page.
    applyDisplayPreferences()
    _adjustReadRuler() // Hide or show read ruler by default.
}

/** Sets up all buttons on the header. */
function _initHeaderBar(): void {
    const headerSettings = document.getElementById('headerSettings') as HTMLButtonElement
    headerSettings.addEventListener('click', () => {
        togglePreferences()
        _adjustReadRuler()
    })
}

/** Append any HTML element to the output. If all output is cleared, use the "autofocus" property on the first item to
 * focus it for accessibility. */
export function outputHTML(clear?: boolean, ...entries: HTMLElement[]): void {
    if (clear) {
        _out.replaceChildren(...entries)
    } else {
        _out.append(...entries)
    }
}

/** Appends unsanitized text to output. */
export function outputText(text: string) {
    _out.append(text)
}

/** Input listeners fire when the textbox receives input. */
export function subscribeInputListener(callback: (input: string) => void): void {
    _onInputSubmitted.push(callback)
}

/** Shows or hides user text input. */
export function hideInput(show?: boolean): void {
    if (show) {
        _in.style.display = ''
        _in.disabled = false
    } else {
        _in.style.display = 'none'
        _in.disabled = true
    }
}

/** Remove callbacks that happen on submission of input. */
export function clearInputListeners(): void {
    _onInputSubmitted = []
}

/** Sets the reading ruler's hidden status or not, de/registering event listeners. */
function _adjustReadRuler(): void {
    document.body.removeEventListener('mousemove', _updateReadRulerPos)

    if (storage.display.readRulerStyle?.type === 'Ruler') {
        _readingRuler.style.backgroundColor = 'rgba(255, 255, 0, 0.25)' // TODO
        _readingRuler.style.height = `calc(${storage.display.readRulerStyle.height ?? 4}rem * ${storage.display.zoom ?? 1})`
        _readingRuler.style.display = ''
        document.body.addEventListener('mousemove', _updateReadRulerPos)
    } else {
        _readingRuler.style.display = 'none'
    }
}

/** Moves the reading ruler to the mouse, offset such that it hangs under the mouse at the top of the document and
 * above the mouse at the bottom. */
function _updateReadRulerPos(ev: MouseEvent): void {
    // Pos is mouse position. ScrollPos factors in the scrollbar so it stays in the right space
    // as you scroll. Offset interpolates along the length of the body to change the origin, subtly shifting
    // the pointing device so that it's aligned to the bottom at the bottom, and top at the top. That's why it
    // multiplies by the height of 2rem.
    const pos = ev.clientY + window.scrollY
    const interpolatedOffset = (pos / document.body.clientHeight)
    _readingRuler.style.top = `calc(${pos}px - ${interpolatedOffset} * ${_readingRuler.clientHeight}px)`
}