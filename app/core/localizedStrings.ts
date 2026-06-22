import { ILocalizedStringSets } from "./localization";

/** All strings localized in all locales. */
export const localizedStrings: ILocalizedStringSets = {
  "en-us": {
    ApplicationName: 'Locket',
    ApplicationNameAndVersion: (appName: string, appVersion: string) => `${appName} version ${appVersion}`,
    Attributes: {
      Argumentative: 'Argumentative',
      Aromantic: 'Aromantic',
      Empathetic: 'Empathetic',
      Extrospective: 'Extrospective',
      Introspective: 'Introspective',
      LowSelfEsteem: 'Low self-esteem',
      Materialistic: 'Materialistic',
      SelfLoving: 'Self-loving'
    },
    Player: 'Player'
  },
};
