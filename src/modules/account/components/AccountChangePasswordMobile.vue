<template>
  <div class="change-password-mb">
    <div class="accordion">
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading2">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse2"
            aria-expanded="false"
            aria-controls="collapse2"
          >
            <core-svg
              :src="require('@/assets/icons/lock.svg')"
              class="--no-stroke"
            />
            {{ $t('auth.changePassword') }}
          </button>
        </h2>
        <div
          id="collapse2"
          class="accordion-collapse collapse"
          aria-labelledby="heading2"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <v-form
              @submit="onSubmit"
              v-slot="{ errors }"
              name="change-password-mb"
              v-e2e
            >
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12">
                    <div>
                      <label for="newPassword" class="form-label">
                        {{ $t('account.shared.newPassword') }}
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
                          id="newPassword"
                          rules="required|min:8"
                          v-e2e
                        />
                      </div>
                      <div class="form-text text-danger">
                        <v-error-message>{{ errors.password }}</v-error-message>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div>
                      <label for="confirmPassword" class="form-label">
                        {{ $t('account.shared.confirmPassword') }}
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
                          class="form-control"
                          id="confirmPassword"
                          rules="required|confirmed:@password|min:8"
                          v-e2e
                        />
                      </div>
                      <div class="form-text text-danger">
                        <v-error-message>{{
                          errors.confirmation
                        }}</v-error-message>
                      </div>
                    </div>

                    <div class="change-password-mb__action">
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
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useToastr from '@/modules/core/composables/toastr';

export default {
  components: {
    VForm: Form,
    VField: Field,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();
    const { toastr } = useToastr();

    const loading = ref(false);

    const user = computed(() => store.state.account.user);

    const onSubmit = ({ password }) => {
      loading.value = true;

      return store
        .dispatch('account/updateOwner', { password })
        .then(() => toastr.success(i18n.t('account.components.changePassword.successUpdate')))
        .catch((error) => toastr.error(error.message))
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      user,
      loading,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.change-password-mb {
  padding: 0 1em;
  background-color: $white;
  border: 1px solid rgba($color: $base-color, $alpha: 0.1);
  margin: 0 -2.5em;

  .accordion {
    background-color: $white;
    color: rgba($color: $base-color, $alpha: 0.7);
    border: 1px solid rgba($color: $base-color, $alpha: 0.1);
    border-top: none;
    border-bottom: none;

    &-body {
      padding: 0 0.5em 1em;
    }

    &-item,
    &-collapse {
      border: none !important;
    }

    &-button {
      border: none !important;
      color: rgba($color: $base-color, $alpha: 0.7);

      &:focus {
        border: none;
      }

      svg.--no-stroke {
        margin-right: 0.6em;
        fill: rgba($color: $base-color, $alpha: 0.7);
        position: relative;
        left: -5px;
      }

      &:not(.collapsed) {
        color: rgba($color: $base-color, $alpha: 0.7);
        background-color: transparent;
      }
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
    justify-content: center;
    padding-bottom: 1em;
    margin-top: 1.5em;

    button {
      font-size: 12px;
      min-width: 100px;
      border-color: $success-color;
      background-color: $success-color;
    }
  }
}
</style>
