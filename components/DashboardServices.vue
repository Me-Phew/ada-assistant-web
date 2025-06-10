<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import spotifyService from "~/services/spotifyService";

const _props = defineProps<{
  animationComplete: boolean;
}>();

const activeDropdown = ref<string | null>(null);
const isLoading = ref(false);
const spotifyConnected = ref(false);

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

const connectSpotify = () => {
  spotifyService.initiateAuth();
};

const disconnectService = async (serviceId: string) => {
  if (serviceId === "spotify") {
    try {
      isLoading.value = true;
      await spotifyService.disconnectSpotify();
      spotifyConnected.value = false;

      const service = connectedServices.value.find((s) => s.id === "spotify");
      if (service) {
        service.status = "Not Connected";
        service.lastSync = "-";
        service.connected = false;
      }

      localStorage.removeItem("spotifyConnected");

      activeDropdown.value = null;
    } catch (error) {
      console.error("Failed to disconnect Spotify:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    console.log(`Disconnect service: ${serviceId}`);
    activeDropdown.value = null;
  }
};

const refreshService = async (serviceId: string) => {
  if (serviceId === "spotify") {
    try {
      isLoading.value = true;
      await checkSpotifyStatus();
    } catch (error) {
      console.error("Failed to refresh Spotify:", error);
    } finally {
      isLoading.value = false;
    }
  }

  activeDropdown.value = null;
};

interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  status: string;
  lastSync: string;
  color: string;
  connected: boolean;
  description?: string;
  realTime?: boolean; // Add realTime flag for services that sync in real-time
}

const connectedServices = ref<ServiceItem[]>([
  {
    id: "spotify",
    name: "Spotify",
    icon: "mdi:spotify",
    status: "Checking...",
    lastSync: "Checking...",
    color: "#1DB954",
    connected: false,
    description: "Connect to Spotify to control music playback and access your playlists",
  },
  {
    id: "weather",
    name: "Weather API",
    icon: "mdi:weather-partly-cloudy",
    status: "Connected",
    lastSync: "Real-time", // Changed from "1 hour ago" to "Real-time"
    color: "#FF9800",
    connected: true,
    realTime: true, // Add flag for real-time sync
    description: "Get real-time weather information for your location",
  },
]);

const checkForRedirectFromAuth = () => {
  const cachedStatus = localStorage.getItem("spotifyConnected");
  if (cachedStatus === "true") {
    console.log("Found cached Spotify connected status");
    spotifyConnected.value = true;

    const service = connectedServices.value.find((s) => s.id === "spotify");
    if (service) {
      service.status = "Connected";
      service.lastSync = "Just now";
      service.connected = true;
    }
    return true;
  }
  return false;
};

const checkSpotifyStatus = async () => {
  try {
    isLoading.value = true;

    if (checkForRedirectFromAuth()) {
      isLoading.value = false;
      return;
    }

    console.log("Checking Spotify connection status from API");
    const spotifyStatus = await spotifyService.getConnectionStatus();
    spotifyConnected.value = spotifyStatus.authorized;

    const service = connectedServices.value.find((s) => s.id === "spotify");
    if (service) {
      service.status = spotifyConnected.value ? "Connected" : "Not Connected";
      service.lastSync = spotifyConnected.value ? "Just now" : "-";
      service.connected = spotifyConnected.value;
    }

    if (spotifyConnected.value) {
      localStorage.setItem("spotifyConnected", "true");
    } else {
      localStorage.removeItem("spotifyConnected");
    }
  } catch (error) {
    console.error("Failed to get Spotify connection status:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await checkSpotifyStatus();
});

watch(spotifyConnected, (newValue) => {
  console.log("Spotify connection status changed:", newValue);
});
</script>

<template>
  <section
    class="dashboard-services"
    :class="{ 'dashboard-services--loaded': animationComplete }"
    @click="closeDropdowns"
  >
    <div class="dashboard-services__header">
      <h2 class="dashboard-services__title">
        <Icon
          name="mdi:apps"
          class="dashboard-services__title-icon"
        />
        {{ $t("components.dashboardServices.title") }}
      </h2>
    </div>

    <div class="dashboard-services__list">
      <div
        v-for="service in connectedServices"
        :key="service.id"
        class="dashboard-services__item"
        :class="{ 'dashboard-services__item--connected': service.connected }"
      >
        <div
          class="dashboard-services__icon"
          :style="{ '--service-color': service.color }"
        >
          <Icon :name="service.icon" />
        </div>

        <div class="dashboard-services__info">
          <div class="dashboard-services__name">{{ service.name }}</div>
          <div class="dashboard-services__status">
            <span
              v-if="service.id === 'spotify' && isLoading"
              class="dashboard-services__loading"
            >
              <Icon
                name="mdi:loading"
                class="dashboard-services__loading-icon"
              />
              <span class="dashboard-services__status-text dashboard-services__status-text--loading"
                >Checking...</span
              >
            </span>
            <template v-else>
              <span
                v-if="service.connected"
                class="dashboard-services__status-dot"
              ></span>
              <span
                class="dashboard-services__status-text"
                :class="{
                  'dashboard-services__status-text--connected': service.connected,
                  'dashboard-services__status-text--disconnected': !service.connected,
                }"
                >{{ service.status }}</span
              >
            </template>
          </div>
          <div
            v-if="service.description"
            class="dashboard-services__description"
          >
            {{ service.description }}
          </div>
        </div>

        <template v-if="service.connected">
          <div
            v-if="service.realTime"
            class="dashboard-services__real-time"
          >
            <span class="dashboard-services__real-time-badge">Real-time</span>
          </div>
          <div
            v-else
            class="dashboard-services__last-sync"
          >
            {{ service.lastSync }}
          </div>
        </template>

        <div
          class="dashboard-services__actions"
          @click.stop
        >
          <button
            v-if="service.connected && !service.realTime"
            class="dashboard-services__menu-trigger"
            @click="toggleDropdown(service.id)"
          >
            <Icon name="mdi:dots-vertical" />
          </button>

          <button
            v-if="!service.connected"
            class="dashboard-services__connect-button"
            @click="service.id === 'spotify' ? connectSpotify() : null"
            :disabled="isLoading && service.id === 'spotify'"
          >
            <span v-if="isLoading && service.id === 'spotify'">
              <Icon
                name="mdi:loading"
                class="dashboard-services__loading-icon"
              />
            </span>
            <span v-else>Connect</span>
          </button>

          <div
            v-if="activeDropdown === service.id"
            class="dashboard-services__dropdown"
          >
            <button
              v-if="!service.realTime"
              class="dashboard-services__dropdown-item"
              @click="refreshService(service.id)"
            >
              <Icon
                name="mdi:refresh"
                class="dashboard-services__dropdown-icon"
              />
              Refresh
            </button>
            <button
              class="dashboard-services__dropdown-item dashboard-services__dropdown-item--danger"
              @click="disconnectService(service.id)"
            >
              <Icon
                name="mdi:link-off"
                class="dashboard-services__dropdown-icon"
              />
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
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

  &__title-icon {
    font-size: 2rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 1.2rem 2rem;
    border-bottom: 1px solid;
    transition: background-color 0.2s ease;

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
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 1.5rem;
    font-size: 1.8rem;
    background-color: var(--service-color);
    color: white;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
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

  &__status-text {
    font-weight: 600;

    &--connected {
      color: #22c55e;
    }

    &--disconnected {
      color: #ef4444;
    }

    &--loading {
      font-weight: 500;
      color: $color_text_secondary;
    }
  }

  &__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #22c55e;
  }

  &__description {
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-top: 0.4rem;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__loading-icon {
    animation: spin 1s linear infinite;
  }

  &__last-sync {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-left: 1rem;
    white-space: nowrap;
  }

  &__actions {
    margin-left: 1rem;
    position: relative;
  }

  &__connect-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    font-size: 1.3rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;

      &:hover {
        background-color: rgba(0, 114, 245, 0.2);
      }
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;

      &:hover {
        background-color: rgba(0, 201, 114, 0.2);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__menu-trigger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;

    :root.light-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    :root.dark-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    width: 14rem;
    border-radius: 0.5rem;
    z-index: 10;
    overflow: hidden;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: black;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 1px solid black;
    }
  }

  &__dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem 1rem;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;

    :root.light-theme & {
      color: $color_text_primary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    :root.dark-theme & {
      color: $color_text_primary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }

    &--danger {
      :root.light-theme & {
        color: #dc2626;
      }

      :root.dark-theme & {
        color: #ef4444;
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
    gap: 0.8rem;
    width: 100%;
    padding: 1.2rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.2s ease;
    border-top: 1px solid;

    :root.light-theme & {
      color: #0072f5;
      border-color: $light_header_border;

      &:hover {
        background-color: rgba(0, 114, 245, 0.05);
      }
    }

    :root.dark-theme & {
      color: #00c972;
      border-color: $dark_header_border;

      &:hover {
        background-color: rgba(0, 201, 114, 0.05);
      }
    }
  }

  &__add-icon {
    font-size: 1.8rem;
  }

  &__real-time {
    display: flex;
    align-items: center;
    margin-left: 1rem;
  }

  &__real-time-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.7rem;
    border-radius: 1rem;
    font-size: 1.1rem;
    font-weight: 500;
    white-space: nowrap;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
