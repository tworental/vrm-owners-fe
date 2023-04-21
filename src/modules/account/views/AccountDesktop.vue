<template>
  <core-layout>
    <template #header>
      <core-content-title
        :title="$t('core.common.settings')"
        :icon="require('@/assets/icons/settings.svg')"
      />
    </template>
    <template #default>
      <account-details-desktop />
      <br />
      <account-change-password-desktop />
    </template>
  </core-layout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import AccountDetailsDesktop from '../components/AccountDetailsDesktop.vue';
import AccountChangePasswordDesktop from '../components/AccountChangePasswordDesktop.vue';

export default {
  components: {
    AccountDetailsDesktop,
    AccountChangePasswordDesktop,
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.account.user);

    return {
      user,
    };
  },
};
</script>
