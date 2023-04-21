<template>
  <thead class="reports__header">
    <tr>
      <th>
        <span>{{ $t('reports.table.name') }}</span>
        <core-svg
          :src="require('@/assets/icons/sort.svg')"
          class="--no-stroke"
        />
      </th>
      <th>
        <span>{{ $t('reports.table.period') }}</span>
        <core-svg
          :src="require('@/assets/icons/sort.svg')"
          class="--no-stroke"
        />
      </th>
      <th>
        <span>{{ $t('reports.table.income') }}</span>
        <core-svg
          :src="require('@/assets/icons/sort.svg')"
          class="--no-stroke"
        />
      </th>
      <th>
        <span>{{ $t('reports.table.note') }}</span>
        <core-svg
          :src="require('@/assets/icons/sort.svg')"
          class="--no-stroke"
        />
      </th>
      <th class="reports__header--action">
        <span>{{ $t('reports.table.action') }}</span>
      </th>
    </tr>
  </thead>
</template>

<style lang="scss" scoped>
.reports__header {
  border-bottom: 1px solid rgba($color: $base-color, $alpha: 0.1);

  th {
    &:first-child {
      padding-left: 2em;
    }
    &:last-child {
      padding-right: 2em;
    }
  }

  svg {
    margin-left: 0.5em;
  }

  span {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: rgba($color: $base-color, $alpha: 0.3);
    text-decoration: none;
  }

  &--action {
    text-align: right;
  }
}
</style>
