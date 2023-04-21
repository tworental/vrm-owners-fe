import { configure, defineRule } from 'vee-validate';
import rules from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

import locales from '../i18n/vee-validate';

Object.keys(rules).forEach((rule) => {
  defineRule(rule, rules[rule]);
});

configure({
  bails: false,
  validateOnInput: true,
  generateMessage: localize(locales),
});
