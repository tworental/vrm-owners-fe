<template>
  <div class="change-password">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 col-lg-3">
          <div class="lock">
            <div class="lock__icon">
              <core-svg
                title="lock"
                :src="require('@/assets/icons/lock.svg')"
              />
            </div>
            <h5 class="lock__title text-center">
              {{ $t('auth.changePassword') }}
            </h5>
          </div>
        </div>
        <div class="col-md-12 col-lg-8">
          <v-form
            @submit="onSubmit"
            v-slot="{ errors }"
            name="'change-password'"
            v-e2e
          >
            <div class="row">
              <div class="col-md-12 col-lg-6">
                <div>
                  <label for="password" class="form-label">
                    {{ $t('auth.password') }}
                  </label>
                  <div
                    class="input-group"
                    :class="{ '--invalid': errors.password }"
                  >
                    <v-field
                      type="password"
                      name="password"
                      :label="$t('auth.password')"
                      :placeholder="$t('auth.password')"
                      class="form-control"
                      id="password"
                      rules="required|min:8"
                      v-e2e
                    />
                  </div>
                  <div class="form-text text-danger" :class="errors.password">
                    <v-error-message name="password" />
                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <div>
                  <label for="confirmation" class="form-label">
                    {{ $t('auth.confirmationPassword') }}
                  </label>
                  <div
                    class="input-group"
                    :class="{ '--invalid': errors.confirmation }"
                  >
                    <v-field
                      type="password"
                      name="confirmation"
                      :label="$t('account.shared.passwordConfirmation')"
                      :placeholder="$t('account.shared.passwordConfirmation')"
                      class="form-control order-2 no-bd-r no-bd-l"
                      id="confirmation"
                      rules="required|confirmed:@password"
                      v-e2e
                    />
                  </div>
                  <div class="form-text text-danger">
                    <v-error-message name="confirmation" />
                  </div>
                </div>

                <div class="change-password__action">
                  <button
                    class="btn btn-success"
                    type="submit"
                    :disabled="loading || Object.keys(errors).length > 0"
                    v-e2e="'save'"
                  >
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      v-if="loading"
                    />
                    {{ $t('auth.changePassword') }}
                  </button>
                </div>
              </div>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field, ErrorMessage } from 'vee-validate';

import useToastr from '@/modules/core/composables/toastr';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();
    const { toastr } = useToastr();

    const loading = ref(false);

    const onSubmit = ({ password }) => {
      loading.value = true;

      return store
        .dispatch('account/updateOwner', { password })
        .then(() => toastr.success(
          i18n.t('account.components.changePassword.successUpdate'),
        ))
        .catch((error) => toastr.error(error.message))
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      loading,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.change-password {
  padding: 1em;
  background-color: $white;
  border: 1px solid rgba($color: $base-color, $alpha: 0.1);

  @media (max-width: 992px) {
    padding: 1.5em 1em;
    .lock {
      margin-bottom: 2em;
    }
  }

  .lock {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba($color: $base-color, $alpha: 0.1);
      color: rgba($color: $base-color, $alpha: 0.9);
      margin: 0.5em 0;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        stroke: none;
      }
    }

    &__title {
      color: rgba($color: $base-color, $alpha: 0.9);
      font-size: 16px;
      font-weight: 400;
    }
  }

  .input-group {
    &.--invalid .form-control {
      border-color: $error-color;
    }
  }

  .form-control,
  .form-label {
    color: rgba($color: $base-color, $alpha: 0.5);
    font-size: 12px;
    line-height: 22px;
    font-weight: 400;
  }

  .form-control {
    color: $base-color;
  }

  .form-text.text-danger {
    height: 20px;
    margin-top: 0.2em;
  }

  &__action {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5em;

    button.btn {
      font-size: 12px;
      min-width: 100px;
      border-color: $success-color;
      background-color: $success-color;
    }
  }
}
</style>
