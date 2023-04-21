<template>
  <div class="auth">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-lg-5">
          <div class="auth--form">
            <v-form
              @submit="onSubmit"
              name="change-password"
              v-slot="{ isSubmitting, errors }"
              v-e2e
            >
              <legend class="auth--title">
                {{ $t('auth.changePassword') }}
              </legend>
              <legend class="auth--title__subtitle">
                {{ $t('auth.welcomeBackSub') }}
              </legend>

              <div class="mb-3">
                <label for="password" class="form-label">
                  {{ $t('auth.password') }}
                </label>
                <div
                  class="input-group"
                  :class="{ 'has-error': errors.password }"
                >
                  <v-field
                    :type="isShowPassword ? 'text' : 'password'"
                    name="password"
                    :placeholder="$t('auth.passwordPlaceholder')"
                    class="form-control"
                    id="password"
                    rules="required|min:8"
                    v-e2e
                  />
                  <span class="input-group-text">
                    <core-svg
                      :src="require('@/assets/icons/login-key.svg')"
                      :title="$t('auth.login')"
                      class="--no-stroke"
                    />
                  </span>
                  <span
                    class="input-group-text --icon-2"
                    v-on:click="isShowPassword = !isShowPassword"
                    type="button"
                  >
                    <core-svg
                      v-if="isShowPassword"
                      :title="$t('auth.openPassword')"
                      :src="require('@/assets/icons/eye-slash.svg')"
                      class="--no-stroke"
                    />
                    <core-svg
                      v-else
                      :src="require('@/assets/icons/eye.svg')"
                      :title="$t('auth.hidePassword')"
                      class="--no-stroke"
                    />
                  </span>
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmation" class="form-label">
                  {{ $t('auth.confirmationPassword') }}
                </label>
                <div
                  class="input-group"
                  :class="{ 'has-error': errors.confirmation }"
                >
                  <v-field
                    :type="isShowPassword ? 'text' : 'password'"
                    name="confirmation"
                    :placeholder="$t('auth.passwordPlaceholder')"
                    class="form-control"
                    id="confirmation"
                    rules="required|confirmed:@password"
                    v-e2e
                  />
                  <span class="input-group-text">
                    <core-svg
                      :src="require('@/assets/icons/login-key.svg')"
                      :title="$t('auth.login')"
                      class="--no-stroke"
                    />
                  </span>
                  <span
                    class="input-group-text --icon-2"
                    v-on:click="isShowPassword = !isShowPassword"
                    type="button"
                  >
                    <core-svg
                      v-if="isShowPassword"
                      :title="$t('auth.openPassword')"
                      :src="require('@/assets/icons/eye-slash.svg')"
                      class="--no-stroke"
                    />
                    <core-svg
                      v-else
                      :src="require('@/assets/icons/eye.svg')"
                      :title="$t('auth.hidePassword')"
                      class="--no-stroke"
                    />
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary btn-submit"
                :disabled="isSubmitting"
                type="submit"
                v-e2e="'change-password'"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                  v-if="isSubmitting"
                />
                {{ $t('auth.changePassword') }}
              </button>
              <p class="text-center signin-link">
                <router-link :to="{ name: 'signin' }" v-e2e="'signin'">
                  {{ $t('auth.signin') }}
                </router-link>
              </p>
            </v-form>
          </div>
        </div>
        <div class="col-12 col-lg-7">
          <div class="auth--bg">
            <img src="../../../assets/images/auth-bg.png" alt="bg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Form, Field } from 'vee-validate';

import useApiFormatters from '@/modules/core/composables/api-formatters';
import useToastr from '@/modules/core/composables/toastr';

import { changePasswordRequest } from '../services';

export default {
  components: {
    'v-form': Form,
    'v-field': Field,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const i18n = useI18n();
    const { toastr } = useToastr();
    const { errorFormatter } = useApiFormatters();

    const isShowPassword = ref(false);

    const onSubmit = async (values, { setErrors }) => {
      try {
        await changePasswordRequest(values, route.query);
        router.push({ name: 'signin' });
        toastr.success(i18n.t('auth.changePasswordSuccess'));
      } catch (err) {
        const { message, errors } = errorFormatter(err);

        if (Object.keys(errors).length) {
          setErrors(errors);
        } else {
          toastr.error(message);
        }
      }
    };

    return {
      isShowPassword,
      onSubmit,
    };
  },
};
</script>

<style scoped lang="scss">
@mixin font1 {
  font-size: 12px;
  line-height: 18px;
}
@mixin font2 {
  font-size: 14px;
  line-height: 22px;
}

.auth {
  height: 100vh;
  & .row {
    height: 100vh;
    & > * {
      padding-left: 0;
      padding-right: 0;
    }
  }
  &--form {
    height: 100%;
    display: flex;
    form {
      min-width: 300px;
      margin: auto;
    }
    .input-group.has-error {
      .form-control,
      .input-group-text {
        border-color: $error-color !important;
      }
    }
    .form-control {
      @include font1;
      height: 38px;
      padding-left: 42px;
      padding-right: 42px;
      &:focus {
        border-color: $primary;
      }
    }
    .form-label {
      color: $base-color;
      text-transform: uppercase;
      @include font1;
    }
    .input-group-text {
      position: absolute;
      top: 1px;
      height: calc(100% - 2px);
      border: none;
      left: 2px;
      background-color: $white;
      color: $base-color;
      border-radius: 0;
      z-index: 3;
      &.--icon-2 {
        left: unset;
        right: 2px;
      }
    }
    .btn-submit {
      width: 100%;
      margin: 1em 0;
      @include font2;
    }
  }
  .signin-link a {
    color: $link-color;
    @include font1;
    &:hover {
      text-decoration: none;
    }
  }
  .text-message {
    @include font2;
  }
  &--title {
    margin-bottom: 2em;
    font-weight: 700;
    color: $base-color;
    &__subtitle {
      @include font2;
      color: rgba($color: $base-color, $alpha: 0.7);
    }
  }
  &--bg {
    img {
      width: 100%;
      height: 100vh;
    }
  }

  /** responsive */
  @media screen and (max-width: 992px) {
    &--bg {
      display: none;
    }
  }
  @media screen and (max-width: 768px) {
    &--title {
      margin-bottom: 0;
      &__subtitle {
        margin-bottom: 2em;
      }
    }
  }
  @media screen and (min-width: 768px) {
    &--form {
      height: 100vh;
      form {
        min-width: 315px;
      }
    }
    &--title {
      margin-bottom: 2em;
      &__subtitle {
        display: none;
      }
    }
  }
  @media screen and (max-width: 576px) {
    &--title {
      margin-bottom: 0;
      text-align: center;
      &__subtitle {
        margin-bottom: 2em;
        text-align: center;
      }
    }
  }
}
</style>
