import { allThemes, dynamicTheme, theme, themeBase, themeBasedOn } from "../core/model/model"
import { loadedLocalStorage, saveToLocalStorage } from "../core/persistence"

let everInitTheme = false
let _themeStyles: HTMLStyleElement | undefined // Reference held to a dynamic stylesheet.
let _userCSSStyles: CSSStyleSheet | undefined // Separate from main styles so failure won't break the whole page.

/** Base64 encodes the svgs on the fly. */
function encode64(asUrl: boolean, str: string): string {
    return asUrl
        ? `url('data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(str)))}')`
        : `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(str)))}`
}

/** Textures used on pages. */
const patterns = {
    dots: (space: string, accent: string) => encode64(true, `<svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p" width="${space}" height="${space}" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" style="" fill="${accent}"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`),
    stripes: (accent: string) => encode64(true, `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><defs><pattern id="p" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-2 2l4 -4M0 44L44 0M42 46l4 -4" stroke="${accent}" stroke-width="2" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`),
    grid: (accent: string) => encode64(true, `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240"><defs><pattern id="p" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="${accent}" stroke-width="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`)
}

/** Whether a theme is light on dark, or dark on light. Presented in this order in the UI. */
export const themes: allThemes = {
    light: {
        name: "Light",
        page: "rgb(245, 245, 245)",
        text: "rgb(17, 17, 17)",
        control: "rgb(182, 182, 182)",
        controlFocus: "rgb(224, 224, 224)",
        focusBorder: "rgb(0, 179, 255)",
        header: "rgb(236, 238, 223)",
        column: "rgb(255, 255, 245)",
        link: "rgb(10, 0, 205)",
        linkVisited: "rgb(205, 0, 171)"
    },
    lowContrastLight: {
        name: "Light Low Contrast",
        page: "rgb(198, 198, 181)",
        text: "rgb(99, 99, 99)",
        control: "rgb(150, 150, 150)",
        controlFocus: "rgb(200, 200, 200)",
        focusBorder: "rgb(0, 179, 255)",
        header: "rgb(198, 198, 181)",
        column: "rgb(224, 224, 214)",
        link: "rgb(93, 86, 160)",
        linkVisited: "rgb(160, 86, 148)",
    },
    highContrastLight: {
        name: "Light High Contrast",
        page: "white",
        text: "black",
        control: "rgb(0, 0, 128)",
        controlFocus: "rgb(34, 34, 34)",
        controlText: "white",
        focusBorder: "rgb(0, 255, 255)",
        header: "rgb(253, 255, 244)",
        column: "rgb(248, 248, 248)",
        link: "rgb(0, 0, 255)",
        linkVisited: "rgb(122, 0, 102)",
    },
    blackOnWhite: {
        name: "Black on White",
        page: "white",
        text: "black",
        control: "black",
        controlFocus: "rgb(34, 34, 34)",
        controlText: "white",
        header: "white",
        focusBorder: "rgb(0, 255, 255)",
        link: "rgb(0, 0, 255)",
        linkVisited: "rgb(255, 0, 212)",
    },
    dark: {
        name: "Dark",
        page: "rgb(32, 32, 32)",
        text: "rgb(255, 255, 250)",
        control: "rgb(226, 226, 226)",
        controlFocus: "rgb(245, 245, 245)",
        controlText: "black",
        focusBorder: "rgb(0, 179, 255)",
        header: "rgb(109, 109, 128)",
        column: "rgb(53, 53, 63)",
        link: "rgb(151, 172, 255)",
        linkVisited: "rgb(255, 151, 238)",
    },
    lowContrastDark: {
        name: "Dark Low Contrast",
        page: "rgb(41, 41, 41)",
        text: "rgb(120, 120, 120)",
        control: "rgb(103, 103, 103)",
        controlText: "rgb(15, 15, 15)",
        controlFocus: "rgb(98, 98, 98)",
        focusBorder: "rgb(0, 99, 142)",
        header: "rgb(63, 63, 57)",
        column: "rgb(43, 43, 41)",
        link: "rgb(66, 61, 113)",
        linkVisited: "rgb(109, 59, 101)",
    },
    highContrastDark: {
        name: "Dark High Contrast",
        page: "black",
        text: "white",
        control: "white",
        controlFocus: "rgb(240, 240, 240)",
        controlText: "black",
        column: "rgb(18, 18, 18)",
        focusBorder: "rgb(0, 255, 255)",
        header: "rgb(30, 30, 47)",
        link: "rgb(138, 228, 255)",
        linkVisited: "rgb(255, 186, 244)",
    },
    whiteOnBlack: { // White text, black background
        name: "White on Black",
        page: "black",
        text: "white",  // May affect astigmatic users
        control: "white",
        controlFocus: "rgb(240, 240, 240)",
        controlText: "black",
        focusBorder: "rgb(0, 255, 255)",
        header: "black",
        link: "rgb(0, 255, 255)",
        linkVisited: "rgb(255, 0, 212)",
    },
    forcedColors: { // Forced-color compat
        name: "System",
        page: "Canvas",
        text: "CanvasText",
        control: "ButtonFace",
        controlDisabled: "ButtonFace",
        controlDisabledText: "GrayText",
        controlFocus: "ButtonFace",
        controlText: "ButtonText",
        focusBorder: "SelectedItem",
        header: "AccentColor",
        link: "ActiveText",
        linkVisited: "VisitedText"
    },
    simpleLight: {
        name: "Simple Light",

        page: "rgb(231, 231, 231)",
        text: "rgb(40, 40, 40)",
        control: "transparent",
        controlFocus: "white",
        focusBorder: "rgb(0, 179, 255)",
        header: "transparent",
        column: "transparent",
        link: "rgb(10, 0, 205)",
        linkVisited: "rgb(205, 0, 171)",
    },
    simpleDark: {
        name: "Simple Dark",
        page: "rgb(40, 40, 40)",
        text: "rgb(231, 231, 231)",
        control: "transparent",
        controlFocus: "black",
        focusBorder: "rgb(0, 179, 255)",
        header: "transparent",
        column: "transparent",
        link: "rgb(151, 172, 255)",
        linkVisited: "rgb(255, 151, 238)",
    },
    ocean: {
        name: "Ocean",
        page: "rgb(34, 34, 102)",
        text: "rgb(252, 252, 224)",
        control: "rgb(167, 213, 176)",
        controlFocus: "rgb(212, 255, 220)",
        controlText: "black",
        focusBorder: "rgb(0, 179, 255)",
        column: "rgb(34, 34, 68)",
        header: "rgb(62, 90, 69)",
        link: "rgb(151, 210, 255)",
        linkVisited: "rgb(208, 151, 255)"
    },
    dandelion: {
        name: "Dandelion",
        page: "linear-gradient(rgb(255, 202, 176) 0%, rgb(222, 210, 150) 100%)",
        text: "rgb(40, 40, 0)",
        control: "rgb(255, 235, 170)",
        controlFocus: "rgb(255, 251, 223)",
        controlText: "rgb(40, 40, 0)",
        focusBorder: "rgb(0, 179, 255)",
        column: `rgb(247, 242, 225) ${patterns.stripes('rgba(255, 113, 113, 0.22)')}`,
        header: "rgb(225, 138, 76)",
        link: "rgb(0, 72, 126)",
        linkVisited: "rgb(92, 0, 168)"
    },
    candle: {
        name: "Candle",
        base: themeBase.Light,
        page: "radial-gradient(circle, #ffecd2 0%, #fcc69f 100%);",
        control: "rgb(255, 239, 174)",
        controlFocus: "white",
        column: "rgba(217, 218, 195, 0.53)"
    },
    midnight: {
        name: "Midnight",
        base: themeBase.Dark,
        page: "linear-gradient(rgb(15, 12, 41) 0%, rgb(48, 43, 99) 50%, rgb(36, 36, 62) 100%)",
        themeCSS: [
            `#mainColumn,
             #preferences {
                border-left: rgba(255, 255, 255, 0.5) 2px dotted;
                border-right: rgba(255, 255, 255, 0.5) 2px dotted;
            }`
        ]
    },
    matrix: {
        name: "Matrix",
        base: themeBase.Light,
        page: "rgb(54, 54, 54)",
        text: "rgb(127, 255, 55)",
        control: "rgb(8, 48, 0)",
        controlFocus: "rgb(16, 94, 0)",
        controlText: "rgb(127, 255, 55)",
        focusBorder: "rgb(216, 223, 0)",
        column: "rgb(0, 0, 0)",
        header: "rgb(58, 58, 58)",
        link: "rgb(216, 223, 0)",
        linkVisited: "rgb(174, 237, 0)",
        themeCSS: [
            `p, span, div, button {
                letter-spacing: 0.1rem;
            }`
        ]
    },
    sunrise: {
        name: "Sunrise",
        base: themeBase.Light,
        control: "rgb(82, 73, 255)",
        controlFocus: "rgb(129, 123, 255)",
        controlText: "rgb(254, 255, 242)",
        focusBorder: "rgb(255, 183, 183)",
        column: "rgba(249, 254, 255, 0.5)",
        page: "linear-gradient(90deg, #e0eafc 0%, #cfdef3 80%, #dfdef3 82%, #dfdef3 87%, #cfdef3 96%, #e0eafc 100%);",
    },
    strawberry: {
        name: "Strawberry",
        base: themeBase.Light,
        control: "rgb(255, 183, 183)",
        controlFocus: "rgb(255, 215, 215)",
        column: "rgba(223, 201, 245, 0.87)",
        header: "rgb(255, 215, 215)",
        page: `rgb(207, 222, 243) ${patterns.dots('44px', 'rgba(255, 0, 255, 0.22)')}`,
        themeCSS: [
            `#mainColumn,
             #preferences {
                border-width: 1px;
                border-color: black;
                border-style: none solid;
            }`,
            `#mainColumn button,
             #preferences button {
                outline: 2px solid black;
            }`,
            `#headerBar {
                border-bottom:rgb(246, 100, 100) 0.75rem ridge;
            }`
        ]
    },
    magic: {
        name: "Magic",
        get: () => ({
            base: themeBase.Dark,
            page: "linear-gradient(0deg, rgb(172, 112, 145) 0%,rgb(151, 86, 142) 100%)",
            text: "rgb(254, 220, 255)",
            control: "transparent",
            controlFocus: "transparent",
            controlText: "rgb(167, 255, 249)",
            focusBorder: "rgb(223, 0, 216)",
            column: "rgb(72, 0, 100)",
            header: "rgb(129, 39, 137)",
            link: "rgb(170, 255, 249)",
            linkVisited: "rgb(170, 180, 255)",
            themeCSS: [
                `body {
                    text-shadow: 0px 0px 0.2rem rgb(184, 101, 201);
                }`,
                `textarea {
                    border-color: rgb(167, 255, 249);
                }`,
                `#preferences summary {
                    color: rgb(254, 220, 255)
                }`
            ]
        })
    },
    unicorn: {
        name: "Unicorn",
        base: themeBase.Light,
        control: "rgb(188, 230, 255)",
        controlFocus: "rgb(240, 249, 255)",
        controlText: "black",
        focusBorder: "rgb(0, 220, 231)",
        header: "linear-gradient(rgb(205, 228, 242) 0%, rgb(126, 191, 231) 98%, black)",
        column: "white",
        page: "linear-gradient(to bottom, aliceblue, rgb(255, 231, 231), rgb(255, 214, 184))",
        themeCSS: [`
            #headerBar button {
                background: white;
                border-radius: 1rem;
            }
            `,`
            #headerBar button:hover,
            #headerBar button:focus {
                background: rgb(188, 230, 255);
            }
            `,`
            #mainColumn button,
            #preferences button {
                border-radius: 1rem;
                outline: 1px solid black;
            }`,`
            #headerBar {
                border-radius: 4rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }
            `,`
            #outputArea {
                background: linear-gradient(rgb(255, 0, 0), rgb(199, 129, 0), rgb(129, 129, 0), rgb(0, 163, 0), rgb(0, 0, 255), rgb(148, 0, 255), rgb(255, 0, 255));
                background-clip: text;
                color: rgba(0, 0, 0, 0.5);
            }`,`
            #mainColumn, #preferences {
                background: transparent !important;
            }`
        ]
    }
}

/** Returns a combined CSS filter from local storage preferences. */
export function resolveCSSFilter(): string {
    let readingFilter = loadedLocalStorage.display.customCSSFilter ?? ''
    if (readingFilter === '') {
        if (loadedLocalStorage.display.readFilterHue) { // allow value 0 to omit this entirely.
            readingFilter = `sepia(100%) hue-rotate(${loadedLocalStorage.display.readFilterHue}deg) `
        }
        if (loadedLocalStorage.display.readFilterContrast !== undefined) {
            readingFilter += `contrast(${loadedLocalStorage.display.readFilterContrast}%) `
        }
        if (loadedLocalStorage.display.readFilterSaturate !== undefined) {
            readingFilter += `saturate(${loadedLocalStorage.display.readFilterSaturate}%) `
        }
        if (loadedLocalStorage.display.readFilterBrightness !== undefined) {
            readingFilter += `brightness(${loadedLocalStorage.display.readFilterBrightness}%) `
        }

        if (readingFilter === '') { readingFilter = 'none' }
    }

    return readingFilter
}

/** Adjusts a style element for themes from the given theme, else local storage, else browser settings. */
export function applyTheme(givenTheme?: theme): void {
    if (_themeStyles) {
        _themeStyles.remove()
    }
    if (_userCSSStyles) {
        const index = document.adoptedStyleSheets.indexOf(_userCSSStyles)
        if (index !== -1) {
            document.adoptedStyleSheets.splice(index, 1)
        }
    }
    _userCSSStyles = new CSSStyleSheet()

    const userCSS = loadedLocalStorage.display.customCSS ?? '';
    if (userCSS !== '') {
        _userCSSStyles.replace(userCSS)
    }

    _themeStyles = document.createElement("style");
    document.head.appendChild(_themeStyles);

    if (!everInitTheme) {
        everInitTheme = true

        // Reapply on browser theme changes.
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", _ => applyTheme())
        window.matchMedia("(prefers-contrast: more)").addEventListener("change", _ => applyTheme())
        window.matchMedia("(forced-colors: active)").addEventListener("change", _ => applyTheme())

        // Attempt to run user Javascript *once*.
        if (loadedLocalStorage.display.customJS) {
            try {
                Function(loadedLocalStorage.display.customJS)()
            } catch (err) { // Catch and comment out the JS for stability.
                console.log(err) // javascript devs will find the error useful.
                loadedLocalStorage.display.customJS = `/**${loadedLocalStorage.display.customJS}*/`
                // Let JS textarea de-sync so the user can edit their script w/o having to uncomment each time.
                saveToLocalStorage()
            }
        }
    }

    const hiContrast = window.matchMedia("(prefers-contrast: more)").matches
    const loContrast = window.matchMedia("(prefers-contrast: less)").matches
    let css = givenTheme ?? resolveTheme(hiContrast, loContrast)

    // It's easy to forget semi-colons here and hard to debug, fair warning.
    const rules: string[] = [
        ...((css as themeBasedOn).themeCSS ? (css as themeBasedOn).themeCSS! : []),
        `#overlay {
                background: ${loadedLocalStorage.display.overlayColor};
                display: ${loadedLocalStorage.display.overlayOpacity === 0 ? 'none' : ''};
                opacity: ${loadedLocalStorage.display.overlayOpacity}%;
                mix-blend-mode: ${loadedLocalStorage.display.overlayBlending ?? 'normal'}
        }`,
        `body {
            background: ${css.page};
            color: ${css.text};
            font-family: ${loadedLocalStorage.display.fontFamily !== undefined ? loadedLocalStorage.display.fontFamily + ', ' : ''}Arial, Helvetica, Verdana, Open Sans, sans-serif;
            filter: ${resolveCSSFilter()};

            & a:any-link {
                color: ${css.link};
            }
            & a:visited {
                color: ${css.linkVisited ?? css.link};
            }

            & button,
            & select,
            & input,
            & summary {
                background: ${css.control};
                color: ${css.controlText ?? css.text};
            }

            & textarea {
                color: ${css.text};
                background: ${css.column ?? css.page};
            }

            & textarea::placeholder {
                color: ${css.text};
                opacity: 0.8;
            }

            ${loadedLocalStorage.display.showDisabledStatus ? '' : `
                & button:disabled,
                & select:disabled,
                & input:disabled {
                    color: ${css.controlText ?? "GrayText"};
                    opacity: 0.6;
                }`
            }

            & button:not(:disabled):hover,
            & select:not(:disabled):hover,
            & input:not(:disabled):hover,
            & details:not(:disabled) summary:hover {
                background: ${css.controlFocus};
            }

            & select:checked {
                background: ${css.controlFocus};
            }

            & button:not(:disabled):focus,
            & select:not(:disabled):focus,
            & input:not(:disabled):focus,
            & details:not(:disabled) summary:focus {
                background: ${css.controlFocus};
            }

            & button:not(:disabled):focus,
            & select:not(:disabled):focus,
            & input:not(:disabled):focus,
            & textarea:not(:disabled):focus,
            & details:not(:disabled):focus {
                border-color: ${css.focusBorder};
                ${hiContrast ? 'border-width: 0.5rem;' : '' /** better visibility */}
            }

            input[type="checkbox"] {
                border: 0.1rem solid ${css.controlText ?? css.text};
            }
        }`,
        /** Visually affirms the space between label and checkbox is part of the control, since it's clickable. */
        `#preferences {
            & label:has(input[type="checkbox"]):hover {
                background-color: ${css.controlFocus};
                color: ${css.controlText};
            }
            & summary {
                outline: 1px solid ${css.text};
            }
            & summary::marker {
                color: ${css.controlText};
            }
        }`,
        `#headerBar,
        #mainColumn,
        #preferences {
            zoom: ${loadedLocalStorage.display.zoom ?? '1.5'};
        }`,
        loadedLocalStorage.display.showDisabledStatus ? `
            button:disabled:after {
            content: " 🛇";
            }` : '',
        css.column ? `
            #mainColumn,
            #preferences {
                background: ${css.column};
            }` : '',
        `#headerBar {
            background: ${css.header};
        }`
    ]
    
    const sheet = _themeStyles.sheet
    if (sheet) {
        rules.filter(rule => /\w+/g.test(rule))
            .forEach(rule => sheet.insertRule(rule))
    }
    document.adoptedStyleSheets.push(_userCSSStyles);
}

/** Uses the given name, else local storage, else browser settings, to resolve and return a theme object. */
function resolveTheme(hiContrast: boolean, loContrast: boolean, name?: keyof allThemes): theme {
    const wantsDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

    let css: theme
    let themeName = name ?? loadedLocalStorage.theme

    // Use the named theme, mixing in the base theme if any.
    if (themeName !== '') {
        const namedTheme = (themes[themeName] as dynamicTheme).get
            ? (themes[themeName] as dynamicTheme).get() as theme | themeBasedOn
            : themes[themeName] as theme | themeBasedOn
        const base: themeBase | undefined = (namedTheme as themeBasedOn).base
        switch (base) {
            case themeBase.Light:
                css = { ...themes.light, ...namedTheme }
                break
            case themeBase.Dark:
                css = { ...themes.dark, ...namedTheme }
                break
            default: // base themes land here since they have no 'base'
                base satisfies undefined // catch missing TS cases
                css = namedTheme as theme
                break
        }
    } else {
        // Detect an ideal theme to use following browser preferences.
        if (window.matchMedia("(forced-colors: active)").matches) {
            css = themes.forcedColors
        } else {
            css =
                wantsDarkMode
                ?
                    hiContrast ?
                        themes.highContrastDark
                    : loContrast ?
                        themes.lowContrastDark : themes.dark
                :
                    hiContrast ?
                        themes.highContrastLight
                    : loContrast ?
                        themes.lowContrastLight : themes.light
        }
    }

    return css
}
