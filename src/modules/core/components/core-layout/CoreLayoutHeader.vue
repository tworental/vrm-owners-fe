<template>
  <header class="main-header">
    <span
      v-on:click="openSidenavMobile"
      class="main-header__menu-mobile"
      type="button"
    >
      <core-svg :src="require('@/assets/icons/menu.svg')" role="presentation" />
    </span>
    <div class="main-header__logo">
      <router-link :to="{ name: 'dashboard' }" v-e2e="'dashboard'">
        <core-svg
          :src="require('@/assets/icons/logo.svg')"
          class="--no-stroke logo"
        />
        <core-svg
          :src="require('@/assets/icons/logo-text.svg')"
          class="--no-stroke logo-text"
          :height="44"
          :width="120"
          viewBox="0 0 575 36"
        />
      </router-link>
    </div>
    <div class="main-header__links-avatar">
      <div class="main-header__links">
        <router-link
          :to="{ name: 'dashboard' }"
          :class="{ active: $route.name === 'dashboard' }"
          v-e2e="'dashboard'"
        >
          {{ $t('core.menu.myProperties') }}
        </router-link>
        <router-link
          :to="{ name: 'reports' }"
          :class="{ active: $route.name === 'reports' }"
          v-e2e="'reports'"
        >
          {{ $t('core.menu.reports') }}
        </router-link>
        <router-link
          :to="{ name: 'statistics' }"
          :class="{ active: $route.name === 'statistics' }"
          v-e2e="'statistics'"
        >
          {{ $t('core.menu.statistics') }}
        </router-link>
      </div>
      <div class="main-header__avatar">
        <div class="dropdown">
          <a
            href="#"
            role="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <core-avatar
              :size="isMobile ? 36 : 44"
              :username="user?.firstName || user?.email"
              :src="user?.avatar"
            />
          </a>
          <ul class="dropdown-menu shadow" aria-labelledby="dropdownMenuLink">
            <li class="avatar">
              <div class="d-flex">
                <core-avatar
                  :src="user?.avatar"
                  :size="50"
                  color="#2E319210"
                  :username="`${user?.firstName} ${user?.lastName}`"
                  textColor="#495057"
                />
                <div>
                  <h6 class="avatar__name">
                    {{ `${user?.firstName} ${user?.lastName}` }}
                  </h6>
                  <p class="avatar__email">{{user?.email}}</p>
                </div>
              </div>
            </li>
            <li>
              <router-link
                :to="{ name: 'account' }"
                class="dropdown-item"
                v-e2e="'account'"
              >
                <core-svg
                  :src="require('@/assets/icons/single-neutral-circle.svg')"
                  :width="20"
                  :title="$t('core.menu.accountDetails')"
                />{{ $t('core.menu.accountDetails') }}
              </router-link>
            </li>
            <li class="logout">
              <router-link
                :to="{ name: 'signout' }"
                class="dropdown-item"
                v-e2e="'logout'"
              >
                <core-svg
                  :src="require('@/assets/icons/logout-1.svg')"
                  :width="20"
                  :title="$t('core.menu.logout')"
                />{{ $t('core.menu.logout') }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CoreLayoutHeader',
  setup() {
    const store = useStore();

    const user = computed(() => store.state.account.user);
    const isMobile = computed(() => store.getters['core/isMobile']);

    const openSidenavMobile = () => {
      const sidebarMenu = document.getElementById('sidenav-mobile');

      if (sidebarMenu) {
        sidebarMenu.classList.add('--open');
      }
    };

    return {
      user,
      isMobile,
      openSidenavMobile,
    };
  },
};
</script>

<style scoped lang="scss">
img {
  width: 100%;
  height: 100%;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 1em;
  background-color: $white;
  border-bottom: 1px solid $border-color;

  &__menu-mobile {
    & > svg {
      width: 20px;
    }
    &:hover {
      color: $primary;
    }
  }

  &__logo {
    display: inline-block;
    height: 36px;
    svg.logo {
      width: 36px;
    }
    svg.logo-text {
      margin-top: -12px;
    }
  }

  &__links-avatar {
    display: flex;
  }

  &__links {
    display: flex;
    align-items: center;
    height: 54px;

    a {
      color: rgba($color: $base-color, $alpha: 0.7);
      font-size: 16px;
      line-height: 28px;
      padding: 0 1em;
      text-decoration: none;
      height: 100%;
      padding-top: 14px;
      position: relative;

      &.active,
      &:hover {
        color: $base-color;
        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          width: calc(100% - 2em);
          padding: 0 1em;
          border-bottom: 2px solid $primary;
        }
      }
    }
  }

  &__avatar {
    margin-left: 1em;
    align-self: center;

    .dropdown {
      background-color: transparent;
      align-self: center;

      &-menu {
        border-radius: 4px;
        margin-top: 0.5em !important;
        padding: 0;
        border: 1px solid rgba($color: $base-color, $alpha: 0.05);

        .avatar-wrapper {
          margin-right: 1em;
          min-width: 50px;
        }

        .avatar {
          padding: 1.5em 2em 1em;

          .avatar-wrapper {
            border: 1px solid $primary;
          }

          &__name {
            margin-bottom: 0.2em;
            color: $base-color;
          }

          &__email {
            margin-bottom: 0;
            font-size: 14px;
            color: rgba($color: $base-color, $alpha: 0.5)
          }
        }

        li {
          &.logout {
            margin-top: 0.5em;
            border-top: 1px solid rgba($color: $base-color, $alpha: 0.1);

            a {
              color: $link-color;
              text-decoration: underline;

              &:hover {
                text-decoration: none;
                color: $link-color;
                svg {
                  color: $link-color;
                }
              }

              svg {
                color: $base-color;
              }
            }
          }

          a {
            padding: 1em 2em;
            color: $base-color;

            svg {
              margin-right: 0.6em;
            }

            &:hover {
              color: $primary;
              background-color: rgba($color: $primary, $alpha: 0.07);
            }
          }
        }
      }

      a {
        text-decoration: none;
      }
    }
  }

  @media (min-width: 768px) {
    height: 54px;
  }

  // hide links on mobile view
  @media (max-width: 992px) {
    &__links {
      display: none;
    }
    &__logo {
      svg.logo-text {
        display: none;
      }
    }
    &__avatar {
      li a {
        font-size: 14px;
      }
    }
  }
  // hide menu icon on desktop view
  @media (min-width: 992px) {
    padding: 0 2em;
    height: 80px;

    &__logo {
      svg.logo {
        display: none;
      }
      svg.logo-text {
        display: inline;
      }
    }

    &__links a {
      padding-top: 1em;

      &:hover,
      &.active {
        &::before {
          bottom: -12px;
        }
      }
    }

    &__menu-mobile {
      display: none;
    }
  }
}
</style>
