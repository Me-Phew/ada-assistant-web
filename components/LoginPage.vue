<script lang="ts" setup>
defineProps<{
  withHeader?: boolean;
}>();
</script>

<template>
  <div class="login-page">
    <div class="login-page__background">
      <FlyingLightsBackground />
    </div>

    <div class="login-page__content">
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
      <LoginPageFooter />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/light_effects" as *;

.login-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  isolation: isolate;

  :root.light-theme & {
    background-color: $light_theme_bg_color;
    background-image:
      radial-gradient(circle at 20% 35%, $light_theme_bg_gradient_1 0%, transparent 40%),
      radial-gradient(circle at 75% 44%, $light_theme_bg_gradient_2 0%, transparent 40%);
  }

  :root.dark-theme & {
    background-color: $dark_theme_bg_color;
    background-image:
      radial-gradient(circle at 20% 35%, $dark_theme_bg_gradient_1 0%, transparent 40%),
      radial-gradient(circle at 75% 44%, $dark_theme_bg_gradient_2 0%, transparent 40%);
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }

  &__content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem 3rem;
    width: 100%;
    position: relative;
  }

  &__logo-wrapper {
    margin-bottom: 2.5rem;
    transition: transform 0.5s ease;

    @media (max-width: 768px) {
      margin: 2rem 0 2.5rem;
    }

    @media (max-width: 480px) {
      margin: 1.5rem 0 2rem;
    }
  }

  &__logo-link {
    display: block;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &:hover {
      transform: scale(1.05) rotate(5deg);

      .login-page__logo {
        :root.light-theme & {
          animation: logo-pulse-light 1.5s ease-in-out infinite alternate;
        }
        :root.dark-theme & {
          animation: logo-pulse-dark 1.5s ease-in-out infinite alternate;
        }
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__logo {
    height: 7rem;
    width: 7rem;
    transition: all 0.3s ease-in-out;

    :root.light-theme & {
      filter: drop-shadow(0 0 5px rgba(0, 114, 245, 0.2));
      fill: #0e131b;
    }

    :root.dark-theme & {
      filter: drop-shadow(0 0 5px rgba(0, 201, 114, 0.2));
      fill: #ffffff;
    }

    @media (max-width: 768px) {
      height: 6rem;
      width: 6rem;
    }

    @media (max-width: 480px) {
      height: 5rem;
      width: 5rem;
    }
  }
}

@keyframes logo-pulse-light {
  0% {
    filter: drop-shadow(0 0 8px $light_theme_logo_glow_light);
  }
  100% {
    filter: drop-shadow(0 0 15px $light_theme_logo_glow_strong);
  }
}

@keyframes logo-pulse-dark {
  0% {
    filter: drop-shadow(0 0 8px $dark_theme_logo_glow_light);
  }
  100% {
    filter: drop-shadow(0 0 15px $dark_theme_logo_glow_strong);
  }
}
</style>
