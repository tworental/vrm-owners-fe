<template>
  <core-layout>
    <template #header>
      <core-content-title
        :title="$t('statistics.statistics')"
        :icon="require('@/assets/icons/statistics.svg')"
      />
    </template>
    <template #default>
      <div class="statistics">
        <StatisticsTitles />
        <StatisticsChart />
      </div>
    </template>
  </core-layout>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';

import StatisticsTitles from '../components/StatisticsTitles.vue';
import StatisticsChart from '../components/StatisticsChart.vue';

export default {
  components: {
    StatisticsTitles,
    StatisticsChart,
  },
  setup() {
    const store = useStore();

    const getStatistics = () => {
      store.dispatch('statistics/setStatistics');
    };

    onMounted(() => {
      getStatistics();
    });

    return {};
  },
};
</script>

<style lang="scss" scoped>
.statistics {
  position: relative;
  background-color: $white;
  padding: 1em;
  border: 1px solid rgba($color: $base-color, $alpha: 0.1);

  @media (max-width: 992px) {
    margin: 0 -1em;
    padding-bottom: 3em;;
  }
}
</style>
