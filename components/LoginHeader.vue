<script lang="ts" setup></script>

<template>
  <header class="login-header">
    <div class="login-header__register-prompt">
      <span class="login-header__register-text">{{ $t("pages.login.noAccount") }}</span>
      <BaseButton
        to="/register"
        size="medium"
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

  @include mobile {
    padding: 1.6rem 1.6rem;
  }

  &__register-prompt {
    display: flex;
    align-items: center;
    gap: 1.6rem;

    @include mobile {
      gap: 1rem;
    }
  }

  &__register-text {
    @include body-regular-2;
    color: $color_text_primary;
  }
}
</style>
