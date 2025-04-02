<script lang="ts" setup>
const props = defineProps<{
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

    <div class="login-form__field-container">
      <BaseInput
        id="email"
        :model-value="email"
        :label="$t('pages.login.emailLabel')"
        type="email"
        required
        autofocus
        @update:model-value="emit('update:email', $event)"
      />
    </div>

    <div class="login-form__field-container">
      <BaseInput
        id="password"
        :model-value="password"
        :label="$t('pages.login.passwordLabel')"
        type="password"
        required
        @update:model-value="emit('update:password', $event)"
      />
    </div>

    <div class="login-form__actions">
      <BaseCheckbox
        id="remember-me"
        :model-value="rememberMe"
        :label="$t('pages.login.rememberMe')"
        class="login-form__remember-me"
        @update:model-value="emit('update:rememberMe', $event)"
      />

      <BaseLink
        to="/forgot-password"
        size="small"
        class="login-form__forgot-password"
        >{{ $t("pages.login.forgotPassword") }}</BaseLink
      >
    </div>

    <BaseButton
      class="login-form__submit"
      type="primary"
      :disabled="isSubmitting"
    >
      <div class="login-form__submit-content">
        <span>{{ isSubmitting ? $t("pages.login.loggingIn") : $t("pages.login.login") }}</span>
        <Icon
          v-if="isSubmitting"
          name="mdi:loading"
          class="login-form__submit-loading"
        />
      </div>
    </BaseButton>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
  &__header {
    text-align: center;
    margin-bottom: 3rem;
    animation: fade-in-down 0.8s ease-out forwards;
    opacity: 0;

    @media (max-width: 480px) {
      margin-bottom: 2rem;
    }
  }

  &__title {
    font-family: "Roboto", sans-serif;
    font-size: 2.8rem;
    line-height: 1.29;
    font-weight: 700;
    margin-bottom: 0.8rem;
    letter-spacing: 0.02em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    :root.light-theme & {
      color: #000000;
    }

    :root.dark-theme & {
      color: #ffffff;
    }

    @media (max-width: 480px) {
      font-size: 2.4rem;
    }
  }

  &__subtitle {
    font-family: "Roboto", sans-serif;
    font-size: 1.6rem;
    line-height: 1.5;
    font-weight: 400;

    :root.light-theme & {
      color: #5a5a5a;
    }

    :root.dark-theme & {
      color: #b3b3b3;
    }

    margin-top: 0.8rem;
  }

  &__field-container {
    animation: fade-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;

    &:nth-child(3) {
      animation-delay: 0.1s;
    }

    &:nth-child(4) {
      animation-delay: 0.2s;
    }
  }

  &__error {
    font-family: "Roboto", sans-serif;
    font-size: 1.6rem;
    line-height: 1.5;
    font-weight: 500;
    color: #dc2626;
    margin-bottom: 1.8rem;
    padding: 1.2rem;
    background-color: rgba(220, 38, 38, 0.1);
    border-radius: 0.4rem;
    text-align: center;
    animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    animation: fade-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;
    animation-delay: 0.3s;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
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
    animation: fade-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;
    animation-delay: 0.4s;
    transition: all 0.3s ease;

    :root.light-theme & {
      background-color: #0072f5;
      color: #ffffff;

      &:hover {
        background-color: #0066df;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 114, 245, 0.3);
      }
    }

    :root.dark-theme & {
      background-color: #00c972;
      color: #0e131b;

      &:hover {
        background-color: #00d67b;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 201, 114, 0.3);
      }
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__submit-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }

  &__submit-loading {
    animation: spin 1s linear infinite;
    width: 1.8rem;
    height: 1.8rem;
  }
}

@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
