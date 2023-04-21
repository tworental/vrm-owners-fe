<script>
import { useRoute, useRouter } from 'vue-router';

import { confirmationRequest } from '../services';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    confirmationRequest(route.query)
      .then(() => { console.log('confirmed notification message'); })
      .finally(() => router.push({ name: 'signin' }));

    return () => {};
  },
};
</script>
