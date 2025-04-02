<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  animationComplete: boolean;
}>();

const activeDropdown = ref<string | null>(null);

const toggleDropdown = (id: string) => {
  if (activeDropdown.value === id) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = id;
  }
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

const deactivateService = (serviceId: string) => {
  console.log(`Deactivate service: ${serviceId}`);
  activeDropdown.value = null;
};

const refreshService = (serviceId: string) => {
  console.log(`Refresh service: ${serviceId}`);
  activeDropdown.value = null;
};

const disconnectService = (serviceId: string) => {
  console.log(`Disconnect service: ${serviceId}`);
  activeDropdown.value = null;
};

interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  status: string;
  lastSync: string;
  color: string;
}

const connectedServices = ref<ServiceItem[]>([
  {
    id: "spotify",
    name: "Spotify",
    icon: "mdi:spotify",
    status: "Connected",
    lastSync: "10 min ago",
    color: "#1DB954",
  },
  {
    id: "gcalendar",
    name: "Google Calendar",
    icon: "mdi:calendar-month",
    status: "Connected",
    lastSync: "34 min ago",
    color: "#4285F4",
  },
  {
    id: "weather",
    name: "Weather API",
    icon: "mdi:weather-partly-cloudy",
    status: "Connected",
    lastSync: "1 hour ago",
    color: "#FF9800",
  },
]);
</script>

<template>
  <section
    class="dashboard-services"
    :class="{ 'dashboard-services--loaded': animationComplete }"
    @click="closeDropdowns"
  >
    <div class="dashboard-services__header">
      <h2 class="dashboard-services__title">
        <Icon name="mdi:connection" />
        {{ $t("components.dashboardServices.title") }}
      </h2>
      <NuxtLink
        to="/connections"
        class="dashboard-services__action"
      >
        {{ $t("components.dashboardServices.manage") }}
      </NuxtLink>
    </div>

    <div class="dashboard-services__list">
      <div
        v-for="service in connectedServices"
        :key="service.id"
        class="dashboard-services__item"
        :style="{ '--service-color': service.color }"
      >
        <div class="dashboard-services__icon">
          <Icon :name="service.icon" />
        </div>
        <div class="dashboard-services__info">
          <div class="dashboard-services__name">{{ service.name }}</div>
          <div class="dashboard-services__status">
            <span class="dashboard-services__status-dot"></span>
            {{ service.status }}
          </div>
        </div>
        <div class="dashboard-services__last-sync">
          {{ service.lastSync }}
          <div class="dashboard-services__actions">
            <button
              class="dashboard-services__menu-trigger"
              @click.stop="toggleDropdown(service.id)"
            >
              <Icon name="mdi:dots-vertical" />
            </button>

            <div
              v-show="activeDropdown === service.id"
              class="dashboard-services__dropdown"
              @click.stop
            >
              <button
                class="dashboard-services__dropdown-item"
                @click="refreshService(service.id)"
              >
                <Icon
                  name="mdi:refresh"
                  class="dashboard-services__dropdown-icon"
                />
                {{ $t("components.dashboardServices.actions.refresh") }}
              </button>
              <button
                class="dashboard-services__dropdown-item"
                @click="deactivateService(service.id)"
              >
                <Icon
                  name="mdi:pause-circle"
                  class="dashboard-services__dropdown-icon"
                />
                {{ $t("components.dashboardServices.actions.deactivate") }}
              </button>
              <button
                class="dashboard-services__dropdown-item dashboard-services__dropdown-item--danger"
                @click="disconnectService(service.id)"
              >
                <Icon
                  name="mdi:link-variant-off"
                  class="dashboard-services__dropdown-icon"
                />
                {{ $t("components.dashboardServices.actions.disconnect") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="dashboard-services__add">
      <Icon name="mdi:plus" />
      {{ $t("components.dashboardServices.connect") }}
    </button>
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/card_styles" as *;

.dashboard-services {
  border-radius: $dark_card_border_radius;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.2s;
  position: relative;

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
      border-color: rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);
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
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 1.2rem 2rem;
    border-bottom: 1px solid;

    &:last-child {
      border-bottom: none;
    }

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.05);

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);

      &:hover {
        background-color: rgba(255, 255, 255, 0.02);
      }
    }
  }

  &__icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 1.5rem;
    font-size: 1.8rem;
    background-color: var(--service-color);
    color: white;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    color: $color_text_primary;
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
    background-color: #22c55e;
  }

  &__last-sync {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    color: $color_text_secondary;
  }

  &__actions {
    margin-left: 1rem;
    position: relative;
  }

  &__menu-trigger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color_text_secondary;
    font-size: 1.6rem;
    transition: all 0.2s ease;

    &:hover {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.05);
        color: $color_text_primary;
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
        color: $color_text_primary;
      }
    }
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    width: 15rem;
    padding: 0.8rem 0;
    border-radius: 0.8rem;
    z-index: 10;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      background-color: #080d11;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    text-align: left;
    padding: 1rem 1.2rem;
    font-size: 1.4rem;
    background: none;
    border: none;
    cursor: pointer;
    color: $color_text_primary;
    transition: all 0.2s ease;

    &:hover {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.05);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }

    &--danger {
      :root.light-theme & {
        color: #dc2626;

        &:hover {
          background-color: rgba(220, 38, 38, 0.05);
        }
      }

      :root.dark-theme & {
        color: #f87171;

        &:hover {
          background-color: rgba(248, 113, 113, 0.1);
        }
      }
    }
  }

  &__dropdown-icon {
    font-size: 1.6rem;
  }

  &__add {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: calc(100% - 4rem);
    margin: 1rem 2rem 1.5rem;
    padding: 1rem;
    border-radius: 0.8rem;
    font-size: 1.4rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px dashed;
    background: none;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.2);
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 114, 245, 0.05);
        border-color: #0072f5;
        color: #0072f5;
      }
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.2);
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 201, 114, 0.05);
        border-color: #00c972;
        color: #00c972;
      }
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>
