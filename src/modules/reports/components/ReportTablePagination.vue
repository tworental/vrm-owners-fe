<template>
  <div class="reports__pagination">
    <div class="current-items">
      {{ $t('reports.table.pagination', { from: from + ' - ' + to, to: total }) }}
    </div>
    <div class="reports__pagination--btns">
      <button
        class="btn btn-prev"
        :disabled="page === 1"
        v-on:click="gotoPage(page - 1)"
      >
        <core-svg
          :src="require('@/assets/icons/arrow-button-left.svg')"
          :title="$t('reports.table.prevPage')"
        />
      </button>
      <span class="current-page">{{ page }}</span>
      <button
        class="btn btn-next"
        :disabled="total <= page * perPage"
        v-on:click="gotoPage(page + 1)"
      >
        <core-svg
          :src="require('@/assets/icons/arrow-button-right.svg')"
          :title="$t('reports.table.nextPage')"
        />
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

    const page = computed(() => store.state.reports.page);
    const perPage = computed(() => store.state.reports.perPage);
    const total = computed(() => store.state.reports.total);
    const from = computed(() => store.state.reports.from);
    const to = computed(() => store.state.reports.to);

    const gotoPage = (nextPage) => {
      store.dispatch('reports/setReports', nextPage);
    };

    return {
      page,
      perPage,
      total,
      from,
      to,
      gotoPage,
    };
  },
};
</script>

<style lang="scss" scoped>
.reports__pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 2em;
  margin-top: 1em;
  height: 30px;

  .current-items {
    font-size: 12px;
    line-height: 22px;
    color: $base-color;
    font-weight: 400;
  }

  &--btns {
    display: flex;
    align-items: center;
    border: 1px solid rgba($color: $base-color, $alpha: 0.1);
    margin-left: 0.5em;
    padding: 0.2em 0.5em;

    .current-page {
      padding: 0 2em;
      margin: 0 1.2em;
      font-size: 12px;
      line-height: 22px;
      color: $base-color;
      font-weight: 400;
      border-left: 1px solid rgba($color: $base-color, $alpha: 0.1);
      border-right: 1px solid rgba($color: $base-color, $alpha: 0.1);
    }

    .btn {
      padding: 0;

      &:disabled {
        opacity: 0.2;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
