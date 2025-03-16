<template>
  <div class="app">
    <NuxtLayout name="default">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

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
