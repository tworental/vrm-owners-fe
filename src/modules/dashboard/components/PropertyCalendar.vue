<template>
  <div class="property-calendar">
    <calendar
      :months-number="1"
      :bookings="bookings"
      :options="options"
      :rangeSelected="rangeSelected"
      @slide="onSlide"
      @selected-range="selectedRange($event)"
    />
  </div>
  <add-booking-modal
    v-if="showBookingModal"
    :onClose="onCloseModal"
    :rangeSelected="rangeSelected"
    :property="property"
  />
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

import AddBookingModal from './AddBookingModal.vue';
import Calendar from './calendar/Calendar.vue';

export default {
  components: {
    AddBookingModal,
    Calendar,
  },
  props: {
    property: Object,
  },
  setup(props) {
    const store = useStore();

    const bookings = computed(() => store.state.dashboard.bookings);

    const showBookingModal = ref(false);
    const rangeSelected = ref(null);
    const options = ref({
      mode: 'half-day', // or 'full-day'
      locale: 'en',
    });

    const onCloseModal = () => {
      showBookingModal.value = false;
      rangeSelected.value = null;
    };

    const selectedRange = (range) => {
      rangeSelected.value = range;
      showBookingModal.value = true;
    };

    const onSlide = ({ date }) => {
      const startPoint = date.clone();

      const startDate = startPoint.clone().subtract(1, 'months').toISOString();
      const endDate = startPoint.clone().add(1, 'months').toISOString();

      store.dispatch('dashboard/setBookings', {
        unitId: props.property.id,
        startDate,
        endDate,
      });
    };

    return {
      bookings,
      showBookingModal,
      onCloseModal,
      selectedRange,
      options,
      rangeSelected,

      onSlide,
    };
  },
};
</script>

<style lang="scss" scoped>
.property-calendar {
  border-top: 1px solid rgba($color: $base-color, $alpha: 0.1);
  margin: 1em -1.2em -1em;
  padding: 1em 0 0;

  @media (max-width: 767px) {
    margin: 1em -0.8em -1em;
  }
}
</style>
