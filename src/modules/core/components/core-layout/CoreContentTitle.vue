<template>
  <div class="header">
    <span v-if="!!icon" class="header__icon">
      <core-svg :src="icon" :title="title" />
    </span>
    <h3 class="header__title">{{ title }}</h3>
  </div>
</template>

<script>
export default {
  name: 'CoreContentTitlte',
  props: {
    icon: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.5em;

  &__icon {
    margin-right: 1em;
    width: 32px;
    height: 32px;
    padding: 4px;
    background-color: $svg-bg-color;
    border-radius: 50%;
    display: flex;

    svg {
      margin: auto;
      stroke: none;
    }
  }

  &__title {
    color: $base-color;
    margin-bottom: 0;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;

    @media (min-width: 992px) {
      font-size: 18px;
      line-height: 28px;
    }
  }
}
</style>
