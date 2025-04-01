<template>
  <header class="login-header">
    <div class="login-header__register-prompt">
      <span class="login-header__register-text">{{ $t("pages.login.noAccount") }}</span>
      <BaseButton
        to="/register"
        size="medium"
        class="login-header__register-button centered-button"
      >
        {{ $t("pages.login.register") }}
      </BaseButton>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.login-header {
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

  &__register-prompt {
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

  &__register-text {
    @include body-regular-2;
    color: $color_text_primary;
    white-space: nowrap;
  }

  &__register-button {
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
