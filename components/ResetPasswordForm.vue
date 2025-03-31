<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
  error: string;
  isSuccess: boolean;
}>();

const emit = defineEmits<{
  (e: "update:password" | "update:confirmPassword", value: string): void;
  (e: "submit"): void;
}>();

const localErrors = ref({
  password: "",
  confirmPassword: "",
});

const wasFormSubmitted = ref(false);

const passwordsMatch = computed(() => {
  return props.password === props.confirmPassword;
});

watch(
  () => props.password,
  () => {
    if (wasFormSubmitted.value) {
      if (props.confirmPassword && !passwordsMatch.value) {
        localErrors.value.password = t("pages.resetPassword.errors.passwordsNotMatch");
        localErrors.value.confirmPassword = t("pages.resetPassword.errors.passwordsNotMatch");
      } else {
        localErrors.value.password = "";
        localErrors.value.confirmPassword = "";
      }
    }
  },
);

watch(
  () => props.confirmPassword,
  () => {
    if (wasFormSubmitted.value) {
      if (props.confirmPassword && !passwordsMatch.value) {
        localErrors.value.password = t("pages.resetPassword.errors.passwordsNotMatch");
        localErrors.value.confirmPassword = t("pages.resetPassword.errors.passwordsNotMatch");
      } else {
        localErrors.value.password = "";
        localErrors.value.confirmPassword = "";
      }
    }
  },
);

const handleSubmit = () => {
  wasFormSubmitted.value = true;

  if (props.confirmPassword && !passwordsMatch.value) {
    localErrors.value.password = t("pages.resetPassword.errors.passwordsNotMatch");
    localErrors.value.confirmPassword = t("pages.resetPassword.errors.passwordsNotMatch");
    return;
  }
  emit("submit");
};
</script>

<template>
  <form
    class="reset-password-form"
    @submit.prevent="handleSubmit"
  >
    <div class="reset-password-form__header">
      <h1 class="reset-password-form__title">{{ $t("pages.resetPassword.title") }}</h1>
      <p class="reset-password-form__subtitle">{{ $t("pages.resetPassword.subtitle") }}</p>
    </div>

    <p
      v-if="error"
      class="reset-password-form__error"
    >
      {{ error }}
    </p>

    <p
      v-if="isSuccess"
      class="reset-password-form__success"
    >
      {{ $t("pages.resetPassword.successMessage") }}
    </p>

    <template v-if="!isSuccess">
      <BaseInput
        id="password"
        :model-value="password"
        :label="$t('pages.resetPassword.newPasswordLabel')"
        type="password"
        required
        autofocus
        :error="localErrors.password"
        @update:model-value="emit('update:password', $event)"
      />

      <BaseInput
        id="confirm-password"
        :model-value="confirmPassword"
        :label="$t('pages.resetPassword.confirmPasswordLabel')"
        type="password"
        required
        :error="localErrors.confirmPassword"
        @update:model-value="emit('update:confirmPassword', $event)"
      />

      <BaseButton
        class="reset-password-form__submit"
        :disabled="isSubmitting"
      >
        {{
          isSubmitting ? $t("pages.resetPassword.saving") : $t("pages.resetPassword.savePassword")
        }}
      </BaseButton>
    </template>

    <div
      v-else
      class="reset-password-form__success-actions"
    >
      <p class="reset-password-form__info-text">
        {{ $t("pages.resetPassword.passwordChangedInfo") }}
      </p>
      <BaseButton
        to="/login"
        class="reset-password-form__login"
      >
        {{ $t("pages.resetPassword.backToLogin") }}
      </BaseButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.reset-password-form {
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

  &__success-actions {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  &__info-text {
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
</style>
