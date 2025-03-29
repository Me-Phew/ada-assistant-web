<script lang="ts" setup></script>

<template>
  <div class="login-separator">
    <span class="login-separator__line"></span>
    <span class="login-separator__text">{{ $t("common.or") }}</span>
    <span class="login-separator__line"></span>
  </div>
</template>

<style lang="scss" scoped>
.login-separator {
  display: flex;
  align-items: center;
  margin: 2.4rem 0;

  &__line {
    flex-grow: 1;
    height: 1px;
    background-color: $color_background_secondary;
  }

  &__text {
    padding: 0 1.6rem;
    color: $color_text_secondary;
    @include body-regular-3;
  }
}
</style>
