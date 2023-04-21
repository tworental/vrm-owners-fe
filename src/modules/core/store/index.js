import device from 'mobile-device-detect';
import { useWindowSize } from '@vueuse/core';

import { getLimits, getConfig } from '../services';

const { width } = useWindowSize();

export default {
  namespaced: true,

  state: {
    config: null,
  },

  getters: {
    isMobile: () => device.isMobile || width.value < 768,
  },

  actions: {
    setLimits: ({ commit }) => getLimits()
      .then(({ data }) => data.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {}))
      .then((data) => commit('SET_LIMITS', data)),

    setConfig: ({ commit }) => getConfig()
      .then(({ data }) => commit('SET_CONFIG', data)),
  },

  mutations: {
    SET_LIMITS(state, data) {
      state.limits = data;
    },

    SET_CONFIG(state, data) {
      state.config = data;
    },
  },
};
