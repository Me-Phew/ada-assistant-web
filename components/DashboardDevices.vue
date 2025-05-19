<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  animationComplete: boolean;
}>();

interface DeviceItem {
  id: number;
  name: string;
  status: string;
  battery: string;
  icon: string;
  lastActive: string;
}

const deviceStats = ref<DeviceItem[]>([
  {
    id: 1,
    name: "ESP32",
    status: "online",
    battery: "85%",
    icon: "mdi:chip",
    lastActive: "Now",
  },
]);
</script>

<template>
  <section
    class="dashboard-devices"
    :class="{ 'dashboard-devices--loaded': animationComplete }"
  >
    <div class="dashboard-devices__header">
      <h2 class="dashboard-devices__title">
        <Icon name="mdi:devices" />
        {{ $t("components.dashboardDevices.title") }}
      </h2>
      <NuxtLink
        to="/devices"
        class="dashboard-devices__action"
      >
        {{ $t("components.dashboardDevices.manage") }}
      </NuxtLink>
    </div>

    <div class="dashboard-devices__list">
      <div
        v-for="device in deviceStats"
        :key="device.id"
        class="dashboard-devices__item"
      >
        <div class="dashboard-devices__icon">
          <Icon :name="device.icon" />
        </div>
        <div class="dashboard-devices__info">
          <div class="dashboard-devices__name">{{ device.name }}</div>
          <div class="dashboard-devices__meta">
            <span class="dashboard-devices__status">
              <span
                class="dashboard-devices__status-dot"
                :class="{ 'dashboard-devices__status-dot--offline': device.status === 'offline' }"
              ></span>
              {{ device.status }}
            </span>
            <span class="dashboard-devices__battery">{{ device.battery }}</span>
          </div>
        </div>
        <div class="dashboard-devices__last-active">{{ device.lastActive }}</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/card_styles" as *;

.dashboard-devices {
  border-radius: $dark_card_border_radius;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  :root.light-theme & {
    background-color: $light_card_bg;
    box-shadow: $light_card_shadow;
    border: $light_card_border;
  }

  :root.dark-theme & {
    background-color: $dark_card_bg;
    box-shadow: $dark_card_shadow, $dark_card_glow;
    border: $dark_card_border;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid;

    :root.light-theme & {
      border-color: $light_header_border;
    }

    :root.dark-theme & {
      border-color: $dark_header_border;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
    color: $color_text_primary;
  }

  &__action {
    padding: 0.6rem 1.2rem;
    border-radius: 1.6rem;
    font-size: 1.4rem;
    text-decoration: none;
    transition: all 0.2s ease;

    :root.light-theme & {
      color: #0072f5;
      background-color: rgba(0, 114, 245, 0.1);

      &:hover {
        background-color: rgba(0, 114, 245, 0.2);
      }
    }

    :root.dark-theme & {
      color: #00c972;
      background-color: rgba(0, 201, 114, 0.1);

      &:hover {
        background-color: rgba(0, 201, 114, 0.2);
      }
    }
  }

  &__list {
    max-height: 260px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;

      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.1);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__item {
    padding: 1.2rem 2rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid;
    height: 65px; /* Fixed height */
    box-sizing: border-box;

    &:last-child {
      border-bottom: none;
    }

    :root.light-theme & {
      border-color: $light_header_border;

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    :root.dark-theme & {
      border-color: $dark_header_border;

      &:hover {
        background-color: rgba(255, 255, 255, 0.02);
      }
    }
  }

  &__icon {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    font-size: 1.8rem;
    flex-shrink: 0;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 500;
    color: $color_text_primary;
    margin-bottom: 0.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.3rem;
    color: $color_text_secondary;
  }

  &__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10b981;

    &--offline {
      background-color: #ef4444;
    }
  }

  &__battery {
    font-size: 1.3rem;
    color: $color_text_secondary;
  }

  &__last-active {
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-left: auto;
    padding-left: 1.2rem;
    white-space: nowrap;
  }
}
</style>
