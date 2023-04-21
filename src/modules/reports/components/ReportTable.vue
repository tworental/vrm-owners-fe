<template>
  <table class="reports__table">
    <report-table-header />
    <tbody>
      <report-table-row
        v-for="item in reports"
        :key="item.id"
        :property="item"
      />
    </tbody>
  </table>
  <report-table-pagination />
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import ReportTableHeader from './ReportTableHeader.vue';
import ReportTableRow from './ReportTableRow.vue';
import ReportTablePagination from './ReportTablePagination.vue';

export default {
  components: {
    ReportTableHeader,
    ReportTableRow,
    ReportTablePagination,
  },
  setup() {
    const store = useStore();

    const reports = computed(() => store.state.reports.data);

    return {
      reports,
    };
  },
};
</script>

<style lang="scss" scoped>
.reports__table {
  width: 100%;

  tbody {
    background-color: $white;
  }
}
</style>
