import services from '../services';

export default {
  namespaced: true,
  state: {
    properties: [],
    bookings: [],
    property: {},
    availability: null,
  },
  actions: {
    setUnits: ({ commit }) => services.units.list()
      .then(({ data }) => commit('SET_PROPERTIES', data)),

    setUnit: ({ commit }, id) => services.units.show(id)
      .then(({ data }) => commit('SET_PROPERTY', data)),

    setBookings: ({ commit }, { unitId, startDate, endDate }) => services.bookings.list(unitId, { startDate, endDate })
      .then(({ data }) => commit('SET_BOOKINGS', data)),

    setAvailability: ({ commit }, { unitId, payload }) => services.bookings.checkAvailability(unitId, payload)
      .then(({ data }) => {
        commit('SET_AVAILABILITY', data);
        return data;
      }),

    addBooking: (state, { unitId, payload }) => services.bookings.create(unitId, payload),

    updateBooking: ({ commit, state: { bookings } }, booking) => {
      const newBookings = bookings.map((item) => (item.id === booking.id ? booking : item));

      return commit('SET_BOOKINGS', newBookings);
    },
  },
  mutations: {
    SET_PROPERTIES(state, data) {
      state.properties = data;
    },
    SET_PROPERTY(state, data) {
      state.property = data;
    },
    SET_BOOKINGS(state, data) {
      state.bookings = data;
    },
    SET_AVAILABILITY(state, data) {
      state.availability = data;
    },
  },
};
