import { getOwner, updateOwner } from '../services';

export default {
  namespaced: true,

  state: {
    owner: null,
  },

  actions: {
    setOwner: ({ commit }) => getOwner()
      .then(({ data }) => commit('SET_OWNER', data)),

    updateOwner: ({ dispatch }, data) => updateOwner(data)
      .then(() => dispatch('setOwner')),
  },

  mutations: {
    SET_OWNER(state, data) {
      state.user = data;
    },
  },
};
