<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useUrl } from "~/composables/register";

defineProps<{
  animationComplete: boolean;
}>();

interface DeviceItem {
  id: string;
  name: string;
  model: string;
  lastSeen?: string;
  currentVersion?: string;
  factoryVersion?: string;
  boardRevision?: string;
  serialNumber?: string;
  createdAt?: string;
}

const devices = ref<DeviceItem[]>([]);
const isLoading = ref(true);
const hasError = ref(false);
const selectedDevice = ref<DeviceItem | null>(null);
const showDeviceDetailsModal = ref(false);

const fetchDevices = async () => {
  isLoading.value = true;
  hasError.value = false;

  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found");
      hasError.value = true;
      return;
    }

    const response = await $fetch("/devices", {
      method: "GET",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User devices response:", response);

    if (Array.isArray(response)) {
      devices.value = response;
    } else if (response.devices) {
      devices.value = response.devices;
    } else if (response.data) {
      devices.value = Array.isArray(response.data) ? response.data : [response.data];
    } else {
      devices.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch devices:", error);
    hasError.value = true;
    devices.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchDeviceDetails = async (deviceId: string) => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return null;
    }

    console.log(`Fetching details for device ${deviceId}`);

    const response = await $fetch(`/devices/${deviceId}`, {
      method: "GET",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error(`Failed to fetch device details for ${deviceId}:`, error);
    return null;
  }
};

const getDeviceStatus = (lastSeen) => {
  if (!lastSeen) return "offline";

  try {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) return "online";
    if (diffHours < 24) return "idle";
    return "offline";
  } catch (e) {
    return "offline";
  }
};

const formatLastActive = (lastSeen) => {
  if (!lastSeen) return "Never";

  try {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "Now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day(s) ago`;

    return lastSeenDate.toLocaleDateString();
  } catch (e) {
    return "Unknown";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return "Invalid date";
  }
};

const displayDevices = computed(() => {
  return devices.value.slice(0, 3);
});

const getDeviceIcon = (model) => {
  const modelLower = (model || "").toLowerCase();
  if (modelLower.includes("esp32")) return "mdi:chip";
  return "mdi:devices";
};

const viewDeviceDetails = async (device) => {
  selectedDevice.value = device;

  if (!device.currentVersion || !device.factoryVersion) {
    try {
      const details = await fetchDeviceDetails(device.id);
      if (details) {
        selectedDevice.value = { ...device, ...details };
      }
    } catch (error) {
      console.error("Error fetching device details:", error);
    }
  }

  showDeviceDetailsModal.value = true;
};

const closeDeviceDetailsModal = () => {
  showDeviceDetailsModal.value = false;
  selectedDevice.value = null;
};

onMounted(() => {
  fetchDevices();
});
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
    </div>

    <div class="dashboard-devices__list">
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="dashboard-devices__loading"
      >
        <Icon
          name="mdi:loading"
          class="dashboard-devices__loading-icon"
        />
      </div>

      <!-- Error state -->
      <div
        v-else-if="hasError"
        class="dashboard-devices__empty"
      >
        <p>Could not load devices. Please try again.</p>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="devices.length === 0"
        class="dashboard-devices__empty"
      >
        <p>No devices assigned to your account.</p>
      </div>

      <!-- Device items -->
      <div
        v-else
        v-for="device in displayDevices"
        :key="device.id"
        class="dashboard-devices__item"
        @click="viewDeviceDetails(device)"
      >
        <div class="dashboard-devices__icon">
          <Icon :name="getDeviceIcon(device.model)" />
        </div>
        <div class="dashboard-devices__info">
          <div class="dashboard-devices__name">{{ device.name }}</div>
          <div class="dashboard-devices__meta">
            <span class="dashboard-devices__status">
              <span
                class="dashboard-devices__status-dot"
                :class="{
                  'dashboard-devices__status-dot--offline':
                    getDeviceStatus(device.lastSeen) === 'offline',
                }"
              ></span>
              {{ getDeviceStatus(device.lastSeen) }}
            </span>
          </div>
        </div>
        <div class="dashboard-devices__last-active">{{ formatLastActive(device.lastSeen) }}</div>
      </div>
    </div>

    <!-- Device details modal -->
    <Teleport to="body">
      <div
        v-if="showDeviceDetailsModal && selectedDevice"
        class="dashboard-devices__modal-overlay"
        @click="closeDeviceDetailsModal"
      >
        <div
          class="dashboard-devices__modal"
          @click.stop
        >
          <div class="dashboard-devices__modal-header">
            <h3 class="dashboard-devices__modal-title">
              <span
                class="dashboard-devices__status-dot dashboard-devices__status-dot--modal"
                :class="{
                  'dashboard-devices__status-dot--offline':
                    getDeviceStatus(selectedDevice.lastSeen) === 'offline',
                }"
              ></span>
              {{ selectedDevice.name }}
            </h3>
            <button
              class="dashboard-devices__modal-close"
              @click="closeDeviceDetailsModal"
            >
              <Icon
                name="mdi:close"
                class="dashboard-devices__modal-close-icon"
              />
            </button>
          </div>

          <div class="dashboard-devices__modal-body">
            <div class="dashboard-devices__device-details">
              <div class="dashboard-devices__detail-group">
                <h4 class="dashboard-devices__detail-title">Device Information</h4>

                <div class="dashboard-devices__detail-row">
                  <div class="dashboard-devices__detail-label">Model</div>
                  <div class="dashboard-devices__detail-value">{{ selectedDevice.model }}</div>
                </div>

                <div class="dashboard-devices__detail-row">
                  <div class="dashboard-devices__detail-label">Status</div>
                  <div
                    class="dashboard-devices__detail-value"
                    :class="{
                      'dashboard-devices__detail-value--online':
                        getDeviceStatus(selectedDevice.lastSeen) === 'online',
                      'dashboard-devices__detail-value--idle':
                        getDeviceStatus(selectedDevice.lastSeen) === 'idle',
                      'dashboard-devices__detail-value--offline':
                        getDeviceStatus(selectedDevice.lastSeen) === 'offline',
                    }"
                  >
                    {{ getDeviceStatus(selectedDevice.lastSeen) }}
                  </div>
                </div>

                <div class="dashboard-devices__detail-row">
                  <div class="dashboard-devices__detail-label">Last Seen</div>
                  <div class="dashboard-devices__detail-value">
                    {{ formatDate(selectedDevice.lastSeen) }}
                  </div>
                </div>

                <div
                  class="dashboard-devices__detail-row"
                  v-if="selectedDevice.serialNumber"
                >
                  <div class="dashboard-devices__detail-label">Serial Number</div>
                  <div class="dashboard-devices__detail-value">
                    {{ selectedDevice.serialNumber }}
                  </div>
                </div>

                <div class="dashboard-devices__detail-row">
                  <div class="dashboard-devices__detail-label">Current Firmware</div>
                  <div class="dashboard-devices__detail-value">
                    {{ selectedDevice.currentVersion || "Unknown" }}
                  </div>
                </div>

                <div class="dashboard-devices__detail-row">
                  <div class="dashboard-devices__detail-label">Factory Firmware</div>
                  <div class="dashboard-devices__detail-value">
                    {{ selectedDevice.factoryVersion || "Unknown" }}
                  </div>
                </div>

                <div
                  class="dashboard-devices__detail-row"
                  v-if="selectedDevice.boardRevision"
                >
                  <div class="dashboard-devices__detail-label">Board Revision</div>
                  <div class="dashboard-devices__detail-value">
                    {{ selectedDevice.boardRevision }}
                  </div>
                </div>

                <div class="dashboard-devices__detail-row">
                  <div class="dashboard-devices__detail-label">Created</div>
                  <div class="dashboard-devices__detail-value">
                    {{ formatDate(selectedDevice.createdAt) }}
                  </div>
                </div>

                <div class="dashboard-devices__detail-row">
                  <div class="dashboard-devices__detail-label">Device ID</div>
                  <div class="dashboard-devices__detail-value dashboard-devices__detail-value--id">
                    {{ selectedDevice.id }}
                  </div>
                </div>
              </div>
            </div>

            <div class="dashboard-devices__detail-actions">
              <button
                class="dashboard-devices__delete-button"
                @click="() => {}"
              >
                <Icon
                  name="mdi:trash-can-outline"
                  class="dashboard-devices__delete-icon"
                />
                Delete Device
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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

  &__loading,
  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 130px;
    color: $color_text_secondary;
    font-size: 1.5rem;
  }

  &__loading-icon {
    font-size: 2.4rem;
    animation: spin 1s linear infinite;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__item {
    padding: 1.2rem 2rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid;
    height: 65px;
    box-sizing: border-box;
    cursor: pointer;

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

    &--modal {
      width: 10px;
      height: 10px;
    }

    &--offline {
      background-color: #ef4444;
    }
  }

  &__last-active {
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-left: auto;
    padding-left: 1.2rem;
    white-space: nowrap;
  }

  /* Modal styles */
  &__modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out forwards;
    padding: 2rem;
  }

  &__modal {
    width: 100%;
    max-width: 60rem;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 1.5rem;
    animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    overflow: hidden;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: #080d11;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;

    :root.light-theme & {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  &__modal-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  &__modal-close {
    background: transparent;
    border: none;
    cursor: pointer;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    :root.light-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: $color_text_primary;
      }
    }

    :root.dark-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: $color_text_primary;
      }
    }
  }

  &__modal-close-icon {
    font-size: 2.4rem;
  }

  &__modal-body {
    padding: 2rem;
    overflow-y: auto;
  }

  &__device-details {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  &__detail-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__detail-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__detail-row {
    display: flex;
    align-items: center;

    @include mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  &__detail-label {
    flex: 0 0 20%;
    font-weight: 500;
    font-size: 1.5rem;
    color: $color_text_secondary;
  }

  &__detail-value {
    flex: 1;
    font-size: 1.5rem;

    &--status {
      text-transform: capitalize;
      font-weight: 500;
    }

    &--online {
      color: #10b981;
      font-weight: 500;
    }

    &--idle {
      color: #f59e0b;
      font-weight: 500;
    }

    &--offline {
      color: #ef4444;
      font-weight: 500;
    }

    &--id {
      font-family: monospace;
      padding: 0.4rem 0.8rem;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 0.4rem;

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__detail-actions {
    margin-top: 3rem;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid;
    padding-top: 2rem;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__delete-button {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem 1.6rem;
    border-radius: 0.6rem;
    font-size: 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;

    &:hover {
      background-color: rgba(239, 68, 68, 0.15);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &__delete-icon {
    font-size: 1.8rem;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
