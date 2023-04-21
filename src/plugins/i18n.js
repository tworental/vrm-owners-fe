import { createI18n } from 'vue-i18n';

import accountI18n from '@/modules/account/i18n';
import authI18n from '@/modules/auth/i18n';
import coreI18n from '@/modules/core/i18n';
import dashboardI18n from '@/modules/dashboard/i18n';
import reportsI18n from '@/modules/reports/i18n';
import statisticsI18n from '@/modules/statistics/i18n';
import errorsI18n from '@/modules/errors/i18n';

const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';

const availableLocales = (process.env.VUE_APP_I18N_SUPPORTED_LOCALE || 'en').split(',');

const matches = document.cookie.match(new RegExp('(^| )lang=([^;]+)'));

const locale = matches && availableLocales.includes(matches[2])
  ? matches[2]
  : (process.env.VUE_APP_I18N_LOCALE || fallbackLocale);

export default createI18n({
  legacy: true,
  locale,
  availableLocales,
  fallbackLocale,
  messages: availableLocales.reduce((stack, lang) => ({
    ...stack,
    [lang]: [
      accountI18n,
      authI18n,
      coreI18n,
      dashboardI18n,
      errorsI18n,
      reportsI18n,
      statisticsI18n,
    ].reduce((acc, curr) => ({ ...acc, ...(curr[lang] || {}) }), {}),
  }), {}),
});
