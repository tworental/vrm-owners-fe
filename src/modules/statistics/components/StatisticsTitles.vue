<template>
  <div class="statistics-head">
    <div class="statistics-head__left">
      <span
        role="presentation"
        class="arrow-btn"
        v-on:click="onChangeYear(false)"
        v-e2e="'prev-year'"
      >
        <core-svg
          :src="require('@/assets/icons/previous.svg')"
          title="moon"
          class="--no-stroke"
        />
      </span>
      <span class="statistics-head__left--year">
        {{ currentYear }}
      </span>
      <span
        role="presentation"
        class="arrow-btn"
        v-on:click="onChangeYear(true)"
        v-e2e="'next-year'"
      >
        <core-svg
          :src="require('@/assets/icons/next.svg')"
          title="moon"
          class="--no-stroke"
        />
      </span>
    </div>
    <div class="statistics-head__center">
      <div
        class="block"
        :class="{ active: currentDataChart === statistics.bookedNights?.type }"
        v-on:click="onChangeDataChart(statistics.bookedNights?.type)"
      >
        <div class="block__title">
          <core-svg
            :src="require('@/assets/icons/moon.svg')"
            title="moon"
            class="--no-stroke"
          />
          <p class="title">{{ $t('statistics.bookedNights') }}</p>
        </div>
        <p class="value">{{ statistics.bookedNights?.total || 0 }}</p>
      </div>
      <div
        class="block block-center"
        :class="{ active: currentDataChart === statistics.occupancy?.type }"
        v-on:click="onChangeDataChart(statistics.occupancy?.type)"
      >
        <div class="block__title">
          <core-svg
            :src="require('@/assets/icons/market-house-rise.svg')"
            title="market-house-rise"
            class="--no-stroke"
          />
          <p class="title">{{ $t('statistics.occupancy') }}</p>
        </div>
        <p class="value">{{ statistics.occupancy?.amount || 0 }}%</p>
      </div>
      <div
        class="block"
        :class="{
          active: currentDataChart === statistics.avgNightlyRate?.type,
        }"
        v-on:click="onChangeDataChart(statistics.avgNightlyRate?.type)"
      >
        <div class="block__title">
          <core-svg
            :src="require('@/assets/icons/house-dollar.svg')"
            title="house-dollar"
            class="--no-stroke"
          />
          <p class="title">{{ $t('statistics.averageNightlyRate') }}</p>
        </div>
        <p class="value">{{ statistics.avgNightlyRate?.total || 0 }} {{ statistics.currency }}</p>
      </div>
    </div>
    <div class="statistics-head__right">
      <button type="link" class="btn btn-link" v-on:click="onDownloadCsv" v-e2e="'download-csv'">
        <core-svg
          :src="require('@/assets/icons/download.svg')"
          :title="$t('statistics.download')"
        />
        <span>{{ $t('statistics.downloadCSV') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const statistics = computed(() => store.state.statistics.data);
    const currentYear = computed(() => store.state.statistics.year);
    const currentDataChart = computed(() => store.state.statistics.currentDataChart);

    const onChangeYear = (isNextYear) => {
      const newYear = currentYear.value + (isNextYear ? 1 : -1);
      store.dispatch('statistics/setYear', newYear);
    };

    const onChangeDataChart = (dataType) => {
      store.dispatch('statistics/setDataChartType', dataType);
    };

    /*
    * Apexcharts does not have external method to export in csv
    * That's why we need to emit click event on its internal "csv download" button
    * */
    const onDownloadCsv = () => {
      const csv = document.querySelector('.apexcharts-menu-item.exportCSV');

      if (csv) {
        csv.click();
      }
    };

    return {
      statistics,
      currentYear,
      onChangeYear,
      currentDataChart,
      onChangeDataChart,
      onDownloadCsv,
    };
  },
};
</script>

<style lang="scss" scoped>
.statistics-head {
  display: flex;
  color: $base-color;
  font-size: 14px;
  justify-content: space-between;

  &__left {
    &--year {
      margin: 0 0.8em;
      position: relative;
      top: 2px;
    }

    .arrow-btn {
      cursor: pointer;
    }
  }

  &__center {
    display: flex;
    justify-content: space-between;
  }

  &__right {
    svg {
      margin-right: 6px;
    }

    .btn-link {
      font-size: 14px;
      @media (min-width: 992px) {
        margin-top: -6px;
      }
    }
  }

  .block {
    text-align: right;
    padding: 0 1em;
    cursor: pointer;

    &-center {
      margin: 0 1em;
    }

    svg {
      margin-right: 10px;
    }

    &__title {
      display: flex;
      align-items: center;
      text-transform: uppercase;
    }

    p {
      margin-bottom: 0;
      font-size: 12px;
      line-height: 24px;
      font-weight: 400;

      &.title {
        color: rgba($color: $base-color, $alpha: 0.5);
      }

      &.value {
        font-size: 14px;
        color: $base-color;
      }
    }
    &.active,
    &:hover {
      p {
        color: $primary !important;
      }
    }
  }

  @media (max-width: 767px) {
    &__center {
      width: 100%;
    }

    .block {
      text-align: left;
      padding: 0;
      font-size: 10px;

      svg {
        display: none;
      }

      p {
        font-size: 10px;
        margin-left: 0;
        font-weight: 400;

        &.value {
          font-size: 12px;
        }
      }
    }
  }

  @media (max-width: 992px) {
    justify-content: center;

    &__left {
      position: absolute;
      top: -3.7em;
      right: 1em;
    }

    &__right {
      position: absolute;
      bottom: 1.5em;
      right: 1em;
    }
  }
}
</style>
