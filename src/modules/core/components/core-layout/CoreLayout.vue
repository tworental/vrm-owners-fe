<template>
  <div class="main-layout">
    <core-drawer />
    <div class="main-layout__content">
      <core-layout-header />
      <div class="main-layout__route-content">
        <slot name="header"></slot>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoreLayout',
};
</script>

<style lang="scss" scoped>
.main-layout {
  display: grid;
  grid: [stack] 1fr / -webkit-min-content [stack] 1fr;
  grid: [stack] 1fr / min-content [stack] 1fr;
  height: 100vh;

  &__route-content {
    padding: 1em;
    height: calc(100vh - 46px);
    overflow-y: auto;
  }

  // mobile view
  @media (max-width: 992px) {
    & > aside,
    & > &__content {
      grid-area: stack;
    }
  }

  @media (min-width: 768px) {
    &__route-content {
      height: calc(100vh - 54px);
    }
  }

  // desktop view
  @media (min-width: 992px) {
    // hide sidebar
    & > aside {
      display: none !important;
    }
    // full content
    &__content {
      width: 100vw;
    }
    // height of content
    &__route-content {
      padding: 1.5em 2em;
      height: calc(100vh - 80px);
    }
  }
}
</style>
