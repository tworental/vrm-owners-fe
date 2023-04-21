<template>
  <core-layout>
    <template #header>
      <core-content-title
        :title="$t('core.common.settings')"
        :icon="require('@/assets/icons/settings.svg')"
      />
    </template>
    <template #default>
      <account-details-mobile />
      <account-change-password-mobile />
    </template>
  </core-layout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import AccountDetailsMobile from '../components/AccountDetailsMobile.vue';
import AccountChangePasswordMobile from '../components/AccountChangePasswordMobile.vue';

export default {
  components: {
    AccountDetailsMobile,
    AccountChangePasswordMobile,
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
