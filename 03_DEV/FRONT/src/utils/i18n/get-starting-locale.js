import getBrowserLocale from "@/utils/i18n/get-browser-locale"
import { supportedLocalesInclude } from "@/utils/i18n/supported-locales"

export default function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true })

  if (supportedLocalesInclude(browserLocale)) {
    return browserLocale
  } else {
    return process.env.VUE_APP_I18N_LOCALE || "fr"
  }
}