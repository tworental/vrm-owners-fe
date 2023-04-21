<template>
  <core-layout>
    <template #header>
      <core-content-title
        :title="$t('dashboard.properties')"
        :icon="require('@/assets/icons/home.svg')"
        class="dashboar-title"
      />
    </template>
    <template #default>
      <div class="properties">
        <property-card v-for="property in properties" :key="property.id" :property="property" />
      </div>
    </template>
  </core-layout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import PropertyCard from '../components/PropertyCard.vue';

export default {
  components: {
    PropertyCard,
  },
  setup() {
    const store = useStore();

    const properties = computed(() => store.state.dashboard.properties);

    return {
      properties,
    };
  },
};
</script>

<style lang="scss" scoped>
.properties {
  @media (max-width: 768px) {
    margin: 0 -0.5em;
  }
}

.dashboar-title {
  @media (max-width: 768px) {
    margin-left: -0.5em;
    margin-right: -0.5em;
  }
}
</style>
