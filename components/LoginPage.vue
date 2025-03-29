<script lang="ts" setup>
defineProps<{
  withHeader?: boolean;
}>();
</script>

<template>
  <div class="login-page">
    <LoginHeader v-if="withHeader" />

    <section class="login-page__container">
      <div class="login-page__logo-wrapper">
        <NuxtLink
          to="/"
          class="login-page__logo-link"
        >
          <BrandIcon class="login-page__logo" />
        </NuxtLink>
      </div>

      <slot />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: $color_background_primary;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
  }

  &__logo-wrapper {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  &__logo-link {
    display: block;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__logo {
    height: 6.4rem;
    width: 6.4rem;
  }
}
</style>
