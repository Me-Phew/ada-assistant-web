<script lang="ts" setup>
const _props = defineProps<{
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  isSubmitting: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (e: "update:email" | "update:password" | "update:confirmPassword", value: string): void;
  (e: "update:acceptTerms", value: boolean): void;
  (e: "submit"): void;
}>();

const handleSubmit = () => {
  emit("submit");
};
</script>

<template>
  <form
    class="register-form"
    @submit.prevent="handleSubmit"
  >
    <div class="register-form__header">
      <h1 class="register-form__title">{{ $t("pages.register.title") }}</h1>
      <p class="register-form__subtitle">{{ $t("pages.register.subtitle") }}</p>
    </div>

    <p
      v-if="error"
      class="register-form__error"
    >
      {{ error }}
    </p>

    <BaseInput
      id="email"
      :model-value="email"
      :label="$t('pages.register.emailLabel')"
      type="email"
      required
      autofocus
      @update:model-value="emit('update:email', $event)"
    />

    <BaseInput
      id="password"
      :model-value="password"
      :label="$t('pages.register.passwordLabel')"
      type="password"
      required
      @update:model-value="emit('update:password', $event)"
    />

    <BaseInput
      id="confirm-password"
      :model-value="confirmPassword"
      :label="$t('pages.register.confirmPasswordLabel')"
      type="password"
      required
      @update:model-value="emit('update:confirmPassword', $event)"
    />

    <div class="register-form__terms">
      <BaseCheckbox
        id="terms"
        :model-value="acceptTerms"
        :label="$t('pages.register.acceptTerms')"
        class="register-form__terms-checkbox"
        @update:model-value="emit('update:acceptTerms', $event)"
      />
    </div>

    <BaseButton
      class="register-form__submit"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? $t("pages.register.registering") : $t("pages.register.register") }}
    </BaseButton>
  </form>
</template>

<style lang="scss" scoped>
.register-form {
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

  &__terms {
    margin-bottom: 2rem;
  }

  &__terms-checkbox {
    margin-bottom: 0;
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
