import { list } from '../services';

export default {
  namespaced: true,
  state: {
    data: [],
    page: 1,
    total: 0,
    perPage: 10,
    from: 0,
    to: 0,
  },
  actions: {
    setReports: ({ commit, state }, currentPage = 1) => list({ currentPage, perPage: state.perPage })
      .then(({ data, meta: { pagination } }) => commit('SET_REPORTS', { data, pagination })),
  },
  mutations: {
    SET_REPORTS(state, { data, pagination }) {
      state.data = data;
      state.page = pagination.currentPage;
      state.total = pagination.total;
      state.from = pagination.from + 1;
      state.to = pagination.to;
    },
  },
};
