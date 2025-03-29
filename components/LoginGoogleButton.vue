<script lang="ts" setup>
const emit = defineEmits<{
  (e: "click"): void;
}>();

const handleClick = () => {
  emit("click");
};
</script>

<template>
  <BaseButton
    type="secondary"
    class="login-google-button"
    @click="handleClick"
  >
    <div class="login-google-button__content">
      <Icon
        name="mdi:google"
        class="login-google-button__icon"
      />
      <span>Kontynuuj z Google</span>
    </div>
  </BaseButton>
</template>

<style lang="scss" scoped>
.login-google-button {
  width: 100%;
  height: 5.6rem;
  min-width: 100% !important;
  max-width: 100% !important;

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  &__icon {
    width: 2rem;
    height: 2rem;
  }
}
</style>
