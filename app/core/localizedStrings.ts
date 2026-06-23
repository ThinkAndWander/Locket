import { ILocalizedStringSets } from "./localization";

/** All strings localized in all locales. */
export const localizedStrings: ILocalizedStringSets = {
  "en-us": {
    ApplicationName: 'Locket',
    ApplicationNameAndVersion: (appName: string, appVersion: string) => `${appName} version ${appVersion}`,
    Attributes: {
      Guarded: 'Guarded',
      OvershareProne: 'Prone to oversharing',
      Stubborn: 'Stubborn',
      Amenable: 'Amenable',
      Introspective: 'Introspective',
      Passive: 'Passive',
      Assertive: 'Assertive',
      Calculated: 'Calculated',
      Empathetic: 'Empathetic',
      Vegetarian: 'Vegetarian',
      Vegan: 'Vegan',
    },
    Player: 'Player'
  },
};
