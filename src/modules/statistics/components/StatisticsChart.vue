<template>
  <div class="chart-wrap">
    <apexchart
      type="line"
      :height="150"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import VueApexCharts from 'vue3-apexcharts';

import { getEvents, getStates, numberFormatter } from '@/utils/chart';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();

    const isMobile = computed(() => store.getters['core/isMobile']);
    const statistics = computed(() => store.state.statistics.data);
    const currentDataChart = computed(() => store.state.statistics.currentDataChart);
    const series = computed(() => {
      let data = null;
      switch (currentDataChart.value) {
        case statistics.value.occupancy?.type:
          data = statistics.value.occupancy?.data;
          break;
        case statistics.value.bookedNights?.type:
          data = statistics.value.bookedNights?.data;
          break;
        case statistics.value.avgNightlyRate?.type:
          data = statistics.value.avgNightlyRate?.data;
          break;
        default:
          data = statistics.value.ownerRevenue?.data;
          break;
      }
      return [
        {
          data: data || new Array(12).fill(0),
        },
      ];
    });

    const chartOptions = ref({
      chart: {
        id: 'statistic-chart',
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: 'statistics',
            },
          },
        },
        zoom: {
          enabled: false,
        },
        events: getEvents(),
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      markers: {
        size: 4,
      },
      stroke: {
        width: 2,
      },
      colors: ['#2E3192'],
      grid: {
        row: {
          height: 64,
          opacity: 0.1,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: 12,
            colors: 'rgba(62, 63, 66, 0.8)',
            fontFamily: 'Roboto, sans-serif',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        custom: ({ dataPointIndex }) => {
          const {
            bookedNights, avgNightlyRate, occupancy, currency,
          } = statistics.value;

          return `<div class="chart-tooltip">
              <div class="chart-tooltip__block">
                <div class="title">${i18n.t('statistics.bookedNights')}</div>
                <p>${bookedNights?.data[dataPointIndex] || 0}</p>
              </div>
              <div class="chart-tooltip__block --center">
                <div class="title">${i18n.t('statistics.occupancy')}</div>
                <p>${occupancy?.data[dataPointIndex] || 0}%</p>
              </div>
              <div class="chart-tooltip__block">
                <div class="title">${i18n.t('statistics.averageNightlyRate')}</div>
                <p>${avgNightlyRate?.data[dataPointIndex] || 0} ${currency}</p>
              </div>
            </div>`;
        },
      },
      states: getStates(),
    });

    watchEffect(() => {
      // update xaxis
      if (statistics.value.labels) {
        chartOptions.value = {
          ...chartOptions.value,
          xaxis: {
            ...chartOptions.value.xaxis,
            categories: statistics.value.labels.map((i) => i18n.t(`statistics.dicts.months.${i}`)),
          },
        };
      }

      // update yaxis
      const yaxis = {
        decimalsInFloat: 0,
        labels: {
          style: {
            colors: 'rgba(62, 63, 66, 0.8)',
            fontFamily: 'Roboto, sans-serif',
          },
          formatter: (val) => numberFormatter(val),
        },
        tickAmount: statistics.value.ownerRevenue ? 6 : 1,
      };

      // show 1k
      if (!statistics.value.ownerRevenue) {
        yaxis.max = 1000;
      }

      chartOptions.value = {
        ...chartOptions.value,
        chart: {
          ...chartOptions.value.chart,
          // eslint-disable-next-line no-nested-ternary
          height: statistics.value.ownerRevenue ? (isMobile.value ? 300 : 440) : 150,
        },
        colors: [statistics.value.ownerRevenue ? '#2E3192' : '#FA4B57'],
        yaxis,
      };
    });

    return {
      isMobile,
      chartOptions,
      series,
    };
  },
};
</script>

<style lang="scss">
.chart-tooltip {
  padding: 0.5em 1em;
  border: 1px solid $primary;
  text-transform: uppercase;
  background-color: $white;

  &__block {
    .title {
      font-size: 10px;
      font-weight: 500;
      color: rgba($color: $base-color, $alpha: 0.5);
    }

    &.--center {
      margin: 0.7em 0;
    }
  }

  p {
    font-size: 14px;
    line-height: 24px;
    color: $base-color;
    font-weight: 400;
    margin-bottom: 0;
  }
}

.apexcharts-tooltip {
  border-radius: 0;
  border-width: 0;
  box-shadow: none;
  font-family: Roboto, sans-serif;

  &.apexcharts-active {
    border-width: 0;
  }
}

.apexcharts-xaxistooltip {
  display: none;
}

.apexcharts-text tspan {
  stroke: none;
}

.chart-wrap {
  .apexcharts-toolbar {
    display: none;
    pointer-events: none;
  }
}
</style>
