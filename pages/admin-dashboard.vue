<script lang="ts" setup>
import { onMounted, ref } from "vue";

definePageMeta({
  layout: "dashboard",
});

const activeTab = ref<string>("dashboard");
const showEffects = ref<boolean>(true);
const animationComplete = ref<boolean>(false);

const toggleEffects = () => {
  showEffects.value = !showEffects.value;
};

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

onMounted(() => {
  setTimeout(() => {
    animationComplete.value = true;
  }, 1000);
});
</script>

<template>
  <div class="admin-dashboard">
    <FlyingLightsBackground
      v-if="showEffects"
      class="admin-dashboard__background"
    />

    <!-- Nagłówek administratora -->
    <AdminDashboardHeader
      :show-effects="showEffects"
      @toggle-effects="toggleEffects"
    />

    <AdminDashboardWelcome />

    <!-- Zakładki nawigacyjne -->
    <AdminDashboardTabs
      :active-tab="activeTab"
      :animation-complete="animationComplete"
      @set-active-tab="setActiveTab"
    />

    <!-- Zawartość dashboardu -->
    <transition
      name="tab-transition"
      mode="out-in"
    >
      <div
        v-if="activeTab === 'dashboard'"
        key="dashboard"
        class="admin-dashboard__section"
      >
        <AdminDashboardOverview :animation-complete="animationComplete" />
      </div>

      <!-- Panel urządzeń -->
      <div
        v-else-if="activeTab === 'devices'"
        key="devices"
        class="admin-dashboard__section"
      >
        <AdminDashboardDevices :animation-complete="animationComplete" />
      </div>

      <!-- Panel użytkowników -->
      <div
        v-else-if="activeTab === 'users'"
        key="users"
        class="admin-dashboard__section"
      >
        <AdminDashboardUsers :animation-complete="animationComplete" />
      </div>

      <!-- Panel logów -->
      <div
        v-else-if="activeTab === 'logs'"
        key="logs"
        class="admin-dashboard__section"
      >
        <AdminDashboardLogs :animation-complete="animationComplete" />
      </div>

      <!-- Panel ustawień -->
      <div
        v-else-if="activeTab === 'settings'"
        key="settings"
        class="admin-dashboard__section"
      >
        <AdminDashboardSettings :animation-complete="animationComplete" />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/light_effects" as *;

.admin-dashboard {
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

  &__section {
    margin-bottom: 2rem;
  }
}

// Tab transition animations
.tab-transition-enter-active,
.tab-transition-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-transition-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.tab-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
