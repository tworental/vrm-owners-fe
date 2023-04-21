<template>
  <div
    id="calendar-container"
    ref="calendarContainer"
  >
    <div
      class="calendar-month-container"
      v-for="month in months"
      :key="month.id"
    >
      <button
        class="btn btn-primary btn-today"
        v-on:click="onToday"
        v-e2e="'calendar-today'"
      >
        {{ $t('calendar.today') }}
      </button>
      <calendar-month
        @daySelected="daySelected($event)"
        @dayHovered="dayHovered($event)"
        :slideMonths="slideMonths"
        :month="month"
        :selectedDays="selectedDays"
        :is-selecting="isSelecting"
        :options="{ mode: options.mode }"
        :daySize="daySize"
      />
    </div>
  </div>
</template>

<script>
import {
  onBeforeUnmount, onMounted, ref, toRefs, watch,
} from 'vue';

import moment from '@/plugins/moment';
import CalendarMonth from './CalendarMonth.vue';

export default {
  name: 'Calendar',
  components: { CalendarMonth },
  props: {
    options: Object,
    rangeSelected: Object,
    monthsNumber: Number,
    bookings: Array,
    dayLabels: Array,
  },
  emits: ['slide', 'selected-range', 'clicked'],
  setup(props, { emit }) {
    const { bookings, rangeSelected } = toRefs(props);
    const startDay = ref(moment().format('YYYY-MM-01'));
    const calendarContainer = ref(null);
    const months = ref([]);
    const selectedDays = ref([]);
    const days = ref([]);
    const daySize = ref(30);
    const isSelecting = ref(false);
    const firstSelectionDate = ref(null);
    const startSelectionDate = ref(null);
    const endSelectionDate = ref(null);

    const getDatesBooking = ({ startDate, endDate }) => {
      const dates = Array.from(
        moment
          .range(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD'))
          .by('days'),
      );

      return dates.map((d) => d.format('YYYY-MM-DD'));
    };

    const computeDayTypes = (day) => {
      const typesApplied = {};
      const dayAsString = day.format('YYYY-MM-DD');

      const types = bookings.value.reduce((obj, booking) => {
        const dates = getDatesBooking(booking);
        obj.booked.periods.push({ dates, createdByOwner: booking.createdByOwner });

        return obj;
      }, { booked: { periods: [] } });

      Object.entries(types || {}).forEach(([type, typeContent]) => {
        const periodsContainingDay = typeContent.periods.filter(({ dates }) => dates.includes(dayAsString));

        const typeApplied = {
          morning: false,
          night: false,
          separation: false,
          owner: false,
        };

        if (periodsContainingDay.length) {
          typeApplied.owner = Boolean(periodsContainingDay[0].createdByOwner);

          if (props.options.mode === 'half-day') {
            if (periodsContainingDay.length === 2) {
              typeApplied.night = true;
              typeApplied.morning = true;
              typeApplied.separation = true;
            } else {
              const indexOfDayInPeriod = periodsContainingDay[0].dates.indexOf(dayAsString);
              if (indexOfDayInPeriod === 0) {
                typeApplied.night = true;
                typeApplied.morning = false;
                typeApplied.separation = false;
              } else if (indexOfDayInPeriod === periodsContainingDay[0].dates.length - 1) {
                typeApplied.morning = true;
                typeApplied.night = false;
                typeApplied.separation = false;
              } else {
                typeApplied.morning = true;
                typeApplied.night = true;
                typeApplied.separation = false;
              }
            }
          } else if (props.options.mode === 'full-day') {
            typeApplied.night = true;
            typeApplied.morning = true;
            typeApplied.separation = false;
          } else {
            console.log('options.mode not recognized');
          }
        }

        typesApplied[type] = typeApplied;
      });

      return typesApplied;
    };

    const fetchDayLabel = (day) => {
      const matchingDayLabel = props.dayLabels?.find((dayLabel) => dayLabel.date === day.format('YYYY-MM-DD'));
      return matchingDayLabel || null;
    };

    const computeDayRange = (start) => {
      let rangeStartDay = moment(start).startOf('week');
      let rangeEndDay = moment(start)
        .add(props.monthsNumber - 1, 'months')
        .endOf('month')
        .endOf('week');

      if (selectedDays.value.length > 0) {
        rangeStartDay = rangeStartDay > selectedDays.value[0]
          ? selectedDays.value[0]
          : rangeStartDay;
        rangeEndDay = rangeEndDay < selectedDays.value[-1]
          ? selectedDays.value[-1]
          : rangeEndDay;
      }

      const range = moment.range(
        rangeStartDay.subtract(2, 'days'),
        rangeEndDay.add(7, 'days'),
      );

      return Array.from(range.by('days')).map((day) => ({
        moment: day,
        typesApplied: computeDayTypes(day),
        label: fetchDayLabel(day),
      }));
    };

    const filterDatesInMonth = (datesArray, startOfMonth) => (
      datesArray
        ? datesArray.filter((day) => day.moment.isBetween(
          moment(startOfMonth).startOf('month').startOf('week').subtract(3, 'days'),
          moment(startOfMonth).endOf('month').endOf('week').add(7, 'days'),
        ))
        : []
    );

    const computeMonthObjects = (start) => {
      const newMonths = [];
      for (let i = 0; i < props.monthsNumber; i += 1) {
        const monthStart = moment(start).add(i, 'months');
        newMonths.push({
          id: i,
          start: monthStart,
          days: filterDatesInMonth(days.value, monthStart),
        });
      }
      return newMonths;
    };

    const renderCalendar = (start) => {
      days.value = computeDayRange(start);
      months.value = computeMonthObjects(start);
    };

    const computeDaySize = () => {
      if (calendarContainer.value) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        daySize.value = windowWidth > 700
          ? calendarContainer.value.offsetWidth / 25
          : calendarContainer.value.offsetWidth / 9;
      }
    };

    const slideMonths = (direction) => {
      let date;

      if (direction === 'next') {
        date = months.value[0].start.add(props.monthsNumber, 'months').startOf('month');
        renderCalendar(
          date,
        );
      } else if (direction === 'previous') {
        date = months.value[0].start
          .subtract(props.monthsNumber, 'months')
          .startOf('month');
        renderCalendar(
          date,
        );
      }
      emit('slide', { direction, date });
    };

    const clearSelection = () => {
      selectedDays.value = [];
    };

    const stopSelection = () => {
      isSelecting.value = false;
    };

    const resetSelections = () => {
      firstSelectionDate.value = null;
      startSelectionDate.value = null;
      endSelectionDate.value = null;
      clearSelection();
      stopSelection();
    };

    const daySelected = (dateSelected) => {
      if (!isSelecting.value) {
        firstSelectionDate.value = dateSelected;
        startSelectionDate.value = dateSelected;
        endSelectionDate.value = dateSelected;
        isSelecting.value = true;
        selectedDays.value = Array.from(
          moment
            .range(startSelectionDate.value, endSelectionDate.value)
            .by('days'),
        );
      } else {
        isSelecting.value = false;
        emit('selected-range', {
          start: startSelectionDate.value.format('YYYY-MM-DD'),
          end: startSelectionDate.value === endSelectionDate.value ? moment(endSelectionDate.value).add(1, 'days').format('YYYY-MM-DD') : endSelectionDate.value.format('YYYY-MM-DD'),
        });
      }
      emit('clicked', dateSelected);
    };

    const dayHovered = (dateHovered) => {
      if (isSelecting.value) {
        if (startSelectionDate.value > dateHovered) {
          startSelectionDate.value = dateHovered;
          endSelectionDate.value = firstSelectionDate.value;
        } else {
          startSelectionDate.value = dateHovered < firstSelectionDate.value ? dateHovered : firstSelectionDate.value;
          endSelectionDate.value = dateHovered < firstSelectionDate.value ? firstSelectionDate.value : dateHovered;
        }
        selectedDays.value = Array.from(
          moment.range(startSelectionDate.value, endSelectionDate.value).by('days'),
        );
      }
    };

    const onToday = () => {
      startDay.value = moment().format('YYYY-MM-01');
      renderCalendar(moment(startDay).startOf('month'));
    };

    onMounted(() => {
      moment.locale(props.options.locale);
      renderCalendar(moment(startDay).startOf('month'));
      computeDaySize();
      window.addEventListener('resize', computeDaySize);
    });

    watch(rangeSelected, () => {
      if (!rangeSelected.value) {
        resetSelections();
        renderCalendar(months.value[0].start.startOf('month'));
      }
    });

    watch(bookings, () => {
      renderCalendar(months.value[0].start.startOf('month'));
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', computeDaySize);
    });

    return {
      months,
      selectedDays,
      days,
      daySize,
      isSelecting,
      startSelectionDate,
      endSelectionDate,
      slideMonths,
      daySelected,
      dayHovered,
      stopSelection,
      calendarContainer,
      onToday,
    };
  },
};
</script>

<style lang="scss" scoped>
#calendar-container {
  width: 100%;
  display: table;
  background-color: white;
  position: relative;
  font-family: Roboto, sans-serif;
}

.btn-today {
  color: $primary;
  background-color: transparent;
  border: transparent;
  position: absolute;
  padding: 0;
  z-index: 1;
  left: 1em;
  top: 1px;

  &:focus {
    color: $primary;
  }

  &:hover {
    color: rgba($color: $primary, $alpha: 0.7);
  }

  @media (max-width: 767px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.calendar-month-container {
  display: table-cell;
}

@media screen and (max-width: 700px) {
  .calendar-month-container {
    display: block;
  }
}
</style>
