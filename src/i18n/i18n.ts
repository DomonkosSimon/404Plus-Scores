import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sk from './locales/sk/common.json';
import cs from './locales/cs/common.json';
import en from './locales/en/common.json';
import de from './locales/de/common.json';
import { useSettingsStore } from '../state/settings/useSettingsStore';

const initialLanguage = useSettingsStore.getState().language;

void i18n.use(initReactI18next).init({
  resources: {
    sk: { common: sk },
    cs: { common: cs },
    en: { common: en },
    de: { common: de },
  },
  lng: initialLanguage,
  fallbackLng: 'sk',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

useSettingsStore.subscribe((state, prevState) => {
  if (state.language !== prevState.language) {
    void i18n.changeLanguage(state.language);
  }
});

export default i18n;
