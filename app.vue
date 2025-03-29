<template>
  <div class="app">
    <NuxtLayout name="default">
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
  transition: all 0.45s ease-in;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
