import { ILocalizedStringSets } from "./Localization";

/** All strings localized in all locales. */
export const localizedStrings: ILocalizedStringSets = {
  "en-us": {
    ApplicationName: "Locket",
    ApplicationNameAndVersion: (appName: string, appVersion: string) => `${appName} version ${appVersion}`
  },
};
