<template>
  <div class="layout-custom">
    <slot />
    <BaseFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout-custom {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
