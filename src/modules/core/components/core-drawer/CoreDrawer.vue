<template>
  <aside id="sidenav-mobile" ref="sidenavMobileRef">
    <nav>
      <div class="close-icon">
        <span v-on:click="onCloseMenu" type="button">
          <core-svg
            class="--no-stroke"
            :src="require('@/assets/icons/close.svg')"
            :title="$t('core.common.close')"
          />
        </span>
      </div>
      <router-link
        :to="{ name: 'dashboard' }"
        :class="{ active: $route.name === 'dashboard' }"
        v-e2e="'dashboard'"
      >
        <core-svg
          class="--no-stroke"
          :src="require('@/assets/icons/home.svg')"
          :title="$t('core.menu.myProperties')"
        />
        {{ $t('core.menu.myProperties') }}
      </router-link>
      <router-link
        :to="{ name: 'reports' }"
        :class="{ active: $route.name === 'reports' }"
        v-e2e="'reports'"
      >
        <core-svg
          class="--no-stroke"
          :src="require('@/assets/icons/report.svg')"
          :title="$t('core.menu.reports')"
        />
        {{ $t('core.menu.reports') }}
      </router-link>
      <router-link
        :to="{ name: 'statistics' }"
        :class="{ active: $route.name === 'statistics' }"
        v-e2e="'statistics'"
      >
        <core-svg
          class="--no-stroke"
          :src="require('@/assets/icons/statistics.svg')"
          :title="$t('core.menu.statistics')"
        />
        {{ $t('core.menu.statistics') }}
      </router-link>
    </nav>

    <a id="sidenav-close" v-on:click="onCloseMenu" />
  </aside>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'CoreDrawer',
  setup() {
    const sidenavMobileRef = ref(null);

    const onCloseMenu = () => {
      if (sidenavMobileRef.value) {
        sidenavMobileRef.value.classList.remove('--open');
      }
    };

    return {
      onCloseMenu,
      sidenavMobileRef,
    };
  },
};
</script>

<style lang="scss" scoped>
#sidenav-mobile {
  display: grid;
  grid-template-columns: [nav] 230px [escape] 1fr;
  position: sticky;
  top: 0;
  z-index: 2;
  max-height: 100vh;
  overflow: hidden auto;
  overscroll-behavior: contain;
  transform: translateX(-110vw);
  transition: all 0.4s linear;

  &.--open {
    transform: translateX(0);
  }

  nav {
    background-color: $white;
    display: inline-flex;
    flex-direction: column;
    min-width: 230px;
    border-right: 1px solid rgba($color: $base-color, $alpha: 0.1);

    a {
      text-decoration: none;
      line-height: 1.25;
      font-size: 16px;
      line-height: 28px;
      color: $base-color;
      height: 46px;
      padding: 9px 16px;
      border-left: 4px solid transparent;
      display: flex;
      align-items: center;
      font-size: 12px;
      line-height: 22px;

      svg {
        width: 22px;
        height: 22px;
        margin-right: 22px;
      }

      &.active {
        border-left: 4px solid $primary;
      }

      &:hover,
      &.active {
        color: $primary;
        background-color: rgba($color: $primary, $alpha: 0.07);
        svg {
          fill: $primary;
          g {
            fill: $primary;
          }
        }
      }
    }
  }

  .close-icon {
    background-color: $white;
    display: flex;
    align-items: center;
    padding-left: 23px;
    left: 0;
    top: 0;
    width: 100%;
    height: 46px;
    height: 46px;
    max-width: 230px;
    border-bottom: 1px solid rgba($color: $base-color, $alpha: 0.1);
    &:hover svg {
      fill: $primary;
      g {
        fill: $primary;
      }
    }
  }

  @media (min-width: 768px) {
    & .close-icon {
      height: 54px;
    }
  }
}
</style>
