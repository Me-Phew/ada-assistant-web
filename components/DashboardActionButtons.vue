<script lang="ts" setup>
const emit = defineEmits<{
  (e: "sync-data"): void;
}>();

const handleSyncData = () => {
  emit("sync-data");
};
</script>

<template>
  <div class="dashboard-actions">
    <button
      class="dashboard-actions__button"
      @click="handleSyncData"
    >
      <Icon name="mdi:refresh" />
      {{ $t("components.dashboardActionButtons.syncData") }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: slideInFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.6s;
  opacity: 0;
  transform: translateY(20px);

  @include mobile {
    flex-direction: column;
    gap: 1rem;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 1rem 1.8rem;
    border-radius: 2rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;

      &:hover {
        background-color: #0072f5;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 114, 245, 0.2);
      }
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;

      &:hover {
        background-color: #00c972;
        color: #0e131b;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 201, 114, 0.2);
      }
    }

    &:active {
      transform: translateY(1px);
    }

    @include mobile {
      width: 100%;
    }
  }
}

@keyframes slideInFromBottom {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
