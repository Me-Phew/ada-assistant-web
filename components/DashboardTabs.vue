<script lang="ts" setup>
defineProps<{
  activeTab: string;
  animationComplete: boolean;
}>();

const emit = defineEmits<{
  (e: "set-active-tab", tab: string): void;
}>();

const tabs = [
  { id: "overview", icon: "mdi:view-dashboard-outline" },
  { id: "devices", icon: "mdi:devices" },
  { id: "interactions", icon: "mdi:history" },
  { id: "services", icon: "mdi:connection" },
  { id: "settings", icon: "mdi:cog-outline" },
  { id: "support", icon: "mdi:lifebuoy" },
];

const setActiveTab = (tabId: string) => {
  emit("set-active-tab", tabId);
};
</script>

<template>
  <div
    class="dashboard-tabs"
    :class="{ 'dashboard-tabs--loaded': animationComplete }"
  >
    <div class="dashboard-tabs__container">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        @click="setActiveTab(tab.id)"
        class="dashboard-tabs__tab"
        :class="{
          'dashboard-tabs__tab--active': activeTab === tab.id,
          [`dashboard-tabs__tab--initial-${index}`]: !animationComplete,
        }"
      >
        <Icon
          :name="tab.icon"
          class="dashboard-tabs__icon"
        />
        <span class="dashboard-tabs__text">{{ $t(`components.dashboardTabs.${tab.id}`) }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-tabs {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  &__container {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 1.5rem;
    overflow: hidden;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.03);
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.05);
    }

    @include mobile {
      width: 100%;
      overflow-x: auto;
      padding: 0.5rem;
      gap: 0.3rem;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    border-radius: 1.2rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;

    &--initial-0,
    &--initial-1,
    &--initial-2,
    &--initial-3,
    &--initial-4,
    &--initial-5 {
      opacity: 0;
      transform: translateY(10px);
    }

    @for $i from 0 through 5 {
      &--initial-#{$i} {
        transition:
          opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
          transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transition-delay: calc(0.15s + #{$i} * 0.05s);
      }
    }

    // Po załadowaniu wszystkie są widoczne
    .dashboard-tabs--loaded &--initial-0,
    .dashboard-tabs--loaded &--initial-1,
    .dashboard-tabs--loaded &--initial-2,
    .dashboard-tabs--loaded &--initial-3,
    .dashboard-tabs--loaded &--initial-4,
    .dashboard-tabs--loaded &--initial-5 {
      opacity: 1;
      transform: translateY(0);
    }

    @include mobile {
      padding: 0.8rem 1.2rem;
      gap: 0.6rem;
    }

    :root.light-theme & {
      background-color: transparent;
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 114, 245, 0.05);
        color: $color_text_primary;
      }

      &--active {
        background-color: rgba(0, 114, 245, 0.1);
        color: #0072f5;
      }
    }

    :root.dark-theme & {
      background-color: transparent;
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 201, 114, 0.05);
        color: $color_text_primary;
      }

      &--active {
        background-color: rgba(0, 201, 114, 0.1);
        color: #00c972;
      }
    }
  }

  &__icon {
    font-size: 2rem;

    @include mobile {
      font-size: 1.8rem;
    }
  }

  &__text {
    font-size: 1.5rem;

    @include mobile {
      font-size: 1.4rem;
    }
  }
}
</style>
