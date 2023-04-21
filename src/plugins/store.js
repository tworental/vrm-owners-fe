import LogRocket from 'logrocket';
import createPlugin from 'logrocket-vuex';
import { createStore } from 'vuex';

import account from '@/modules/account/store';
import auth from '@/modules/auth/store';
import core from '@/modules/core/store';
import dashboard from '@/modules/dashboard/store';
import reports from '@/modules/reports/store';
import statistics from '@/modules/statistics/store';

export default createStore({
  modules: {
    account,
    auth,
    core,
    dashboard,
    reports,
    statistics,
  },
  plugins: [createPlugin(LogRocket)],
});
