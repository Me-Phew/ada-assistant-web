<script lang="ts" setup>
const _props = defineProps<{
  email: string;
  password: string;
  rememberMe: boolean;
  isSubmitting: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (e: "update:email" | "update:password", value: string): void;
  (e: "update:rememberMe", value: boolean): void;
  (e: "submit"): void;
}>();

const handleSubmit = () => {
  emit("submit");
};
</script>

<template>
  <form
    class="login-form"
    @submit.prevent="handleSubmit"
  >
    <div class="login-form__header">
      <h1 class="login-form__title">{{ $t("pages.login.title") }}</h1>
      <p class="login-form__subtitle">{{ $t("pages.login.subtitle") }}</p>
    </div>

    <p
      v-if="error"
      class="login-form__error"
    >
      {{ error }}
    </p>

    <BaseInput
      id="email"
      :model-value="email"
      :label="$t('pages.login.emailLabel')"
      type="email"
      required
      autofocus
      @update:model-value="emit('update:email', $event)"
    />

    <BaseInput
      id="password"
      :model-value="password"
      :label="$t('pages.login.passwordLabel')"
      type="password"
      required
      @update:model-value="emit('update:password', $event)"
    />

    <div class="login-form__actions">
      <BaseCheckbox
        id="remember"
        :model-value="rememberMe"
        :label="$t('pages.login.rememberMe')"
        class="login-form__remember-me"
        @update:model-value="emit('update:rememberMe', $event)"
      />

      <BaseLink
        to="/forgot-password"
        type="secondary"
        size="small"
        class="login-form__forgot-password"
      >
        {{ $t("pages.login.forgotPassword") }}
      </BaseLink>
    </div>

    <BaseButton
      class="login-form__submit"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? $t("pages.login.loggingIn") : $t("pages.login.login") }}
    </BaseButton>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
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

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 480px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
    }
  }

  &__remember-me {
    margin-bottom: 0;
  }

  &__forgot-password {
    white-space: nowrap;
  }

  &__submit {
    width: 100%;
    height: 5.6rem;
    min-width: 100% !important;
    max-width: 100% !important;
    margin-top: 1rem;

    @include mobile {
      height: 5rem;
    }
  }
}
</style>
