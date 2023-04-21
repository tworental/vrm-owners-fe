<template>
  <v-form
    v-slot="{ errors }"
    @submit="onSubmit"
    class="details-form"
    v-e2e="'details'"
  >
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 col-lg-3">
          <div class="user">
            <core-avatar-uploader
              name="avatar"
              :photo-url="user?.avatar"
              v-e2e="'avatar'"
            />
            <h5 class="user__name text-center">
              {{ `${user?.firstName} ${user?.lastName}` }}
            </h5>
            <h6 class="user__email text-center">{{ user?.email }}</h6>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div>
            <label for="inputFirstName" class="form-label">
              {{ $t('account.shared.firstName') }}
            </label>
            <div class="input-group" :class="{ '--invalid': errors.firstName }">
              <v-field
                type="text"
                name="firstName"
                :label="$t('account.shared.firstName')"
                :value="user?.firstName"
                :placeholder="$t('account.shared.firstName')"
                class="form-control"
                id="inputFirstName"
                rules="required|min:2|max:191"
                v-e2e
              />
            </div>
            <div class="form-text text-danger">
              <v-error-message name="firstName">{{ errors.firstName }}</v-error-message>
            </div>
          </div>

          <div>
            <label for="inputPhoneNumber" class="form-label">
              {{ $t('account.shared.phoneNumber') }}
            </label>
            <div
              class="input-group"
              :class="{ '--invalid': errors.phoneNumber }"
            >
              <v-field
                type="phone"
                name="phoneNumber"
                :value="user?.phoneNumber"
                :label="$t('account.shared.phoneNumber')"
                :placeholder="$t('account.shared.phoneNumberPlaceholder')"
                class="form-control"
                id="inputPhoneNumber"
                rules="required|min:8"
                v-e2e
              />
            </div>
            <div class="form-text text-danger">
              <v-error-message name="phoneNumber">{{ errors.phoneNumber }}</v-error-message>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div>
            <label for="inputLastName" class="form-label">
              {{ $t('account.shared.lastName') }}
            </label>
            <div class="input-group" :class="{ '--invalid': errors.lastName }">
              <v-field
                type="text"
                name="lastName"
                :label="$t('account.shared.lastName')"
                :value="user?.lastName"
                :placeholder="$t('account.shared.lastName')"
                class="form-control"
                id="inputLastName"
                rules="required|min:2|max:191"
                v-e2e
              />
            </div>
            <div class="form-text text-danger">
              <v-error-message name="lastName">{{ errors.lastName }}</v-error-message>
            </div>
          </div>

          <div>
            <label for="inputEmail" class="form-label">
              {{ $t('account.shared.email') }}
            </label>
            <div class="input-group" :class="{ '--invalid': errors.email }">
              <v-field
                type="text"
                name="email"
                :value="user?.email"
                :label="$t('account.shared.email')"
                :placeholder="$t('account.shared.email')"
                class="form-control"
                id="inputEmail"
                rules="required|email"
                v-e2e
              />
            </div>
            <div class="form-text text-danger">
              <v-error-message name="email">{{ errors.email }}</v-error-message>
            </div>
          </div>

          <div class="details-form__action">
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
              {{ $t('core.common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </v-form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useToastr from '@/modules/core/composables/toastr';
import CoreAvatarUploader from '@/modules/core/components/CoreAvatarUploader.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreAvatarUploader,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();
    const { toastr } = useToastr();

    const loading = ref(false);

    const user = computed(() => store.state.account.user);

    const onSubmit = (values) => {
      loading.value = true;

      return store
        .dispatch('account/updateOwner', values)
        .then(() => toastr.success(i18n.t('account.components.detailsForm.successUpdate')))
        .catch((error) => toastr.error(error.message))
        .finally(() => {
          loading.value = false;
          console.log('update');
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
.details-form {
  padding: 1em;
  background-color: $white;
  border: 1px solid rgba($color: $base-color, $alpha: 0.1);

  @media (max-width: 992px) {
    padding: 1.5em 1em;
    .user {
      margin-top: 1em;
      margin-bottom: 2em;
    }
  }

  .user {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__name {
      font-size: 18px;
      line-height: 22px;
      color: rgba($color: $base-color, $alpha: 0.9);
      margin-top: 0.5em;
    }

    &__email {
      font-size: 16px;
      font-weight: 300;
      color: rgba($color: $base-color, $alpha: 0.5);
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

    button {
      font-size: 12px;
      min-width: 100px;
      border-color: $success-color;
      background-color: $success-color;
    }
  }
}
</style>
