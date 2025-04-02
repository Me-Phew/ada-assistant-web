<script lang="ts" setup>
import { onMounted, ref } from "vue";

const titleRef = ref(null);
const subtitleRef = ref(null);
const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 200);
});
</script>

<template>
  <div class="dashboard-welcome">
    <div class="dashboard-welcome__content">
      <h1
        ref="titleRef"
        class="dashboard-welcome__title"
        :class="{ 'dashboard-welcome__title--loaded': isLoaded }"
      >
        {{ $t("components.dashboardWelcome.title") }}
      </h1>
      <p
        ref="subtitleRef"
        class="dashboard-welcome__subtitle"
        :class="{ 'dashboard-welcome__subtitle--loaded': isLoaded }"
      >
        {{ $t("components.dashboardWelcome.subtitle") }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/light_effects" as *;

.dashboard-welcome {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3.5rem;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
  padding-top: 3rem;

  @include mobile {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2.5rem;
    margin-top: 1rem;
    padding-top: 2rem;
  }

  &__content {
    animation: slideInFromLeft 0.8s ease-out forwards;
    position: relative;
    z-index: 2;
  }

  &__title {
    font-size: 3.8rem;
    font-weight: 700;
    margin: 0;
    padding: 0;
    color: $color_text_primary;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    letter-spacing: -0.02em;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;

    &--loaded {
      opacity: 1;
      transform: translateY(0);
    }

    :root.light-theme & {
      background: linear-gradient(to right, $color_text_primary 0%, rgba(0, 114, 245, 0.8) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    :root.dark-theme & {
      background: linear-gradient(to right, $color_text_primary 0%, rgba(0, 201, 114, 0.8) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @include mobile {
      font-size: 2.8rem;
    }
  }

  &__subtitle {
    font-size: 1.8rem;
    color: $color_text_secondary;
    margin: 1rem 0 0;
    max-width: 80%;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.7s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    letter-spacing: -0.01em;
    line-height: 1.45;
    position: relative;

    &--loaded {
      opacity: 1;
      transform: translateY(0);
    }

    :root.light-theme & {
      text-shadow: 0 0 1px rgba(0, 0, 0, 0.05);
      color: rgba($color_text_secondary, 0.95);
    }

    :root.dark-theme & {
      text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
      color: rgba($color_text_secondary, 0.9);
    }

    @include mobile {
      font-size: 1.6rem;
      max-width: 100%;
      margin-top: 0.7rem;
    }

    &::after {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-left: 6px;
      vertical-align: middle;

      :root.light-theme & {
        background-color: rgba(0, 114, 245, 0.7);
      }

      :root.dark-theme & {
        background-color: rgba(0, 201, 114, 0.7);
      }
    }
  }
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
