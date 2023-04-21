<template>
  <div class="calendar-month">
    <div class="month-name">
      <calendar-month-slider
        direction="previous"
        @click="slideMonths('previous')"
      />
      <span class="month">{{ monthLabel.split(' ')[0] }}</span>
      <calendar-month-slider
        direction="next"
        @click="slideMonths('next')"
      />
    </div>
    <div class="month-year">{{ monthLabel.split(' ')[1] }}</div>
    <div
      class="month-table-container"
      ref="monthContainer"
    >
      <table class="month-table">
        <thead class="month-table-header">
          <tr>
            <th
              class="month-table-header-day"
              v-for="dayLabel in dayLabels"
              :key="dayLabel"
            >
              {{ dayLabel }}
            </th>
          </tr>
        </thead>
        <tbody class="month-table-body">
          <tr
            v-for="week in weeks"
            :key="week.id"
            :class="{ 'last-week': week.isLastWeek }"
          >
            <calendar-day
              v-for="day in week.days"
              :weekType="week.type"
              :key="day.id"
              :date="day.moment"
              :isHidden="!isDayInMonth(day.moment)"
              :types-applied="day.typesApplied"
              :label="day.label"
              :size="daySize"
              :selection="{
                isSelected: isDaySelected(day.moment) && isDayInMonth(day.moment),
                isSelecting: isSelecting,
                isFirstSelected: isFirstDaySelected(day.moment),
                isLastSelected: isLastDaySelected(day.moment),
              }"
              :options="options"
              @clicked="dayClicked($event)"
              @hovered="dayHovered($event)"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

import moment from '@/plugins/moment';
import CalendarMonthSlider from './CalendarMonthSlider.vue';
import CalendarDay from './CalendarDay.vue';

export default {
  name: 'CalendarMonth',
  components: {
    CalendarDay,
    CalendarMonthSlider,
  },
  props: {
    month: Object,
    selectedDays: Array,
    isSelecting: Boolean,
    slideMonths: Function,
    options: Object,
    daySize: Number,
  },
  emits: ['daySelected', 'dayHovered'],
  setup(props, { emit }) {
    const monthLabel = ref(moment(props.month.start).format('MMMM YYYY'));
    const dayLabels = ref([]);
    const weeks = ref([]);

    const renderMonth = () => {
      weeks.value = [];
      dayLabels.value = moment
        .weekdays(true)
        .map((dayLabel) => dayLabel.substring(0, 3));

      const daysInMonth = moment(props.month.start).daysInMonth();

      for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
        const weekDays = [];
        const firstDayOWeek = moment(props.month.start)
          .startOf('week')
          .add(weekIndex, 'weeks');

        for (let dayIterator = 0; dayIterator < 7; dayIterator += 1) {
          const day = moment(firstDayOWeek).add(dayIterator, 'days');
          const dayIndex = props.month.days.findIndex((x) => x.moment.isSame(day));

          weekDays.push({
            id: dayIndex,
            moment: props.month.days[dayIndex].moment,
            typesApplied: props.month.days[dayIndex].typesApplied,
            label: props.month.days[dayIndex].label,
          });
        }

        const firstDateOfWeek = +weekDays[0].moment.format('DD');
        const isLastWeek = firstDateOfWeek === 30 && daysInMonth === 31
          ? false
          : weekIndex === 5 && firstDateOfWeek < daysInMonth;

        weeks.value.push({
          id: weekIndex,
          days: weekDays,
          type: 'week',
          isLastWeek,
        });
      }
    };

    // Helpers
    const dayIndexInSelection = (day) => {
      const preFormat = props.selectedDays.map((selectedDay) => selectedDay.format('YYYY-MM-DD'));
      return preFormat.indexOf(day.format('YYYY-MM-DD'));
    };
    const isDayInMonth = (day) => day.month() === props.month.start.month();
    const isDaySelected = (day) => dayIndexInSelection(day) >= 0;
    const isFirstDaySelected = (day) => dayIndexInSelection(day) === 0;
    const isLastDaySelected = (day) => dayIndexInSelection(day) === props.selectedDays.length - 1;

    // Events
    const dayClicked = (date) => {
      emit('daySelected', date);
    };

    const dayHovered = (date) => {
      emit('dayHovered', date);
    };

    onMounted(() => {
      renderMonth();
    });

    watch(
      () => props.month,
      () => {
        monthLabel.value = moment(props.month.start).format('MMMM YYYY');
        renderMonth();
      },
    );

    return {
      dayLabels,
      weeks,
      dayClicked,
      dayHovered,
      isDayInMonth,
      isDaySelected,
      isFirstDaySelected,
      isLastDaySelected,
      monthLabel,
    };
  },
};
</script>

<style lang="scss" scoped>
.month-name {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  span.month {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: $base-color;
    width: 100px;

    @media (max-width: 991px) {
      font-size: 14px;
      line-height: 20px;
    }
  }
}

.month-year {
  text-align: center;
  margin-bottom: 2em;
  font-size: 12px;
  line-height: 22px;
  font-weight: 500;
  color: rgba($color: $base-color, $alpha: 0.7);
}

.month-table-container {
  width: 100%;
  margin-top: 10px;
}

.month-table {
  width: 100%;
  border-spacing: 0;
}

.month-table-header {
  display: table-header-group;
}

.month-table-header-day {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  border-bottom: 1px solid rgba($color: $base-color, $alpha: 0.1);
  padding-bottom: 8px;
  text-align: center;
  color: $base-color;
  @media (max-width: 991px) {
    font-size: 12px;
    line-height: 18px;
  }
}

@media screen and (max-width: 700px) {
  .month-name {
    margin-bottom: 1.5em;
  }
  .month-year {
    position: absolute;
    margin-bottom: 0;
    right: 8px;
    top: 2px;
  }
}
</style>
