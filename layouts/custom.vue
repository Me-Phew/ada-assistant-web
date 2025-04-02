<template>
  <div class="layout-custom">
    <div class="layout-custom__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-custom {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
