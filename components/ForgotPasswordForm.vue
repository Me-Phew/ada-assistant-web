<script lang="ts" setup>
const _props = defineProps<{
  email: string;
  isSubmitting: boolean;
  error: string;
  isSuccess: boolean;
}>();

const emit = defineEmits<{
  (e: "update:email", value: string): void;
  (e: "submit"): void;
}>();

const handleSubmit = () => {
  emit("submit");
};
</script>

<template>
  <form
    class="forgot-password-form"
    @submit.prevent="handleSubmit"
  >
    <div class="forgot-password-form__header">
      <h1 class="forgot-password-form__title">{{ $t("pages.forgotPassword.title") }}</h1>
      <p class="forgot-password-form__subtitle">{{ $t("pages.forgotPassword.subtitle") }}</p>
    </div>

    <p
      v-if="error"
      class="forgot-password-form__error"
    >
      {{ error }}
    </p>

    <p
      v-if="isSuccess"
      class="forgot-password-form__success"
    >
      {{ $t("pages.forgotPassword.successMessage") }}
    </p>

    <template v-if="!isSuccess">
      <BaseInput
        id="email"
        :model-value="email"
        :label="$t('pages.forgotPassword.emailLabel')"
        type="email"
        required
        autofocus
        @update:model-value="emit('update:email', $event)"
      />

      <BaseButton
        class="forgot-password-form__submit"
        :disabled="isSubmitting"
      >
        {{
          isSubmitting ? $t("pages.forgotPassword.sending") : $t("pages.forgotPassword.sendLink")
        }}
      </BaseButton>

      <div class="forgot-password-form__back-wrapper">
        <BaseLink
          to="/login"
          class="forgot-password-form__back-link no-hover-bg"
        >
          &lt; {{ $t("pages.forgotPassword.backToLogin") }}
        </BaseLink>
      </div>
    </template>

    <div
      v-else
      class="forgot-password-form__success-actions"
    >
      <p class="forgot-password-form__check-email">
        {{ $t("pages.forgotPassword.checkEmail") }}
      </p>
      <BaseButton
        to="/login"
        class="forgot-password-form__login"
      >
        {{ $t("pages.forgotPassword.backToLogin") }}
      </BaseButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.forgot-password-form {
  &__header {
    text-align: center;
    margin-bottom: 2.4rem;

    @include mobile {
      margin-bottom: 2rem;
    }
  }

  &__title {
    @include h3;
    color: $color_text_primary;

    @include mobile {
      font-size: 2.4rem;
    }
  }

  &__subtitle {
    @include body-regular-2;
    color: $color_text_secondary;
    margin-top: 0.8rem;
  }

  &__error {
    @include body-medium-2;
    color: $color_error;
    margin-bottom: 1.6rem;
    padding: 1.2rem;
    background-color: rgba($color_error, 0.1);
    border-radius: $corner_radius_small;
    text-align: center;
  }

  &__success {
    @include body-medium-2;
    color: $color_success;
    margin-bottom: 1.6rem;
    padding: 1.2rem;
    background-color: rgba($color_success, 0.1);
    border-radius: $corner_radius_small;
    text-align: center;
  }

  &__submit {
    width: 100%;
    height: 5.6rem;
    min-width: 100% !important;
    max-width: 100% !important;
    margin-top: 2rem;

    @include mobile {
      height: 5rem;
    }
  }

  &__back-wrapper {
    margin-top: 1.6rem;
    display: flex;
    justify-content: center;
  }

  &__back-link {
    @include body-regular-2;
    color: $color_text_secondary;
    text-decoration: none;

    &:hover {
      color: $color_primary;
    }
  }

  &__success-actions {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  &__check-email {
    @include body-regular-2;
    color: $color_text_secondary;
    text-align: center;
  }

  &__login {
    width: 100%;
    height: 5.6rem;

    @include mobile {
      height: 5rem;
    }
  }
}

:global(.no-hover-bg:hover) {
  background-color: transparent !important;
}
</style>
