<script lang="ts" setup>
defineProps<{
  children?: VNode[] | string;
}>();
</script>

<template>
  <div class="login-container">
    <div class="login-container__glass">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  width: 44rem;
  max-width: calc(100% - 3.2rem);
  margin: 0 auto;
  position: relative;
  transform: translateZ(0);

  &__glass {
    padding: 3.6rem;
    backdrop-filter: blur(12px);
    border-radius: 18px;
    animation: container-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    transform: translateY(20px);
    opacity: 0;

    :root.light-theme & {
      background-color: rgba(255, 255, 255, 0.7);
      box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.1),
        0 2px 6px rgba(0, 0, 0, 0.05),
        inset 0 1px 1px rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }

    :root.dark-theme & {
      background-color: rgba(29, 33, 41, 0.7);
      box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.15),
        inset 0 1px 1px rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 480px) {
      padding: 2.4rem 1.8rem;
      border-radius: 14px;
    }
  }
}

@keyframes container-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
