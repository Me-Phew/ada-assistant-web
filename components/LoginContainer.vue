<script lang="ts" setup>
defineProps<{
  children?: VNode[] | string;
}>();
</script>

<template>
  <div class="login-container">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  width: 42rem;
  max-width: calc(100% - 3.2rem);
  margin: 0 auto;
  padding: 3.2rem;
  background-color: $color_background_primary;
  border: 1px solid $color_background_secondary;
  border-radius: $corner_radius_medium;
  box-shadow: 0 0.4rem 2.4rem rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 2rem 1.6rem;
    border-radius: $corner_radius_small;
  }
}
</style>
