<template>
  <div
    class="month-slider"
    :class="{
      previous: isPrevious(),
      next: isNext(),
    }"
  >
    <core-svg
      :src="require('@/assets/icons/previous.svg')"
      v-if="isPrevious()"
      class="--no-stroke"
    />
    <core-svg
      :src="require('@/assets/icons/next.svg')"
      v-if="isNext()"
      class="next --no-stroke"
    />
  </div>
</template>

<script>
const DIRECTIONS = Object.freeze({
  PREV: 'previous',
  NEXT: 'next',
});

export default {
  name: 'CalendarMonthSlider',
  props: {
    direction: String,
  },
  setup(props) {
    const isNext = () => props.direction === DIRECTIONS.NEXT;
    const isPrevious = () => props.direction === DIRECTIONS.PREV;

    return { isNext, isPrevious };
  },
};
</script>

<style scoped>
.month-slider {
  position: relative;
  top: -1px;
  cursor: pointer;
}
</style>
