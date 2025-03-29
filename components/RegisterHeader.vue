<script lang="ts" setup></script>

<template>
  <header class="register-header">
    <div class="register-header__login-prompt">
      <span class="register-header__login-text">{{ $t("pages.register.haveAccount") }}</span>
      <BaseButton
        to="/login"
        size="medium"
        class="register-header__login-button centered-button"
      >
        {{ $t("pages.register.login") }}
      </BaseButton>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.register-header {
  padding: 2rem 3rem;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding: 1.8rem 2.4rem;
  }

  @media (max-width: 480px) {
    padding: 1.6rem;
    justify-content: center;
  }

  &__login-prompt {
    display: flex;
    align-items: center;
    gap: 1.6rem;

    @media (max-width: 480px) {
      flex-direction: row;
      gap: 1rem;
      width: auto;
      justify-content: center;
    }
  }

  &__login-text {
    @include body-regular-2;
    color: $color_text_primary;
    white-space: nowrap;
  }

  &__login-button {
    @media (max-width: 480px) {
      width: auto;
    }
  }
}

:global(.centered-button) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
}
</style>
