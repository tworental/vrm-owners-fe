<template>
  <core-layout>
    <template #default>
      <div class="dashboard">
        <div class="dashboard__title">
          <button v-on:click="$router.back" class="btn btn-link" v-e2e="'back'">
            <core-svg
              :title="$t('dashboard.back')"
              :src="require('@/assets/icons/keyboard-arrow-left.svg')"
              :width="18"
            />
            {{ $t('dashboard.back') }}
          </button>
        </div>
        <div class="dashboard__content">
          <property-card :property="property" />
        </div>
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

    const property = computed(() => store.state.dashboard.property);

    return {
      property,
    };
  },
};
</script>

<style lang="scss">
.dashboard {
  &__title {
    .btn-link {
      margin-bottom: 1em;
      font-size: 16px;
      line-height: 22px;
      font-weight: 500;
      padding: 0;
      text-decoration: none;

      @media (min-width: 992px) {
        font-size: 18px;
        line-height: 28px;
      }

      svg {
        margin-right: 0.5em;
      }
    }
  }
}
</style>
