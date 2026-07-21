import { allThemes } from "../core/model/model"
import { loadedLocalStorage, saveToLocalStorage } from "../core/persistence"
import { applyTheme, resolveCSSFilter, themes } from "./theme"

let _out: HTMLElement // Output region.
let _in: HTMLTextAreaElement // Input textbox.

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

    _initHeaderBar()
    _initPreferencesPage()

    hideInput() // Hide by default.
    togglePreferences(false) // Hide the preferences page.
    applyDisplayPreferences()
}

/** Sets up all buttons on the header. */
function _initHeaderBar(): void {
    const headerSettings = document.getElementById('headerSettings') as HTMLButtonElement
    headerSettings.addEventListener('click', () => togglePreferences())
}

/** Sets up the preferences page. */
function _initPreferencesPage(): void {
    //#region Reading column width
    const columnWidths = [
        ['Narrow', '30vw'],
        ['Default', '50vw'],
        ['Wide', '70vw'],
        ['Full size', '100vw']]

    const columnWidth = document.getElementById('prefsColumnWidth') as HTMLSelectElement
    columnWidths.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[1]
        if (loadedLocalStorage.display.columnWidth === entry[1]) {
            option.selected = true
        }
        columnWidth.appendChild(option)
    })

    columnWidth.addEventListener("change", () => {
        loadedLocalStorage.display.columnWidth = columnWidth.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Line spacing
    const lineSpacings = [
        ['Dense', '1rem'],
        ['Default', '1.2rem'],
        ['More', '1.5rem'],
        ['Double', '2rem'],
        ['Spacious', '3rem']]

    const lineSpacing = document.getElementById('prefsLineHeight') as HTMLSelectElement
    lineSpacings.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[1]
        if (loadedLocalStorage.display.lineHeight === entry[1]) {
            option.selected = true
        }
        lineSpacing.appendChild(option)
    })

    lineSpacing.addEventListener("change", () => {
        loadedLocalStorage.display.lineHeight = lineSpacing.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Theme and custom filter
    const themeDropdown = document.getElementById('prefsTheme') as HTMLSelectElement
    const defaultThemeOption = document.createElement("option")
        defaultThemeOption.value = ''
        defaultThemeOption.text = 'Detect'
        themeDropdown.appendChild(defaultThemeOption)
        themeDropdown.appendChild(document.createElement('hr'))

    const prefsCustomFilter = document.getElementById('prefsCustomFilter') as HTMLTextAreaElement
    prefsCustomFilter.value = loadedLocalStorage.display.customCSSFilter ?? ''
    prefsCustomFilter.placeholder = resolveCSSFilter() // Show to make it easier to understand how to override it.
    prefsCustomFilter.addEventListener("input", () => {
        loadedLocalStorage.display.customCSSFilter = (prefsCustomFilter.value.trim() === '')
            ? undefined : prefsCustomFilter.value
        saveToLocalStorage()
    })
    prefsCustomFilter.addEventListener("blur", () => {
        applyDisplayPreferences()
    })

    Object.entries(themes).forEach(theme => {
        const option = document.createElement("option")
        option.value = theme[0]
        option.text = theme[1].name
        if (loadedLocalStorage.theme === theme[0]) {
            option.selected = true
        }
        themeDropdown.appendChild(option)
    })

    themeDropdown.addEventListener("change", () => {
        const selectedTheme = themeDropdown.value as "" | keyof allThemes
        if (selectedTheme !== undefined) {
            loadedLocalStorage.theme = selectedTheme
            saveToLocalStorage()
            applyDisplayPreferences()
        }
    })
    //#endregion

    //#region Theme tint color
    const overlay = document.getElementById("overlay") as HTMLDivElement
    const overlayColor = document.getElementById("prefsTint") as HTMLInputElement
    overlayColor.value = loadedLocalStorage.display.overlayColor ?? "#000000"
    overlayColor.addEventListener('input', () => {
        overlay.style.backgroundColor = overlayColor.value ?? "#000000" // preview
    })
    overlayColor.addEventListener('change', () => {
        loadedLocalStorage.display.overlayColor = overlayColor.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Theme tint blend
    const tintBlends = [
        ['Color', 'color'],
        ['Color Burn', 'color-burn'],
        ['Color Dodge', 'color-dodge'],
        ['Difference', 'difference'],
        ['Exclusion', 'exclusion'],
        ['Hard Light', 'hard-light'],
        ['Hue', 'hue'],
        ['Lighten', 'lighten'],
        ['Luminosity', 'luminosity'],
        ['Multiply', 'multiply'],
        ['Overlay', 'overlay'],
        ['Plus Lighter', 'plus-lighter'],
        ['Saturation', 'saturation'],
        ['Screen', 'screen'],
        ['Soft Light', 'soft-light']]

        const tintBlending = document.getElementById('prefsTintMethod') as HTMLSelectElement
        const defaultBlendOption = document.createElement("option")
        defaultBlendOption.value = 'normal'
        defaultBlendOption.text = 'Normal'
        tintBlending.appendChild(defaultBlendOption)
        tintBlending.appendChild(document.createElement('hr'))
        tintBlends.forEach(entry => {
            const option = document.createElement("option")
            option.text = entry[0]
            option.value = entry[1]
            if (loadedLocalStorage.display.overlayBlending === entry[1]) {
                option.selected = true
            }
            tintBlending.appendChild(option)
        })

        tintBlending.addEventListener("change", () => {
        loadedLocalStorage.display.overlayBlending = tintBlending.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Sliders (theme, theme tint, and zoom)
    // Clamps to range because Narrator has a bug that lets you violate bounds.
    // The minimums for the CSS filters are set to keep the site usable for sighted users fidgeting with controls.
    const items = [
        ['prefsZoom', `${loadedLocalStorage.display.zoom ?? '1.5'}`, (newValue: number) => {
            loadedLocalStorage.display.zoom = Math.min(Math.max(newValue ?? 1.5, 0.8), 4)
        }],
        ['prefsFilterContrast', `${loadedLocalStorage.display.readFilterContrast ?? '100'}`, (newValue: number) => {
            loadedLocalStorage.display.readFilterContrast = Math.min(Math.max(newValue ?? 100, 20), 200)
        }],
        ['prefsFilterSaturation', `${loadedLocalStorage.display.readFilterSaturate ?? '100'}`, (newValue: number) => {
            loadedLocalStorage.display.readFilterSaturate = Math.min(Math.max(newValue ?? 100, 0), 1000)
        }],
        ['prefsFilterBrightness', `${loadedLocalStorage.display.readFilterBrightness ?? '100'}`, (newValue: number) => {
            loadedLocalStorage.display.readFilterBrightness = Math.min(Math.max(newValue ?? 100, 30), 200)
        }],
        ['prefsFilterHue', `${loadedLocalStorage.display.readFilterHue ?? '0'}`, (newValue: number) => {
            loadedLocalStorage.display.readFilterHue = Math.min(Math.max(newValue ?? 0, 0), 360)
        }],
        ['prefsTintOpacity', `${loadedLocalStorage.display.overlayOpacity ?? '0'}`, (newValue: number) => {
            loadedLocalStorage.display.overlayOpacity = Math.min(Math.max(newValue ?? 0, 0), 90)
        }]
    ] as const;
    items.forEach(entry => {
        const slider = document.getElementById(entry[0]) as HTMLInputElement
        const num = document.getElementById(`${entry[0]}Num`) as HTMLInputElement
        slider.value = entry[1]
        num.value = slider.value

        const updateVal = (newValue: number) => {
            entry[2](newValue)
            if (slider.value !== `${newValue}`) { slider.value = `${newValue}` }
            if (num.value !== `${newValue}`) { num.value = `${newValue}` }
            saveToLocalStorage()

            // Preview to ease understanding of how to override CSS filters. Don't read to screen readers.
            if (items.slice(1, 5).some(item => entry === item)) {
                prefsCustomFilter.placeholder = resolveCSSFilter()
            }

            // Preview except for zoom (it's visually jarring).
            if (entry !== items[0]) {
                applyDisplayPreferences()
            }
        }

        slider.addEventListener('input', () => updateVal(slider.valueAsNumber))
        num.addEventListener('change', () => updateVal(num.valueAsNumber))
    })
    //#endregion

    //#region Custom JS and CSS
    const userJS = document.getElementById('prefsCustomJS') as HTMLTextAreaElement
    const userCSS = document.getElementById('prefsCustomCSS') as HTMLTextAreaElement
    userJS.value = loadedLocalStorage.display.customJS ?? ''
    userJS.addEventListener("input", () => {
        loadedLocalStorage.display.customJS = (userJS.value.trim() === '')
            ? undefined : userJS.value
        saveToLocalStorage()
    })
    userCSS.value = loadedLocalStorage.display.customCSS ?? ''
    userCSS.addEventListener("input", () => {
        loadedLocalStorage.display.customCSS = (userCSS.value.trim() === '')
            ? undefined : userCSS.value
        saveToLocalStorage()
    })
    userCSS.addEventListener("blur", () => {
        applyDisplayPreferences()
    })
    //#endregion

    const prefsRunCode = document.getElementById('prefsRunCode') as HTMLInputElement
    prefsRunCode.checked = loadedLocalStorage.display.executeCodeAndHtml ?? true
    prefsRunCode?.addEventListener('change', () => {
        loadedLocalStorage.display.executeCodeAndHtml = prefsRunCode.checked
        saveToLocalStorage()
    })

    const prefsDisabledControls = document.getElementById('prefsDisabledControls') as HTMLInputElement
    prefsDisabledControls.checked = loadedLocalStorage.display.showDisabledStatus ?? false
    prefsDisabledControls?.addEventListener('change', () => {
        loadedLocalStorage.display.showDisabledStatus = prefsDisabledControls.checked
        saveToLocalStorage()
        applyDisplayPreferences()
    })
}

/** Refreshes all display styles dependent on display preferences/persisting variables. */
export function applyDisplayPreferences(): void {
    applyTheme()
    document.getElementById('bodyContainer')!.style.width =
        `min(max(${loadedLocalStorage.display.columnWidth ?? '50vw'}, 30vw), 100vw)`
    document.getElementById('mainColumn')!.style.lineHeight = loadedLocalStorage.display.lineHeight ?? '1rem'
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

/** Switches to the preferences menu, hiding/showing the story column. */
export function togglePreferences(show?: boolean): void {
    const mainCol = document.getElementById('mainColumn')
    const prefs = document.getElementById('preferences')
    if (!prefs || !mainCol) { return }

    show ??= prefs.style.display === 'none'
    if (show) {
        mainCol.style.display = 'none'
        prefs.style.display = ''
    } else {
        mainCol.style.display = ''
        prefs.style.display = 'none'
        applyDisplayPreferences() // Some changes made in preferences wait until exiting.
    }
}

/** Remove callbacks that happen on submission of input. */
export function clearInputListeners(): void {
    _onInputSubmitted = []
}