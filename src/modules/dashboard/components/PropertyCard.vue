<template>
  <div
    class="property"
    :class="{ '--clickable': $route.name === 'dashboard' }"
    v-on:click="gotoDetail"
  >
    <div class="row">
      <div class="col-12 col-md-5 col-lg-6">
        <div class="property__info">
          <core-avatar
            :src="property.photo || require('@/assets/images/house.png')"
            borderColor="#2E3192"
            :size="70"
          />
          <div class="property__texts">
            <div class="property__texts--name">{{ property.name }}</div>
            <div class="property__texts--address">{{ property.address }}</div>
            <div class="property__texts--bedroom">
              <core-svg
                :src="require('@/assets/icons/hotel-bedroom.svg')"
                title="bedroom"
                class="--no-stroke"
              />
              <span>{{ property.room }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-7 col-lg-6">
        <div class="property__stats">
          <div class="stats">
            <div class="stats__title">
              <core-svg
                :src="require('@/assets/icons/moon.svg')"
                class="--no-stroke"
              />
              <span>{{ $t('dashboard.bookedNights') }}</span>
            </div>
            <div class="stats__value">
              <span>{{ property.bookedNights }}</span>
            </div>
          </div>
          <div class="stats --center">
            <div class="stats__title">
              <core-svg
                :src="require('@/assets/icons/market-house-rise.svg')"
                class="--no-stroke"
              />
              <span>{{ $t('dashboard.occupancy') }}</span>
            </div>
            <div class="stats__value">
              <span>{{ property.occupancy }}%</span>
            </div>
          </div>
          <div class="stats">
            <div class="stats__title">
              <core-svg :src="require('@/assets/icons/house-dollar.svg')" />
              <span>{{ $t('dashboard.averageNightlyRate') }}</span>
            </div>
            <div class="stats__value">
              <span>${{ property.avgNightlyRate }}</span>
            </div>
          </div>
          <div class="stats --menu">
            <div class="dropdown">
              <a
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <core-svg
                  :src="require('@/assets/icons/three-dot.svg')"
                  title="three-dot"
                  class="--no-stroke"
                />
              </a>
              <ul
                class="dropdown-menu shadow"
                aria-labelledby="dropdownMenuButton"
              >
                <li class="dropdown-item">Action</li>
                <li class="dropdown-item">Another action</li>
                <li class="dropdown-item">Something else here</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <property-calendar
      v-if="$route.name === 'property-detail'"
      :property="property"
    />
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';

import PropertyCalendar from './PropertyCalendar.vue';

export default {
  name: 'PropertyCard',
  components: {
    PropertyCalendar,
  },
  props: {
    property: Object,
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const gotoDetail = () => {
      if (route.name === 'dashboard') {
        router.push(`/dashboard/${props.property.id}`);
      }
    };

    return {
      gotoDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.property {
  position: relative;
  background-color: $white;
  border: 1px solid rgba($color: $base-color, $alpha: 0.1);
  padding: 1em 1.2em;
  margin-bottom: 1em;
  border-bottom: none;

  &.--clickable {
    cursor: pointer;
    border-bottom: 1px solid rgba($color: $base-color, $alpha: 0.1);

    &:hover {
      border-color: $primary;
    }
  }

  .row,
  .row > * {
    margin: 0;
    padding-left: 0;
    padding-right: 0;
  }

  &__info {
    display: flex;

    & > div {
      margin-right: 1em;
    }

    .avatar-wrapper {
      min-width: 70px;
    }
  }

  &__texts {
    &--name {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
    }
    &--address {
      font-weight: 300;
      font-size: 14px;
      line-height: 22px;
      color: rgba($color: $base-color, $alpha: 0.7);
    }
    &--bedroom {
      svg {
        margin-right: 0.5em;
      }
      span {
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }

  &__stats {
    display: flex;
    justify-content: flex-end;

    .stats {
      padding-top: 1em;

      &.--menu {
        margin-left: 2em;
        margin-top: -0.2em;

        @media (max-width: 767px) {
          position: absolute;
          right: 0.8em;
          top: 0;
          display: none;
        }

        .dropdown {
          background-color: transparent;
          align-self: center;

          &-menu {
            border-radius: 4px;
            margin-top: 0;
            padding: 0;
            border: 1px solid rgba($color: $base-color, $alpha: 0.05);

            li {
              font-size: 14px;
              padding: 1em;
              cursor: pointer;
              color: $base-color;
            }
          }
        }
      }

      &.--center {
        margin: 0 2em;
      }

      &__title {
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: rgba($color: $base-color, $alpha: 0.7);
        text-transform: uppercase;
        white-space: nowrap;
        svg {
          margin-right: 1em;
        }
      }

      &__value {
        text-align: right;
        font-size: 14px;
        line-height: 22px;
        font-weight: 400;
      }
    }
  }

  @media (max-width: 767px) {
    padding: 1em 0.8em;

    &__stats {
      justify-content: space-between;

      .stats {
        &.--center {
          margin: 0 0.8em;
        }

        &__title svg {
          display: none;
        }

        &__value {
          text-align: left;
        }
      }
    }
  }

  @media (max-width: 992px) {
    &__texts {
      &--name {
        font-size: 14px;
        line-height: 22px;
      }
      &--address {
        font-size: 12px;
        line-height: 20px;
      }
    }

    &__stats {
      .stats {
        &__title {
          font-size: 10px;
          white-space: nowrap;
        }
        &__value {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
