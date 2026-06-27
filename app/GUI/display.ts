import { strings } from "../core/persistence"

let _container: HTMLDivElement // Container.
let _out: HTMLDivElement // Output region.
let _in: HTMLTextAreaElement // Input textbox.

/** Subscribers to input submission. */
let _onInputSubmitted: ((input: string) => void)[] = []

/** Handles submission. */
function _onInputKey(kbEvent: KeyboardEvent): void {
    if (kbEvent.key === 'Enter') {
        _onInputSubmitted.forEach(callback => callback(_in.textContent ?? ""))
        _in.textContent = ""
        clearInputListeners();
    }
}

/** Initializes the display elements for the game. */
export function initDisplay(): void {
    _container = document.createElement('div')
    _container.style.display = 'flex'
    _container.style.flexDirection = 'column'
    document.body.appendChild(_container)

    _out = document.createElement('div')
    _out.ariaLive = 'polite'
    _out.style.display = 'flex'
    _out.style.flexDirection = 'column'
    _out.style.width = '100vw'
    _out.style.minHeight = '50%'
    _container.appendChild(_out)

    _in = document.createElement('textarea')
    _in.addEventListener('keydown', (kbEvent) => _onInputKey(kbEvent))
    _in.enterKeyHint = strings.IMEInputKeyHint
    _in.spellcheck = false
    _container.appendChild(_in)
}

/** Append any HTML element to the output. If all output is cleared, use the "autofocus" property on the first item to
 * focus it for accessibility. */
export function appendOutput(clear?: boolean, ...entries: HTMLElement[]): void {
    if (clear) {
        _out.replaceChildren(...entries)
    } else {
        _out.append(...entries)
    }
}

/** Input listeners fire when the textbox receives input. */
export function subscribeInputListener(callback: (input: string) => void): void {
    _onInputSubmitted.push(callback)
}

/** Shows or hides user text input. */
export function showInput(show?: boolean): void {
    if (show) {
        _in.style.display = ''
    } else {
        _in.style.display = 'none'
    }
}

/** Remove callbacks that happen on submission of input. */
export function clearInputListeners(): void {
    _onInputSubmitted = []
}
