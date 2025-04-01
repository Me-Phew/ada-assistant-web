<script lang="ts" setup>
defineProps<{
  withHeader?: boolean;
}>();
</script>

<template>
  <div class="login-page">
    <LoginHeader v-if="withHeader" />
    <slot name="before-content"></slot>

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
  width: 100%;
  background-color: $color_background_primary;
  display: flex;
  flex-direction: column;

  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 3rem;
    width: 100%;
  }

  &__logo-wrapper {
    margin: 3rem 0;

    @media (max-width: 768px) {
      margin: 2rem 0;
    }

    @media (max-width: 480px) {
      margin: 1.5rem 0;
    }
  }

  &__logo-link {
    display: block;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);

      .login-page__logo {
        animation: logo-spin 1s ease-in-out;
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__logo {
    height: 6.4rem;
    width: 6.4rem;
    transition: transform 0.3s ease-in-out;

    @media (max-width: 768px) {
      height: 5.6rem;
      width: 5.6rem;
    }

    @media (max-width: 480px) {
      height: 4.8rem;
      width: 4.8rem;
    }
  }
}

@keyframes logo-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
</style>
