<script lang="ts" setup>
import { onMounted, ref } from "vue";

definePageMeta({
  layout: "dashboard",
});

const activeTab = ref<string>("overview");
const showEffects = ref<boolean>(true);
const animationComplete = ref<boolean>(false);

const toggleEffects = () => {
  showEffects.value = !showEffects.value;
};

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

const handleSyncData = () => {
  console.log("Sync data clicked");
};

onMounted(() => {
  setTimeout(() => {
    animationComplete.value = true;
  }, 1000);
});
</script>

<template>
  <div class="dashboard">
    <FlyingLightsBackground
      v-if="showEffects"
      class="dashboard__background"
    />

    <DashboardHeader
      :show-effects="showEffects"
      @toggle-effects="toggleEffects"
    />

    <DashboardWelcome />

    <!-- Navigation Tabs -->
    <DashboardTabs
      :active-tab="activeTab"
      :animation-complete="animationComplete"
      @set-active-tab="setActiveTab"
    />

    <div class="dashboard__grid">
      <!-- Devices Section -->
      <DashboardDevices :animation-complete="animationComplete" />

      <!-- Activity Section -->
      <DashboardActivity :animation-complete="animationComplete" />

      <!-- Services Section -->
      <DashboardServices :animation-complete="animationComplete" />
    </div>

    <!-- Action Buttons -->
    <DashboardActionButtons @sync-data="handleSyncData" />
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/light_effects" as *;

.dashboard {
  position: relative;
  padding: 4rem 4rem 2.5rem;
  min-height: 100%;

  @include mobile {
    padding: 3rem 2rem 1.5rem;
  }

  &__background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.15;
    pointer-events: none;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.8rem;
    margin-bottom: 3rem;
    margin-top: 1rem;

    @include mobile {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
}
</style>
