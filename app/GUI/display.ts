import { storage } from "../core/persistence"
import { defaultZoom } from "./consts"
import { applyDisplayPreferences, initPreferencesPage, togglePreferences } from "./preferencesPage"

let _out: HTMLElement // Output region.
let _in: HTMLTextAreaElement // Input textbox.

// The reading ruler and above/below for its cut-out mode, if used, and positioned in main column.
let _readingFocusRuler: HTMLDivElement
let _readingRulerAbove: HTMLDivElement
let _readingRulerBelow: HTMLDivElement
let _mainColumn: HTMLDivElement

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

    _readingFocusRuler = document.getElementById('readRuler') as HTMLDivElement
    _readingRulerAbove = document.getElementById('readRulerAbove') as HTMLDivElement
    _readingRulerBelow = document.getElementById('readRulerBelow') as HTMLDivElement
    _mainColumn = document.getElementById('mainColumn') as HTMLDivElement

    _initHeaderBar()
    initPreferencesPage()

    hideInput() // Hide by default.
    togglePreferences(false) // Hide the preferences page.
    applyDisplayPreferences()
    _adjustReadRuler()
}

/** Sets up all buttons on the header. */
function _initHeaderBar(): void {
    const headerSettings = document.getElementById('headerSettings') as HTMLButtonElement
    headerSettings.addEventListener('click', () => {
        _adjustReadRuler() // Before toggle prefs so it can get hidden.
        togglePreferences()
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

/** If used, moves the reading ruler according to chosen controls. Also adjusts its display. */
function _adjustReadRuler(): void {
    document.body.removeEventListener('mouseup', _updateReadRulerOnTap)
    document.body.removeEventListener('mousemove', _updateReadRulerOnDragHover)

    if (storage.display.readingFocus?.type === 'Ruler') {
        const colorOutside = storage.display.readingFocus.behavior === 'Color outside'
        _readingFocusRuler.style.display = ''
        _readingRulerAbove.style.display = colorOutside ? '' : 'none'
        _readingRulerBelow.style.display = colorOutside ? '' : 'none'
        _readingFocusRuler.style.visibility = colorOutside ? 'hidden' : 'visible'
        _readingFocusRuler.style.height = `calc(${storage.display.readingFocus.size ?? '4rem'} * ${storage.display.zoom ?? defaultZoom()})`

        if (storage.display.readingFocus.controls) {
            document.body.addEventListener('mouseup', _updateReadRulerOnTap)
        }
        if (!storage.display.readingFocus.controls ||
            storage.display.readingFocus.controls === 'Move on tap and drag' ||
            storage.display.readingFocus.controls === 'Move on tap, drag, and hover')
        {
            document.body.addEventListener('mousemove', _updateReadRulerOnDragHover)
        }
    } else {
        _readingFocusRuler.style.display = 'none'
    }
}

function _updateReadRulerOnTap(ev: MouseEvent): void { _updateReadRulerPos(ev, true) }
function _updateReadRulerOnDragHover(ev: MouseEvent): void { _updateReadRulerPos(ev, false) }

/** Centers the reading ruler on the mouse, clamped to the output area bounds. */
function _updateReadRulerPos(ev: MouseEvent, isTap: boolean): void {
    if (storage.display.readingFocus?.type === 'Ruler'
        && storage.display.readingFocus.controls === 'Move on tap and drag'
        && ev.buttons === 0 && !isTap)
    {
        return
    }

    const mainBounds = _mainColumn.getBoundingClientRect()
    const mainTop = mainBounds.top ?? 0
    const mainHeight = mainBounds.height ?? 0
    _readingFocusRuler.style.top = `clamp(
        ${mainTop}px,
        ${ev.clientY + window.scrollY - _readingFocusRuler.clientHeight / 2}px,
        calc(100% - ${_readingFocusRuler.clientHeight}px))`

    if (storage.display.readingFocus?.type === 'Ruler') {
        if (storage.display.readingFocus.behavior === 'Color outside') {
            const start = ev.clientY + window.scrollY + _readingFocusRuler.clientHeight / 2
            _readingRulerAbove.style.top = `${mainTop + window.scrollY}px`
            _readingRulerAbove.style.height = `min(
                ${mainHeight - _readingFocusRuler.clientHeight}px,
                ${Math.max(0, ev.clientY - mainTop - _readingFocusRuler.clientHeight / 2)}px)`
            _readingRulerBelow.style.height = `calc(100% - ${Math.max(start, mainTop)}px)`
            _readingRulerBelow.style.top = `${Math.max(start, mainTop)}px`
        }
    }
}
