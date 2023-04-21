<template>
  <div
    class="toast-container position-absolute bottom-0 start-50 translate-middle-x p-3"
  >
    <div
      class="d-flex align-items-center text-white border-0 toast"
      role="alert"
      ref="toastRef"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-body" ref="toastMsgRef" />
      <button
        type="button"
        class="btn-close btn-close-white ms-auto me-2"
        data-bs-dismiss="toast"
        v-on:click="onClose"
        aria-label="Close"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap';

const TIMEOUT = 7000; // 7s

export default {
  setup() {
    const toastRef = ref(null);
    const toastMsgRef = ref(null);

    onMounted(() => {
      let toastTimeout = null;
      window.toastr = new bootstrap.Toast(toastRef.value);

      const handleTimeout = (classname) => () => {
        window.toastr.hide();
        toastRef.value.classList.remove(classname);
        toastTimeout = null;
      };

      const showToast = (msg, type) => {
        if (toastTimeout) {
          clearTimeout(toastTimeout);
        }

        if (!toastRef.value.classList.contains(type)) {
          toastRef.value.classList.add(type);
        }

        toastMsgRef.value.innerText = msg;
        toastTimeout = setTimeout(handleTimeout(type), TIMEOUT);
        window.toastr.show();
      };

      window.toastr.success = (msg) => showToast(msg, 'bg-success');
      window.toastr.info = (msg) => showToast(msg, 'bg-info');
      window.toastr.error = (msg) => showToast(msg, 'bg-danger');
      window.toastr.warning = (msg) => showToast(msg, 'bg-warning');
    });

    const onClose = () => {
      window.toastr.hide();
    };

    return {
      onClose,
      toastRef,
      toastMsgRef,
    };
  },
};
</script>
