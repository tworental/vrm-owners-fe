<template>
  <tr class="reports_row">
    <td>
      <span>
        {{ property.name }}
      </span>
    </td>
    <td>
      <span>{{ formatTime(property.date) }}</span>
    </td>
    <td>
      <span>{{ property.income }} {{ property.currency }}</span>
    </td>
    <td>
      <span>{{ property.notes }}</span>
    </td>
    <td class="action">
      <button class="btn btn-link" v-on:click="handleDownload(property.id)">
        <core-svg
          :src="require('@/assets/icons/download-2.svg')"
          :title="$t('reports.table.download')"
          class="--no-stroke"
        />
      </button>
    </td>
  </tr>
</template>

<script>
import moment from 'moment';
import { useStore } from 'vuex';

import { getApiUrl } from '@/utils/request';

export default {
  props: {
    property: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    const handleDownload = (id) => {
      console.log('DOWNLOAD');
      window.open(getApiUrl(`reports/${id}/download?accessToken=${store.state.auth.accessToken}`), '_target');
    };

    const formatTime = (time) => moment(time).format('MMMM YYYY');

    return {
      handleDownload,
      formatTime,
    };
  },
};
</script>

<style lang="scss" scoped>
.reports_row {
  border-bottom: 1px solid rgba($color: $base-color, $alpha: 0.1);

  td {
    padding: 1em 0;

    &:first-child {
      padding-left: 2em;
    }
    &:last-child {
      padding-right: 2em;
    }

    span {
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      color: rgba($color: $base-color, $alpha: 0.7);
    }
  }

  .action {
    text-align: right;

    svg {
      transform: scale(0.7);
    }

    .btn-link {
      margin-right: 0.25em;
      padding: 0;
    }
  }
}
</style>
