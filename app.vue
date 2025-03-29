<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
});
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}

body {
  background-color: $color_background_primary;
}
</style>
