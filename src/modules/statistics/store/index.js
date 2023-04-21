import { getStatistics } from '../services';

const startYear = new Date().getFullYear();

const CamelCase = {
  OCCUPANCY: 'occupancy',
  AVG_NIGHTLY_RATE: 'avgNightlyRate',
  BOOKED_NIGHTS: 'bookedNights',
  OWNER_REVENUE: 'ownerRevenue',
};

const formatStatscData = (obj, item) => ({
  ...obj,
  [CamelCase[item.type]]: item,
});

export default {
  namespaced: true,
  state: {
    data: {},
    year: startYear,
    currentDataChart: 'OWNER_REVENUE',
  },
  actions: {
    setStatistics: ({ commit, state: { year } }) => getStatistics(year)
      .then(({ data }) => {
        const { statistics, ...restData } = data;
        const newStats = restData.year !== year
          ? { labels: restData.labels }
          : statistics.reduce(formatStatscData, restData);
        commit('SET_STATISTICS', newStats);
      }),
    setYear: ({ commit, dispatch }, year) => {
      commit('SET_YEAR', year);
      return dispatch('setStatistics');
    },
    setDataChartType: ({ commit, state: { currentDataChart } }, dataChartType) => {
      const newType = currentDataChart === dataChartType ? 'OWNER_REVENUE' : dataChartType;
      return commit('SET_DATA_CHART_TYPE', newType);
    },
  },
  mutations: {
    SET_STATISTICS(state, data) {
      state.data = data;
    },
    SET_YEAR(state, year) {
      state.year = year;
    },
    SET_DATA_CHART_TYPE(state, dataChartType) {
      state.currentDataChart = dataChartType;
    },
  },
};
