import { localizedStrings } from "./localizedStrings"
import { loadedLocalStorage } from "./persistence"

/** Gets the nearest supported locale from the browser using navigator.languages or navigator.language. This is
 * accurate for Firefox and Chrome. IE and Edge return the OS language instead and only return the browser
 * language from an Accept-Languages header. This is considered good enough though. Defaults if the preferred
 * locale isn't listed. */
export const getSupportedLocale = (useLoadedStorage?: boolean): keyof ILocalizedStringSets => {
  let locale = "en-us" // Defaults to English because all strings are guaranteed to exist in it.

  if (useLoadedStorage) {
    locale = loadedLocalStorage.locale
  }

  // This is an experimental feature at time of writing, so it may be undefined.
  if (navigator.languages !== undefined) {
    for (const lang of navigator.languages) {
      const langParts = lang.toLowerCase().split("-")
      const language = langParts[0]
      const region = langParts.length > 1 ? langParts[1] : ""

      // If a language but not the dialect for a region is available, use it instead.
      if (`${language}-${region}` in supportedLocales) {
        locale = `${language}-${region}`
        break
      } else if (`${language}` in supportedLocales) {
        locale = `${language}`
        break
      }
    }
  } else {
    const language = navigator.language.toLowerCase()

    if (language in supportedLocales) {
      locale = language
    }
  }

  return supportedLocales[locale as keyof ISupportedLocales]
}

/** All locales to be accepted as valid. */
export interface ISupportedLocales {
  "en": keyof ILocalizedStringSets
  "en-us": keyof ILocalizedStringSets
}

/** A list of valid locales as keys, and the locales they default to as values. */
export const supportedLocales: ISupportedLocales = {
  "en": "en-us",
  "en-us": "en-us",
}

/** All locales with direct support. */
export interface ILocalizedStringSets {
  "en-us": ILocalizedStrings
}

/** Current strings. */
export const strings = localizedStrings[supportedLocales[getSupportedLocale(true)] as keyof typeof localizedStrings]

/** All strings to be localized per locale. */
interface ILocalizedStrings {
  ApplicationName: string
  ApplicationNameAndVersion: (appName: string, appVersion: string) => string
  Attributes: {
    Guarded: string
    OvershareProne: string
    Stubborn: string
    Amenable: string
    Introspective: string
    Passive: string
    Assertive: string
    Calculated: string
    Empathetic: string
    Vegetarian: string
    Vegan: string
  }
  Player: string
}