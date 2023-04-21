<template>
  <core-toastr />
  <template v-if="isLoggedIn">
    <router-view />
  </template>

  <template v-else>
    <router-view />
  </template>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const isLoggedIn = computed(() => store.state.auth.isLoggedIn);

    return { isLoggedIn };
  },
};
</script>
