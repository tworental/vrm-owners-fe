import { signinRequest, signoutRequest } from '../services';

const COOKIE_ACCESS_TOKEN = document.cookie.match(new RegExp('(^| )ownerAccessToken=([^;]+)'));

export default {
  namespaced: true,
  state: {
    error: null,
    isLoggedIn: !!COOKIE_ACCESS_TOKEN,
    accessToken: COOKIE_ACCESS_TOKEN ? COOKIE_ACCESS_TOKEN[2] : null,
  },

  actions: {
    signin: ({ commit }, payload) => new Promise((resolve, reject) => {
      signinRequest(payload).then(({ data }) => {
        const expires = (new Date(Date.now() + data.expiresIn * 1000)).toUTCString();

        document.cookie = [
          `ownerAccessToken=${data.accessToken}`,
          `expires=${expires}`,
          'path=/',
          `domain=${process.env.VUE_APP_COOKIE_DOMAIN}`,
        ].join(';');

        commit('SET_SIGNIN_SUCCESS', data);

        resolve(data);
      }).catch((err) => {
        commit('SET_SIGNIN_FAILURE', err);
        reject(err);
      });
    }),

    signout: ({ commit }) => signoutRequest().finally(() => {
      document.cookie = [
        'ownerAccessToken=',
        'expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'path=/',
        `domain=${process.env.VUE_APP_COOKIE_DOMAIN}`,
      ].join(';');

      commit('SET_SIGNOUT');
    }),
  },

  mutations: {
    SET_SIGNIN_SUCCESS(state) {
      state.error = null;
    },

    SET_SIGNIN_FAILURE(state, error) {
      state.error = error;
      state.isLoggedIn = false;
      state.accessToken = null;
    },

    SET_SIGNOUT(state) {
      state.error = null;
      state.accessToken = null;
    },
  },
};
