<template>
  <td
    class="calendar-day"
    :class="{
      'hidden-day': isHidden,
      selectable: !isHidden,
      'first-selected': selection.isFirstSelected,
      'last-selected': selection.isLastSelected,
      selected: selection.isSelected,
      selecting: selection.isSelecting,
      morning: dayClassnames.morningColor,
      night: dayClassnames.nightColor,
      'full-color': dayClassnames.fullColor,
      'owner': dayClassnames.owner,
      divider: !dayClassnames.divider,
      today: dayClassnames.isToday,
    }"
    :id="dayId"
    @mousedown="clicked"
    @mouseup="clicked"
    @mouseover="mouseOver"
    @mouseleave="mouseLeave"
  >
    <div
      class="calendar-day-wrapper"
      :style="dayWidthStyle"
    >
      <div class="calendar-day-date-content calendar-day-content">
        <div>{{ formatDate(date) }}</div>
      </div>
      <div class="calendar-day-label-content calendar-day-content">
        <div v-if="label">{{ label.text }}</div>
      </div>
    </div>
  </td>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import moment from '@/plugins/moment';

export default {
  name: 'CalendarDay',
  props: {
    date: Object,
    isHidden: Boolean,
    label: Object,
    size: Number,
    typesApplied: Object,
    selection: Object,
    options: Object,
  },
  emits: ['clicked', 'hovered'],
  setup(props, { emit }) {
    const store = useStore();

    const isHovered = ref(false);

    const isMobile = computed(() => store.getters['core/isMobile']);
    const dayId = computed(() => (props.isHidden ? null : props.date.format('YYYY-MM-DD')));
    const dayWidthStyle = computed(() => ({
      height: `${isMobile.value ? props.size * 2 : 89}px`,
      width: `${props.size}px`,
    }));
    const dayClassnames = computed(() => {
      if (props.isHidden) {
        return {};
      }

      const morningTypeApplied = Object.keys(props.typesApplied).find(
        (type) => props.typesApplied[type].morning,
      );
      const nightTypeApplied = Object.keys(props.typesApplied).find(
        (type) => props.typesApplied[type].night,
      );
      const separationTypeApplied = Object.keys(props.typesApplied).find(
        (type) => props.typesApplied[type].separation,
      );
      const ownerApplied = Object.keys(props.typesApplied).find(
        (type) => props.typesApplied[type].owner,
      );

      let morningColor = !!morningTypeApplied;
      let nightColor = !!nightTypeApplied;
      let fullColor = false;
      const owner = !!ownerApplied;

      if (props.selection.isSelected) {
        if (!props.selection.isFirstSelected) {
          morningColor = true;
        }
        if (!props.selection.isLastSelected) {
          nightColor = true;
        }
        fullColor = !props.selection.isFirstSelected && !props.selection.isLastSelected;
      }

      if (isHovered.value) {
        if (!props.isHidden) {
          if (!props.selection.isSelected && !props.selection.isSelecting) {
            nightColor = true;
          }

          if (props.selection.isSelecting && props.selection.isFirstSelected) {
            nightColor = true;
          }

          if (
            props.selection.isSelecting && props.selection.isLastSelected && !props.selection.isFirstSelected
          ) {
            morningColor = true;
          }
        }
      }

      return {
        morningColor,
        nightColor,
        fullColor,
        owner,
        isToday: moment().isSame(props.date, 'day'),
        divider: morningColor === nightColor && !separationTypeApplied,
      };
    });

    const clicked = (evt) => {
      if (evt.type === 'mousedown') {
        if (props.date.diff(moment(), 'days') >= 0) {
          emit('clicked', props.date);
          isHovered.value = true;
        }
      }

      if (evt.type === 'mouseup' && props.selection.isSelecting) {
        emit('clicked', props.date);
        isHovered.value = false;
      }
    };

    const mouseOver = () => {
      if (props.date.diff(moment(), 'days') >= 0) {
        emit('hovered', props.date);
      }
    };

    const mouseLeave = () => {
      isHovered.value = false;
    };

    const formatDate = (date) => moment(date).format('DD');

    return {
      isHovered,
      dayId,
      dayWidthStyle,
      dayClassnames,
      clicked,
      mouseOver,
      mouseLeave,
      formatDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.calendar-day {
  width: 30px;
  text-align: center;
  position: relative;
  vertical-align: middle;
  padding: 0;
  z-index: 0;
  overflow: hidden;
  user-select: none;
  border: 1px solid rgba($color: $base-color, $alpha: 0.1);
}

.calendar-day.selectable {
  cursor: pointer;
}

.hidden-day.first-selected::before,
.hidden-day .calendar-day-wrapper {
  display: none;
}

.calendar-day-content {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.calendar-day-date-content {
  font-size: 12px;
  user-select: none;

  & > div {
    position: absolute;
    right: 8px;
    top: 4px;
    @media (max-width: 767px) {
      position: unset;
    }
  }
}
.calendar-day-label-content {
  color: rgba($color: $base-color, $alpha: 0.8);
  font-size: 0.75rem;
}

.month-table {
  &-body {
    tr {
      &.last-week td {
        border-bottom: none;
      }

      td {
        &:not(:last-child) {
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
  }
}

// style hover and dragging
$today-color: #fff8f8;
$selecting-color: #e0f2ff;
$owner-color: #34BD8C;

%day-color-select {
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: $success-color;
    overflow: hidden;
    transform: skewX(-30deg) skewY(0deg);
  }
}

.today {
  background-color: $today-color;
  .calendar-day-content {
    font-weight: 500;
    font-size: 0.9em;
  }
}

.night {
  @extend %day-color-select;
}

.first-selected.last-selected.selecting {
  @extend %day-color-select;
  &:before {
    background-color: $selecting-color !important;
    transform: skewX(-30deg) skewY(0deg) translateX(-100%);
  }
}

.first-selected.morning.night {
  background-color: $selecting-color;
}

.selected.full-color,
.selected.full-color::before {
  background-color: $selecting-color !important;
}

.selecting.last-selected.morning {
  @extend %day-color-select;
  &:before {
    background-color: $selecting-color !important;
  }
}

.first-selected.selected.night {
  @extend %day-color-select;
  &:before {
    background-color: $selecting-color !important;
  }
}

.first-selected.selected.morning {
  @extend %day-color-select;
  &:before {
    background-color: $success-color !important;
  }
}

.last-selected.morning.today {
  @extend %day-color-select;
  &:before {
    background-color: $success-color !important;
  }
}

.last-selected.morning.divider.today {
  @extend %day-color-select;
  &:before {
    background-color: $success-color !important;
    transform: skewX(-30deg) skewY(0deg) translateX(-100%);
  }
}

.last-selected.selected.morning,
.last-selected.selecting.night:hover,
.last-selected.selecting.selected:hover {
  @extend %day-color-select;
  &:before {
    background-color: $selecting-color;
    transform: skewX(-30deg) skewY(0deg) translateX(-100%);
  }
}

.morning,
.last-selected.selecting.night:hover,
.last-selected.selecting.selected:hover {
  @extend %day-color-select;
  &:before {
    transform: skewX(-30deg) skewY(0deg) translateX(-100%);
  }
}

.first-selected.morning.night,
.morning.divider {
  @extend %day-color-select;
  &:before {
    transform: skewX(-30deg) skewY(0deg) translateX(-100%);
    border-right: 1px solid white;
  }
}

.full-color,
.morning.night {
  background-color: $success-color;
}

.morning.night.full-color {
  @extend %day-color-select;
  &:before {
    transform: unset;
    border-right: unset;
  }
}

.owner {
  &.morning.night,
  &.first-selected.selected.morning:before,
  &.last-selected.morning.today:before,
  &.last-selected.morning.divider.today:before {
    background-color: $owner-color;
  }

  &.morning:before,
  &.night:before {
    background-color: $owner-color;
  }

  &.first-selected.selected.morning:before {
    background-color: $owner-color !important;
  }
}
</style>
