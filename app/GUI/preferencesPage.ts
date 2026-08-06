import { allThemes, readFocusRuler } from "../core/model/model"
import { storage, saveToLocalStorage } from "../core/persistence"
import { boldLevels, bundleFontList, columnWidths, defaultZoom, knownFontNames, letterSpacings, lineSpacings, paragraphBorders, paragraphMargins, paragraphMarkings, readFocusBehaviorHighlight, readFocusBehaviorRuler, readFocusRulerWhen, readFocusSizeHighlight, readFocusSizeRuler, readingFocuses, tintBlends, wordSpacings } from "./consts"
import { SuggestedInput } from "./SuggestedInput"
import { applyTheme, resolveCSSFilter, themes } from "./theme"

/** Sets up the preferences page. */
export function initPreferencesPage(): void {

    //#region Reading column width
    const columnWidth = document.getElementById('prefsColumnWidth') as HTMLSelectElement
    columnWidths.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[1]
        if (storage.display.columnWidth === entry[1] ||
            !storage.display.columnWidth && entry[0] === 'Default'
        ) {
            option.selected = true
        }
        columnWidth.appendChild(option)
    })

    columnWidth.addEventListener("change", () => {
        storage.display.columnWidth = columnWidth.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Font
    const bundledFonts = document.getElementById('prefsIncludedFonts') as HTMLSelectElement
    const writeInFont = new SuggestedInput<never>(storage.display.font, knownFontNames.map(name => ({ name })))
    writeInFont.searchbox.id = "prefsWriteInFont"
    writeInFont.searchbox.placeholder = "Name a font"

    const defaultFontOption = document.createElement("option")
        defaultFontOption.value = ''
        defaultFontOption.text = 'Default'
        bundledFonts.appendChild(defaultFontOption)
        bundledFonts.appendChild(document.createElement('hr'))

    if (!storage.display.font) {
        defaultFontOption.selected = true
    }

    const currentFont = (storage.display.font ?? '').replaceAll(' ', '').toLowerCase()
    bundleFontList.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[0]
        const nameOnly = entry[1].split('|')[0]
        option.style.fontFamily = `"${nameOnly}", var(--fallback-fonts)` // Preview (when browser-supported)
        if (entry[1].includes('|')) {
            option.style.cssText += entry[1].split('|')[1]
        }
        if (currentFont === entry[0].replaceAll(' ', '').toLowerCase()) {
            option.selected = true
        }
        bundledFonts.appendChild(option)
    })

    bundledFonts.addEventListener("change", () => {
        storage.display.font = bundledFonts.value
        writeInFont.setSelection(bundledFonts.value)
        saveToLocalStorage()
        applyDisplayPreferences()
    })

    writeInFont.searchbox.addEventListener("input", () => {
        const trimmed = writeInFont.searchbox.value.trim()
        const toFindInBundle = trimmed.replaceAll(' ', '').toLowerCase()
        const index = bundleFontList.findIndex(entry => entry[0].replaceAll(' ', '').toLowerCase() === toFindInBundle)

        if (index === -1) {
            storage.display.font = trimmed
            defaultFontOption.selected = true            
        } else {
            storage.display.font = bundleFontList[index][0]
            for (let i = 0; i < bundledFonts.children.length; i++) {
                const item = bundledFonts.children[i] as HTMLOptionElement;
                if (item.tagName === 'OPTION' && writeInFont.searchbox.value.trim().toLowerCase() === item.text.toLowerCase()) {
                    item.selected = true
                }
            }
        }

        saveToLocalStorage()
        applyDisplayPreferences()
    })

    bundledFonts.parentElement!.appendChild(writeInFont.container)
    //#endregion

    //#region Paragraph margin
    const paragraphMargin = document.getElementById('prefsParagraphMargin') as HTMLSelectElement
    paragraphMargins.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[1]
        if (storage.display.paragraphMargin === entry[1] ||
            !storage.display.paragraphMargin && entry[1] === '') {
            option.selected = true
        }
        paragraphMargin.appendChild(option)
    })

    paragraphMargin.addEventListener("change", () => {
        storage.display.paragraphMargin = paragraphMargin.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion    

    //#region Line spacing
    const lineSpacing = document.getElementById('prefsLineHeight') as HTMLSelectElement
    lineSpacings.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[1]
        if (storage.display.lineHeight === entry[1]) {
            option.selected = true
        }
        lineSpacing.appendChild(option)
    })

    lineSpacing.addEventListener("change", () => {
        storage.display.lineHeight = lineSpacing.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Word spacing
    const wordSpacing = document.getElementById('prefsWordSpacing') as HTMLSelectElement
    wordSpacings.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[1]
        if (storage.display.wordSpacing === entry[1]) {
            option.selected = true
        }
        wordSpacing.appendChild(option)
    })

    wordSpacing.addEventListener("change", () => {
        storage.display.wordSpacing = wordSpacing.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Special paragraph marking
    const paragraphMarking = document.getElementById('prefsParagraphMarking') as HTMLSelectElement
    paragraphMarkings.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry
        option.value = entry
        if (storage.display.paragraphMarking === entry ||
            !storage.display.paragraphMarking && entry === 'None') {
            option.selected = true
        }
        paragraphMarking.appendChild(option)
    })

    paragraphMarking.addEventListener("change", () => {
        storage.display.paragraphMarking = paragraphMarking.value as typeof paragraphMarkings[number]
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Paragraph border
    const paragraphBorder = document.getElementById('prefsParagraphBorder') as HTMLSelectElement
    paragraphBorders.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry
        option.value = entry
        if (storage.display.paragraphBorder === entry ||
            !storage.display.paragraphBorder && entry === 'None') {
            option.selected = true
        }
        paragraphBorder.appendChild(option)
    })

    paragraphBorder.addEventListener("change", () => {
        storage.display.paragraphBorder = paragraphBorder.value as typeof paragraphBorders[number]
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Reading focus
    const readingFocus = document.getElementById('prefsReadingFocus') as HTMLSelectElement
    readingFocuses.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry
        option.value = entry
        if (storage.display.readingFocus?.type === entry ||
            !storage.display.readingFocus && entry === 'None') {
            option.selected = true
        }
        readingFocus.appendChild(option)
    })

    readingFocus.addEventListener("change", () => {
        storage.display.readingFocus = (readingFocus.value === 'None')
            ? undefined
            : { type: readingFocus.value as Exclude<typeof readingFocuses[number], 'None'> }

        _setFocusPreferenceControls()
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Focus preference controls
    _setFocusPreferenceControls() // Sets all remaining focus controls dependent on other controls.

    const focusRulerControls = document.getElementById('prefsFocusRulerControls') as HTMLSelectElement
    const focusSize = document.getElementById('prefsFocusSize') as HTMLSelectElement
    const focusBehavior = document.getElementById('prefsFocusBehavior') as HTMLSelectElement
    focusRulerControls?.addEventListener('change', () => {
        (storage.display.readingFocus as readFocusRuler).controls = focusRulerControls.value as typeof readFocusRulerWhen[number]
        saveToLocalStorage()
    })
    focusSize?.addEventListener('change', () => {
        storage.display.readingFocus!.size = focusSize.value
        saveToLocalStorage()
    })
    focusBehavior?.addEventListener('change', () => {
        storage.display.readingFocus!.behavior = focusBehavior.value as typeof readFocusBehaviorHighlight[number] | typeof readFocusBehaviorRuler[number]
        _setFocusPreferenceControls()
        saveToLocalStorage()
    })

    const readFocusColor = document.getElementById("prefsFocusColor") as HTMLInputElement    
    readFocusColor.addEventListener('change', () => {
        storage.display.readingFocus!.color = readFocusColor.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })

    //#endregion

    //#region Letter spacing
    const letterSpacing = document.getElementById('prefsLetterSpacing') as HTMLSelectElement
    letterSpacings.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[0]
        if (storage.display.letterSpacing === entry[0] ||
            (!storage.display.letterSpacing && option.value === '')) {
            option.selected = true
        }
        letterSpacing.appendChild(option)
    })

    letterSpacing.addEventListener("change", () => {
        storage.display.letterSpacing = (letterSpacing.value === '')
            ? undefined
            : letterSpacing.value
        
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Font bolding
    const fontBolding = document.getElementById('prefsFontBolding') as HTMLSelectElement
    boldLevels.forEach(entry => {
        const option = document.createElement("option")
        option.text = entry[0]
        option.value = entry[1]
        if (storage.display.fontWeight === entry[1] ||
            (!storage.display.fontWeight && option.value === '400')) {
            option.selected = true
        }
        fontBolding.appendChild(option)
    })

    fontBolding.addEventListener("change", () => {
        storage.display.fontWeight = (fontBolding.value === '')
            ? undefined
            : fontBolding.value

        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //fontWeight

    //#region Theme and custom filter
    const themeDropdown = document.getElementById('prefsTheme') as HTMLSelectElement
    const defaultThemeOption = document.createElement("option")
        defaultThemeOption.value = ''
        defaultThemeOption.text = 'Detect'
        themeDropdown.appendChild(defaultThemeOption)
        themeDropdown.appendChild(document.createElement('hr'))

    const prefsCustomFilter = document.getElementById('prefsCustomFilter') as HTMLTextAreaElement
    prefsCustomFilter.value = storage.display.customCSSFilter ?? ''
    prefsCustomFilter.placeholder = resolveCSSFilter() // Show to make it easier to understand how to override it.
    prefsCustomFilter.addEventListener("input", () => {
        if (prefsCustomFilter.value.trim() === '') {
            storage.display.customCSSFilter = undefined
            prefsCustomFilter.placeholder = resolveCSSFilter()
        } else {
            storage.display.customCSSFilter = prefsCustomFilter.value
        }
        saveToLocalStorage()
    })
    prefsCustomFilter.addEventListener("blur", () => {
        applyDisplayPreferences()
    })

    Object.entries(themes).forEach(theme => {
        const option = document.createElement("option")
        option.value = theme[0]
        option.text = theme[1].name
        if (storage.theme === theme[0]) {
            option.selected = true
        }
        themeDropdown.appendChild(option)
    })

    themeDropdown.addEventListener("change", () => {
        const selectedTheme = themeDropdown.value as "" | keyof allThemes
        if (selectedTheme !== undefined) {
            storage.theme = selectedTheme
            saveToLocalStorage()
            applyDisplayPreferences()
        }
    })
    //#endregion

    //#region Theme tint color
    const overlay = document.getElementById("overlay") as HTMLDivElement
    const leftGutter = document.getElementById("leftGutter") as HTMLDivElement
    const rightGutter = document.getElementById("rightGutter") as HTMLDivElement
    const overlayColor = document.getElementById("prefsTint") as HTMLInputElement
    overlayColor.value = storage.display.overlayColor ?? "#000000"

    // live preview (only when reduced motion is off)
    overlayColor.addEventListener('input', () => {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const col = overlayColor.value ?? "#000000"
            overlay.style.backgroundColor = col
            leftGutter.style.backgroundColor = col
            rightGutter.style.backgroundColor = col
        }
    })
    overlayColor.addEventListener('change', () => {
        storage.display.overlayColor = overlayColor.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Theme tint blend
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
            if (storage.display.overlayBlending === entry[1]) {
                option.selected = true
            }
            tintBlending.appendChild(option)
        })

        tintBlending.addEventListener("change", () => {
        storage.display.overlayBlending = tintBlending.value
        saveToLocalStorage()
        applyDisplayPreferences()
    })
    //#endregion

    //#region Sliders (theme, theme tint, and zoom)
    // Clamps to range because Narrator has a bug that lets you violate bounds.
    // The minimums for the CSS filters are set to keep the site usable for sighted users fidgeting with controls.
    const items = [
        ['prefsZoom', `${storage.display.zoom ?? defaultZoom()}`, (newValue: number) => {
            storage.display.zoom = Math.min(Math.max(newValue ?? 1.5, 0.8), 4)
        }],
        ['prefsFilterContrast', `${storage.display.readFilterContrast ?? '100'}`, (newValue: number) => {
            storage.display.readFilterContrast = Math.min(Math.max(newValue ?? 100, 20), 200)
        }],
        ['prefsFilterSaturation', `${storage.display.readFilterSaturate ?? '100'}`, (newValue: number) => {
            storage.display.readFilterSaturate = Math.min(Math.max(newValue ?? 100, 0), 1000)
        }],
        ['prefsFilterBrightness', `${storage.display.readFilterBrightness ?? '100'}`, (newValue: number) => {
            storage.display.readFilterBrightness = Math.min(Math.max(newValue ?? 100, 30), 200)
        }],
        ['prefsFilterHue', `${storage.display.readFilterHue ?? '0'}`, (newValue: number) => {
            storage.display.readFilterHue = Math.min(Math.max(newValue ?? 0, 0), 360)
        }],
        ['prefsTintOpacity', `${storage.display.overlayOpacity ?? '0'}`, (newValue: number) => {
            storage.display.overlayOpacity = Math.min(Math.max(newValue ?? 0, 0), 90)
        }],
        ['prefsFocusOpacity', `${storage.display.readingFocus?.opacity ?? '25'}`, (newValue: number) => {
            storage.display.readingFocus!.opacity = Math.min(Math.max(newValue ?? 25, 0), 100)
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

            // Preview except for zoom (it's visually jarring / moves cursor position w.r.t. controls, which is bad).
            const motionIsOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            if (motionIsOk && entry !== items[0]) {
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
    userJS.value = storage.display.customJS ?? ''
    userJS.addEventListener("input", () => {
        storage.display.customJS = (userJS.value.trim() === '')
            ? undefined : userJS.value
        saveToLocalStorage()
    })
    userCSS.value = storage.display.customCSS ?? ''
    userCSS.addEventListener("input", () => {
        storage.display.customCSS = (userCSS.value.trim() === '')
            ? undefined : userCSS.value
        saveToLocalStorage()
    })
    userCSS.addEventListener("blur", () => {
        applyDisplayPreferences()
    })
    //#endregion

    const prefsRunCode = document.getElementById('prefsRunCode') as HTMLInputElement
    prefsRunCode.checked = storage.display.executeCodeAndHtml ?? true
    prefsRunCode?.addEventListener('change', () => {
        storage.display.executeCodeAndHtml = prefsRunCode.checked
        saveToLocalStorage()
    })

    const prefsDisabledControls = document.getElementById('prefsDisabledControls') as HTMLInputElement
    prefsDisabledControls.checked = storage.display.showDisabledStatus ?? false
    prefsDisabledControls?.addEventListener('change', () => {
        storage.display.showDisabledStatus = prefsDisabledControls.checked
        saveToLocalStorage()
        applyDisplayPreferences()
    })
}

/** Refreshes all display styles dependent on display preferences/persisting variables. */
export function applyDisplayPreferences(): void {
    applyTheme()
    document.getElementById('page')!.style.width =
        `min(max(${storage.display.columnWidth ?? '50rem'}, 30rem), 100vw)`
    document.getElementById('mainColumn')!.style.lineHeight = storage.display.lineHeight ?? '1rem'
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

        ;(document.getElementById('readRuler') as HTMLDivElement).style.display = 'none'
        ;(document.getElementById('readRulerAbove') as HTMLDivElement).style.display = 'none'
        ;(document.getElementById('readRulerBelow') as HTMLDivElement).style.display = 'none'
    } else {
        mainCol.style.display = ''
        prefs.style.display = 'none'
        applyDisplayPreferences() // Some changes made in preferences wait until exiting.
    }
}

/** For accessibility options -> reading focus. These are the controls that adjust to match the chosen focus. */
function _setFocusPreferenceControls(): void {
    const focusRulerWhen = document.getElementById('prefsFocusRulerControls') as HTMLSelectElement
    const focusSize = document.getElementById('prefsFocusSize') as HTMLSelectElement
    const focusBehavior = document.getElementById('prefsFocusBehavior') as HTMLSelectElement
    const readFocusColor = document.getElementById("prefsFocusColor") as HTMLInputElement
    const readFocusOpacity = document.getElementById("prefsFocusOpacity") as HTMLInputElement
    const readFocusOpacityNum = document.getElementById("prefsFocusOpacityNum") as HTMLInputElement
    readFocusColor.value = storage.display.readingFocus?.color ?? "#00ffff"

    const usingFocus = storage.display.readingFocus !== undefined
    const usingRuler = usingFocus && storage.display.readingFocus!.type === 'Ruler'
    const usingHighlight = usingFocus && storage.display.readingFocus!.type === 'Highlight'

    readFocusColor.disabled = !usingFocus
    readFocusOpacity.disabled = !usingFocus
    readFocusOpacityNum.disabled = !usingFocus
    focusRulerWhen.disabled = !usingRuler
    focusBehavior.disabled = !usingFocus
    focusSize.disabled = !usingFocus
        || (usingHighlight
            && storage.display.readingFocus!.behavior !== undefined
            && storage.display.readingFocus!.behavior !== 'Highlight side')

    const arrays = usingRuler
        ? [readFocusSizeRuler, readFocusBehaviorRuler]
        : [readFocusSizeHighlight, readFocusBehaviorHighlight]

    if (storage.display.readingFocus) {
        focusSize.replaceChildren(...arrays[0].map(entry => {
            const option = document.createElement("option")
            option.text = entry[0]
            option.value = entry[1]
            if (storage.display.readingFocus!.size === entry[1] ||
                !storage.display.readingFocus!.size && entry[1] === '4rem')
            {
                option.selected = true
            }
            return option
        }))

        focusBehavior.replaceChildren(...arrays[1].map(entry => {
            const option = document.createElement("option")
            option.text = entry as string
            option.value = entry as string
            if (storage.display.readingFocus!.behavior === entry ||
                (!storage.display.readingFocus?.behavior && (entry[1] === 'Highlight side' || entry[1] === 'Color inside')))
            {
                option.selected = true
            }
            return option
        }))

        if (storage.display.readingFocus.type === 'Ruler') {
            focusRulerWhen.replaceChildren(...readFocusRulerWhen.map(entry => {
                const option = document.createElement("option")
                option.text = entry
                option.value = entry

                if ((storage.display.readingFocus as readFocusRuler).controls === entry) {
                    option.selected = true
                }
                return option
            }))
        } else {
            const option = document.createElement('option')
            option.text = 'None'
            option.value = ''
            option.selected = true
            focusRulerWhen.replaceChildren(option)
        }
    } else {
        [focusSize, focusBehavior, focusRulerWhen].forEach(dropdown => {
            const option = document.createElement('option')
            option.text = 'None'
            option.value = ''
            option.selected = true
            dropdown.replaceChildren(option)
        })
    }
}