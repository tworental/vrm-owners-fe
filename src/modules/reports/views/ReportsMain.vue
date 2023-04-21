<template>
  <core-layout>
    <template #header>
      <core-content-title
        :title="$t('core.menu.reports')"
        :icon="require('@/assets/icons/reports.svg')"
      />
    </template>
    <template #default>
      <div class="reports">
        <report-table />
      </div>
    </template>
  </core-layout>
</template>

<script>
import ReportTable from '../components/ReportTable.vue';

export default {
  components: {
    ReportTable,
  },
};
</script>

<style lang="scss" scoped>
.reports {
  margin: 0 -2em;
}
</style>
