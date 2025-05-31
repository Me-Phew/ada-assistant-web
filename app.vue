<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
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
  color: $color_text_primary;
  min-height: 100vh;
  overflow-x: hidden;
}

.auth-loading-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  font-size: 2rem;
  opacity: 1;
  transition: opacity 0.3s ease-out;

  :root.light-theme & {
    background-color: #f5f7fa;
    color: #333;
  }
  :root.dark-theme & {
    background-color: black;
    color: #eee;
  }
}

.auth-loading-spinner {
  font-size: 2rem;
  margin-top: 0.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
