<template>
  <core-modal>
    <div class="booking-modal">
      <div class="booking-modal__header">
        <div class="titles">
          <h4 class="titles__title">{{ property.name }}</h4>
          <p class="titles__address">{{ property.address }}</p>
        </div>
        <button
          v-on:click="onClose"
          class="btn btn-close-modal"
          v-e2e="'close-modal'"
        >
          <core-svg
            :src="require('@/assets/icons/close.svg')"
            class="--no-stroke"
          />
        </button>
      </div>
      <div class="booking-modal__content">
        <div class="content1">
          <div class="d-flex">
            <core-svg
              :src="require('@/assets/icons/calendar.svg')"
              class="--no-stroke"
            />
            <span class="content1__day">{{ duration }}</span>
            <span class="content1__dayS">{{ $t('calendar.nights', { count: duration }) }}</span>
          </div>
          <div class="d-flex content1__fromto">
            <span class="content1__normal">{{ $t('calendar.from') }}</span>
            <span class="content1__bold mg">{{ startDateLabel }}</span>
            <span class="content1__normal">{{ $t('calendar.to') }}</span>
            <span class="content1__bold ml">{{ endDateLabel }}</span>
          </div>
        </div>
        <form
          @submit.prevent="onSubmit"
          name="add-booking"
          v-e2e
        >
          <label
            for="inputNotes"
            class="form-label"
          >
            {{ $t('core.common.notes') }}
          </label>
          <textarea
            class="form-control"
            :rows="4"
            v-model="formData.notes"
            name="notes"
            id="inputNotes"
            rules="required"
          />
          <div
            class="form-text text-danger"
            :class="{ 'has-warning': calculateLoseMoney(bookingOverlaped) > 0 }"
          >
            <span>{{ formData.error }}</span>
          </div>
          <div
            v-if="calculateLoseMoney(bookingOverlaped) > 0"
            class="d-flex warning"
          >
            <core-svg
              :src="require('@/assets/icons/warning.svg')"
              class="--no-stroke"
              :width="36"
            />
            <span class="warning__text">
              {{ $t('dashboard.validation.bookingWarning', { money: `$${calculateLoseMoney(bookingOverlaped)}` }) }}
            </span>
          </div>
          <div class="d-flex justify-content-center">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="isLoading || calculateLoseMoney(bookingOverlaped) > 0"
              v-e2e="'add-booking'"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-if="isLoading"
              />
              {{ $t('core.common.send') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </core-modal>
</template>

<script>
import {
  reactive, ref, toRaw, computed, onMounted, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import moment from '@/plugins/moment';
import useToastr from '@/modules/core/composables/toastr';
import CoreModal from '@/modules/core/components/CoreModal.vue';
import { setTimeToDate } from '@/modules/dashboard/utils/time';

const DATE_FORMAT = 'DD/MM/YYYY';
const YYYY_FORMAT = 'YYYY/MM/DD';

export default {
  name: 'AddBookingModal',
  components: {
    CoreModal,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    property: {
      type: Object,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    rangeSelected: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const { t } = useI18n();
    const { toastr } = useToastr();

    const formData = reactive({
      notes: '',
      error: null,
    });

    const isLoading = ref(false);
    const startDateLabel = ref(moment(props.rangeSelected.start).format(DATE_FORMAT));
    const endDateLabel = ref(moment(props.rangeSelected.end).format(DATE_FORMAT));
    const duration = ref(moment(props.rangeSelected.end).diff(moment(props.rangeSelected.start), 'days'));

    const bookings = computed(() => store.state.dashboard.bookings);
    const property = computed(() => store.state.dashboard.property);
    const bookingOverlaped = computed(() => {
      const { start, end } = props.rangeSelected;
      const range = moment.range(
        moment(start, YYYY_FORMAT),
        moment(end, YYYY_FORMAT),
      );

      const bookingHasDatesBooked = bookings.value.find(({ startDate, endDate }) => {
        const rangeBooking = moment.range(
          moment(startDate),
          moment(endDate),
        );

        return range.overlaps(rangeBooking);
      });

      return bookingHasDatesBooked;
    });

    const onSubmit = () => {
      const { notes } = toRaw(formData);

      if (!notes.length) {
        formData.error = t('dashboard.validation.notesRequired');
        return;
      }

      formData.error = null;
      isLoading.value = true;

      const { start, end } = props.rangeSelected;

      store.dispatch('dashboard/setAvailability', {
        unitId: property.value.id,
        payload: {
          dateArrival: moment(start, YYYY_FORMAT).toISOString(),
          dateDeparture: moment(end, YYYY_FORMAT).toISOString(),
          guests: 2,
        },
      })
        .then((data) => {
          if (!data.availability) {
            return toastr.error(t('dashboard.validation.unitIsNotAvailable'));
          }

          const amountAccommodationDue = Object.values(data.availability.nightlyRates)
            .reduce((acc, curr) => acc + curr, 0);
          const guestsAdults = 2;

          const payload = {
            dateArrival: setTimeToDate(moment(start, YYYY_FORMAT), data.checkinTime).toISOString(),
            dateDeparture: setTimeToDate(moment(end, YYYY_FORMAT), data.checkoutTime).toISOString(),
            notes,
            guestsAdults,
            amountAccommodationDue,
          };

          return store.dispatch('dashboard/addBooking', { unitId: property.value.id, payload })
            .then(() => toastr.success(t('dashboard.validation.addBookingSuccess')))
            .then(() => store.dispatch('dashboard/setBookings', {
              unitId: property.value.id,
              startDate: moment(start, YYYY_FORMAT).startOf('month').subtract(1, 'month').toISOString(),
              endDate: moment(start, YYYY_FORMAT).startOf('month').add(1, 'month').toISOString(),
            }));
        })
        .finally(() => {
          props.onClose();
          isLoading.value = false;
        });
    };

    const calculateLoseMoney = (booking) => {
      if (booking) {
        const { pricePerNight, startDate, endDate } = booking;
        const nights = moment(endDate).diff(moment(startDate), 'days');

        return pricePerNight * nights;
      }

      return 0;
    };

    const handleKeyPress = (evt) => {
      if (evt.key === 'Escape') {
        props.onClose();
      }
    };

    onMounted(() => {
      document.addEventListener('keyup', handleKeyPress);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keyup', handleKeyPress);
    });

    return {
      startDateLabel,
      endDateLabel,
      duration,
      onSubmit,
      formData,
      isLoading,
      calculateLoseMoney,
      bookingOverlaped,
    };
  },
};
</script>

<style lang="scss" scoped>
.booking-modal {
  width: 332px;
  color: $base-color;

  &__header {
    display: flex;
    justify-content: space-between;

    .btn-close-modal {
      padding: 0;
      height: 24px;
    }
  }

  .titles {
    &__title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 500;
      margin-bottom: 0;
    }

    &__address {
      font-size: 12px;
      line-height: 22px;
      font-weight: 300;
      color: rgba($color: $base-color, $alpha: 0.5);
    }
  }

  .content1 {
    display: flex;
    justify-content: space-between;

    svg {
      margin-right: 0.5em;
    }

    &__day {
      position: relative;
      top: 2px;
      font-size: 16px;
      line-height: 22px;

      &S {
        font-size: 10px;
        margin-left: 0.5em;
        align-self: flex-end;
        color: rgba($color: $base-color, $alpha: 0.5);
      }
    }

    &__fromto {
      position: relative;
      top: 3px;
    }

    &__normal {
      font-size: 10px;
      line-height: 22px;
      color: rgba($color: $base-color, $alpha: 0.5);
      align-self: center;
      position: relative;
      top: 1px;
    }

    &__bold {
      font-size: 12px;
      line-height: 22px;

      &.mg {
        margin: 0 0.4em;
      }
      &.ml {
        margin-left: 0.4em;
      }
    }
  }

  .form-label {
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
    color: rgba($color: $base-color, $alpha: 0.5);
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  .form-control {
    resize: none;
    font-size: 14px;
  }

  .text-danger {
    height: 21px;
    margin-bottom: 0.5em;

    &.has-warning {
      height: auto;
    }
  }

  .warning {
    align-items: center;
    margin-bottom: 1em;

    &__text {
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
      color: $error-color;
      margin-left: 8px;
    }
  }

  .btn-primary {
    width: 126px;
  }
}
</style>
