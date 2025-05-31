<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUrl } from "~/composables/register";

defineProps<{
  animationComplete: boolean;
}>();

const showRegisterDeviceModal = ref<boolean>(false);
const showDeviceDetailsModal = ref<boolean>(false);

const isLoadingDevices = ref<boolean>(false);
const isAddingDevice = ref<boolean>(false);

const selectedDevice = ref<any>(null);

const newDevice = ref({
  name: "",
  model: "ESP32",
  factoryFirmwareVersion: "",
  currentFirmwareVersion: "",
  userId: "",
  boardRevision: "1.0",
});

const devices = ref<any[]>([]);
const firmwareVersions = ref<any[]>([]);
const users = ref<any[]>([]);

const fetchDevices = async () => {
  isLoadingDevices.value = true;
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    console.log("Fetching devices from:", baseURL + "/admin/devices");

    try {
      const response = await $fetch("/admin/devices", {
        method: "GET",
        baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Devices API response:", response);

      if (Array.isArray(response)) {
        devices.value = response;
      } else if (response.devices) {
        devices.value = response.devices;
      } else if (response.data) {
        devices.value = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response.items) {
        devices.value = response.items;
      } else {
        devices.value = [response];
      }

      console.log("Devices after processing:", devices.value);
    } catch (fetchError) {
      console.error("Error fetching devices:", fetchError);

      if (fetchError.response) {
        try {
          const errorData = await fetchError.response.json();
          console.error("Detailed error:", errorData);
        } catch (e) {
          console.error("Error response status:", fetchError.response.status);
        }
      }

      try {
        console.log("Attempting to fetch devices with alternate endpoint...");
        const altResponse = await $fetch("/admin/devices/all", {
          method: "GET",
          baseURL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (altResponse && (Array.isArray(altResponse) || altResponse.devices)) {
          devices.value = Array.isArray(altResponse) ? altResponse : altResponse.devices;
          console.log("Fetched devices using alternate method:", devices.value);
        }
      } catch (altError) {
        console.error("Alternative device fetch failed:", altError);
        devices.value = [];
      }
    }
  } catch (error) {
    console.error("Failed to fetch devices:", error);
  } finally {
    isLoadingDevices.value = false;
  }
};

const fetchFirmware = async () => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    const response = await $fetch("/admin/firmware", {
      method: "GET",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (Array.isArray(response)) {
      firmwareVersions.value = response;
    } else if (response.firmwareVersions) {
      firmwareVersions.value = response.firmwareVersions;
    } else if (response.data) {
      firmwareVersions.value = Array.isArray(response.data) ? response.data : [response.data];
    } else {
      firmwareVersions.value = [response];
    }
  } catch (error) {
    console.error("Failed to fetch firmware versions:", error);
  }
};

const fetchUsers = async () => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    const response = await $fetch("/admin/users", {
      method: "GET",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Users API response:", response);

    if (response.users) {
      users.value = response.users;
    } else if (Array.isArray(response)) {
      users.value = response;
    } else if (response.data) {
      users.value = Array.isArray(response.data) ? response.data : [response.data];
    } else {
      users.value = [response];
    }

    console.log("Fetched users:", users.value);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

const openRegisterDeviceModal = () => {
  showRegisterDeviceModal.value = true;
  newDevice.value = {
    name: "",
    model: "ESP32",
    factoryFirmwareVersion: firmwareVersions.value.length > 0 ? firmwareVersions.value[0].id : "",
    currentFirmwareVersion: firmwareVersions.value.length > 0 ? firmwareVersions.value[0].id : "",
    userId: users.value.length > 0 ? users.value[0].id : "",
    boardRevision: "1.0",
  };
};

const closeRegisterDeviceModal = () => {
  showRegisterDeviceModal.value = false;
};

const openDeviceDetails = (device) => {
  selectedDevice.value = device;
  showDeviceDetailsModal.value = true;
};

const closeDeviceDetailsModal = () => {
  showDeviceDetailsModal.value = false;
  selectedDevice.value = null;
};

const registerDevice = async () => {
  if (isAddingDevice.value) return;

  if (!newDevice.value.factoryFirmwareVersion || !newDevice.value.currentFirmwareVersion) {
    alert("Please select firmware versions");
    return;
  }

  isAddingDevice.value = true;
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    const payload = {
      name: newDevice.value.name,
      model: newDevice.value.model,
      factoryFirmwareVersionId: newDevice.value.factoryFirmwareVersion,
      currentFirmwareVersionId: newDevice.value.currentFirmwareVersion,
      userId: newDevice.value.userId || null,
      boardRevision: newDevice.value.boardRevision,
    };

    console.log("Device payload:", payload);

    await $fetch("/admin/devices", {
      method: "POST",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    await fetchDevices();
    closeRegisterDeviceModal();
  } catch (error) {
    console.error("Failed to register device:", error);
    alert("Failed to register device. Please try again.");
  } finally {
    isAddingDevice.value = false;
  }
};

const deleteDevice = async (id) => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    await $fetch(`/admin/devices/${id}`, {
      method: "DELETE",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await fetchDevices();
  } catch (error) {
    console.error("Failed to delete device:", error);
    alert("Failed to delete device. Please try again.");
  }
};

const deviceStatusClass = (lastSeen) => {
  if (!lastSeen) return "offline";

  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) return "online";
  if (diffHours < 24) return "idle";
  return "offline";
};

const formatDate = (dateString) => {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  return date.toLocaleString();
};

const downloadDeviceDetails = () => {
  if (!selectedDevice.value) return;

  const deviceData = {
    id: selectedDevice.value.id,
    name: selectedDevice.value.name,
    model: selectedDevice.value.model,
    boardRevision: selectedDevice.value.boardRevision || "Unknown",
    serialNumber: selectedDevice.value.serialNumber || "Not assigned",
    owner: selectedDevice.value.userEmail || "Unassigned",
    status: deviceStatusClass(selectedDevice.value.lastSeen),
    factoryVersion: selectedDevice.value.factoryVersion || "Unknown",
    currentVersion: selectedDevice.value.currentVersion || "Unknown",
    lastSeen: selectedDevice.value.lastSeen ? formatDate(selectedDevice.value.lastSeen) : "Never",
    createdAt: formatDate(selectedDevice.value.createdAt),
    updatedAt: formatDate(selectedDevice.value.updatedAt),
  };

  const jsonString = JSON.stringify(deviceData, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `device-${selectedDevice.value.id.substring(0, 8)}.json`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

onMounted(async () => {
  await fetchFirmware();
  await fetchUsers();
  await fetchDevices();
});

defineExpose({
  openRegisterDeviceModal,
});
</script>

<template>
  <section
    class="admin-dashboard-devices"
    :class="{ 'admin-dashboard-devices--loaded': animationComplete }"
  >
    <div class="admin-dashboard-devices__header">
      <h2 class="admin-dashboard-devices__title">
        <Icon
          name="mdi:devices"
          class="admin-dashboard-devices__title-icon"
        />
        {{ $t("components.adminDashboardDevices.title") }}
      </h2>
      <div class="admin-dashboard-devices__actions">
        <button
          class="admin-dashboard-devices__add-button"
          @click="openRegisterDeviceModal"
        >
          <Icon
            name="mdi:plus"
            class="admin-dashboard-devices__add-icon"
          />
          {{ $t("components.adminDashboardDevices.addDevice") }}
        </button>
      </div>
    </div>

    <!-- Devices section -->
    <div class="admin-dashboard-devices__card">
      <table class="admin-dashboard-devices__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Model</th>
            <th>Board Rev</th>
            <th>Serial Number</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Factory Firmware</th>
            <th>Current Firmware</th>
            <th>Last Seen</th>
            <th class="admin-dashboard-devices__actions-header">
              {{ $t("components.adminDashboardDevices.table.actions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="isLoadingDevices"
            class="admin-dashboard-devices__loading-row"
          >
            <td
              colspan="11"
              class="admin-dashboard-devices__loading-cell"
            >
              <div class="admin-dashboard-devices__loading">
                <Icon
                  name="mdi:loading"
                  class="admin-dashboard-devices__loading-icon"
                />
                Loading devices...
              </div>
            </td>
          </tr>
          <tr
            v-else-if="devices.length === 0"
            class="admin-dashboard-devices__empty-row"
          >
            <td
              colspan="11"
              class="admin-dashboard-devices__empty-cell"
            >
              No devices found. Click "Register New Device" to add a device.
            </td>
          </tr>
          <tr
            v-for="device in devices"
            :key="device.id"
            class="admin-dashboard-devices__table-row"
          >
            <td>{{ device.id.substring(0, 8) }}...</td>
            <td>{{ device.name }}</td>
            <td>{{ device.model }}</td>
            <td>{{ device.boardRevision || "Unknown" }}</td>
            <td>{{ device.serialNumber || "N/A" }}</td>
            <td>{{ device.userEmail || "Unassigned" }}</td>
            <td>
              <span
                class="admin-dashboard-devices__status-badge"
                :class="`admin-dashboard-devices__status-badge--${deviceStatusClass(device.lastSeen)}`"
              >
                {{ deviceStatusClass(device.lastSeen) }}
              </span>
            </td>
            <td>{{ device.factoryVersion || "Unknown" }}</td>
            <td>{{ device.currentVersion || "Unknown" }}</td>
            <td>{{ formatDate(device.lastSeen) }}</td>
            <td class="admin-dashboard-devices__actions-cell">
              <div class="admin-dashboard-devices__actions">
                <button
                  class="admin-dashboard-devices__action-button"
                  @click="openDeviceDetails(device)"
                  title="View details"
                >
                  <Icon
                    name="mdi:eye"
                    class="admin-dashboard-devices__action-icon"
                  />
                </button>
                <button
                  class="admin-dashboard-devices__action-button admin-dashboard-devices__action-button--danger"
                  @click="deleteDevice(device.id)"
                  title="Delete device"
                >
                  <Icon
                    name="mdi:delete"
                    class="admin-dashboard-devices__action-icon"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Device registration modal -->
    <Teleport to="body">
      <div
        v-if="showRegisterDeviceModal"
        class="admin-dashboard-devices__modal-overlay"
        @click="closeRegisterDeviceModal"
      >
        <div
          class="admin-dashboard-devices__modal"
          @click.stop
        >
          <div class="admin-dashboard-devices__modal-header">
            <h3 class="admin-dashboard-devices__modal-title">
              {{ selectedDevice ? "Edit Device" : "Register New Device" }}
            </h3>
            <button
              class="admin-dashboard-devices__modal-close"
              @click="closeRegisterDeviceModal"
            >
              <Icon
                name="mdi:close"
                class="admin-dashboard-devices__modal-close-icon"
              />
            </button>
          </div>
          <div class="admin-dashboard-devices__modal-body">
            <form
              class="admin-dashboard-devices__form"
              @submit.prevent="registerDevice"
            >
              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Device Name</label>
                <input
                  v-model="newDevice.name"
                  type="text"
                  class="admin-dashboard-devices__form-input"
                  placeholder="Enter device name"
                  required
                />
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Model</label>
                <select
                  v-model="newDevice.model"
                  class="admin-dashboard-devices__form-select"
                  required
                >
                  <option value="ESP32">ESP32</option>
                </select>
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Board Revision</label>
                <input
                  v-model="newDevice.boardRevision"
                  type="text"
                  class="admin-dashboard-devices__form-input"
                  placeholder="e.g. 1.0"
                  required
                />
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Assign to User</label>
                <div class="admin-dashboard-devices__select-wrapper">
                  <select
                    v-model="newDevice.userId"
                    class="admin-dashboard-devices__form-select"
                  >
                    <option value="">Unassigned</option>
                    <option
                      v-for="user in users"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.email }}
                    </option>
                  </select>
                  <Icon
                    name="mdi:chevron-down"
                    class="admin-dashboard-devices__select-icon"
                  />
                </div>
                <p
                  class="admin-dashboard-devices__form-help"
                  v-if="users.length === 0"
                >
                  No users available. Please add users first.
                </p>
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Factory Firmware Version</label>
                <div class="admin-dashboard-devices__select-wrapper">
                  <select
                    v-model="newDevice.factoryFirmwareVersion"
                    class="admin-dashboard-devices__form-select"
                    required
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select firmware version
                    </option>
                    <option
                      v-for="firmware in firmwareVersions"
                      :key="firmware.id"
                      :value="firmware.id"
                    >
                      {{ firmware.version }} ({{ firmware.codename }})
                    </option>
                  </select>
                  <Icon
                    name="mdi:chevron-down"
                    class="admin-dashboard-devices__select-icon"
                  />
                </div>
                <p
                  v-if="firmwareVersions.length === 0"
                  class="admin-dashboard-devices__form-help"
                >
                  No firmware versions available. Please add firmware first.
                </p>
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Current Firmware Version</label>
                <div class="admin-dashboard-devices__select-wrapper">
                  <select
                    v-model="newDevice.currentFirmwareVersion"
                    class="admin-dashboard-devices__form-select"
                    required
                  >
                    <option
                      disabled
                      value=""
                    >
                      Select firmware version
                    </option>
                    <option
                      v-for="firmware in firmwareVersions"
                      :key="firmware.id"
                      :value="firmware.id"
                    >
                      {{ firmware.version }} ({{ firmware.codename }})
                    </option>
                  </select>
                  <Icon
                    name="mdi:chevron-down"
                    class="admin-dashboard-devices__select-icon"
                  />
                </div>
              </div>

              <div class="admin-dashboard-devices__form-actions">
                <button
                  type="button"
                  class="admin-dashboard-devices__form-button admin-dashboard-devices__form-button--secondary"
                  @click="closeRegisterDeviceModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="admin-dashboard-devices__form-button"
                  :disabled="isAddingDevice || firmwareVersions.length === 0"
                >
                  <div
                    v-if="isAddingDevice"
                    class="admin-dashboard-devices__loading"
                  >
                    <Icon
                      name="mdi:loading"
                      class="admin-dashboard-devices__loading-icon"
                    />
                    Registering...
                  </div>
                  <span v-else>
                    {{ selectedDevice ? "Update Device" : "Register Device" }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Device details modal -->
    <Teleport to="body">
      <div
        v-if="showDeviceDetailsModal && selectedDevice"
        class="admin-dashboard-devices__modal-overlay"
        @click="closeDeviceDetailsModal"
      >
        <div
          class="admin-dashboard-devices__modal"
          @click.stop
        >
          <div class="admin-dashboard-devices__modal-header">
            <h3 class="admin-dashboard-devices__modal-title">Device Details</h3>
            <button
              class="admin-dashboard-devices__modal-close"
              @click="closeDeviceDetailsModal"
            >
              <Icon
                name="mdi:close"
                class="admin-dashboard-devices__modal-close-icon"
              />
            </button>
          </div>
          <div class="admin-dashboard-devices__modal-body">
            <div class="admin-dashboard-devices__details">
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">ID:</div>
                <div class="admin-dashboard-devices__details-value">{{ selectedDevice.id }}</div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Name:</div>
                <div class="admin-dashboard-devices__details-value">{{ selectedDevice.name }}</div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Model:</div>
                <div class="admin-dashboard-devices__details-value">{{ selectedDevice.model }}</div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Owner:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ selectedDevice.user ? selectedDevice.user.email : "Unassigned" }}
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Status:</div>
                <div class="admin-dashboard-devices__details-value">
                  <span
                    class="admin-dashboard-devices__status-badge"
                    :class="`admin-dashboard-devices__status-badge--${deviceStatusClass(selectedDevice.lastSeen)}`"
                  >
                    {{ deviceStatusClass(selectedDevice.lastSeen) }}
                  </span>
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Factory Firmware:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ selectedDevice.factoryVersion || "Unknown" }}
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Current Firmware:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ selectedDevice.currentVersion || "Unknown" }}
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Last Seen:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ formatDate(selectedDevice.lastSeen) }}
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Board Revision:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ selectedDevice.boardRevision || "Unknown" }}
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Serial Number:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ selectedDevice.serialNumber || "Not assigned" }}
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Created At:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ formatDate(selectedDevice.createdAt) }}
                </div>
              </div>
              <div class="admin-dashboard-devices__details-row">
                <div class="admin-dashboard-devices__details-label">Updated At:</div>
                <div class="admin-dashboard-devices__details-value">
                  {{ formatDate(selectedDevice.updatedAt) }}
                </div>
              </div>
            </div>
            <div class="admin-dashboard-devices__form-actions">
              <button
                class="admin-dashboard-devices__form-button admin-dashboard-devices__form-button--download"
                @click="downloadDeviceDetails"
              >
                <Icon
                  name="mdi:download"
                  class="admin-dashboard-devices__button-icon"
                />
                Download JSON
              </button>
              <button
                class="admin-dashboard-devices__form-button admin-dashboard-devices__form-button--secondary"
                @click="closeDeviceDetailsModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "~/assets/styles/global/variables/card_styles" as *;

.admin-dashboard-devices {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.1s;

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;

    @include mobile {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2.2rem;
    font-weight: 600;
    margin: 0;
  }

  &__title-icon {
    font-size: 2.4rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__add-button {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem 1.8rem;
    border-radius: 2rem;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    :root.light-theme & {
      background-color: #0072f5;
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 114, 245, 0.2);
        background-color: color.adjust(#0072f5, $lightness: -5%);
      }
    }

    :root.dark-theme & {
      background-color: #00c972;
      color: #0e131b;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 201, 114, 0.2);
        background-color: color.adjust(#00c972, $lightness: -5%);
      }
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &__add-icon {
    font-size: 1.8rem;
  }

  &__card {
    border-radius: $dark_card_border_radius;
    overflow: hidden;

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
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1.4rem;
    overflow-x: auto;

    th {
      text-align: left;
      padding: 1.5rem 2rem;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 1;

      :root.light-theme & {
        background-color: $light_card_bg;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }

      :root.dark-theme & {
        background-color: $dark_card_bg;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
    }

    td {
      padding: 1.2rem 2rem;
      vertical-align: middle;

      :root.light-theme & {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }

      :root.dark-theme & {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__actions-header {
    text-align: right !important;
    width: 120px;
  }

  &__actions-cell {
    text-align: right;
  }

  &__table-row {
    transition: background-color 0.2s ease;

    &:hover {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.02);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.03);
      }
    }
  }

  &__status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.8rem;
    border-radius: 1.6rem;
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: capitalize;

    &--online {
      background-color: rgba(0, 200, 83, 0.1);
      color: #00c853;
    }

    &--offline {
      background-color: rgba(239, 83, 80, 0.1);
      color: #ef5350;
    }

    &--idle {
      background-color: rgba(255, 167, 38, 0.1);
      color: #ffa726;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
  }

  &__action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;

      &:hover {
        background-color: #0072f5;
        color: white;
      }

      &--danger {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover {
          background-color: #dc2626;
          color: white;
        }
      }
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;

      &:hover {
        background-color: #00c972;
        color: #0e131b;
      }

      &--danger {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover {
          background-color: #dc2626;
          color: white;
        }
      }
    }
  }

  &__action-icon {
    font-size: 1.8rem;
  }

  &__select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__select-icon {
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 1.8rem;

    :root.light-theme & {
      color: #5a5a5a;
    }

    :root.dark-theme & {
      color: #b3b3b3;
    }
  }

  &__modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    animation: fadeIn 0.3s ease-out;
  }

  &__modal {
    width: 100%;
    max-width: 80rem;
    border-radius: 1.6rem;
    overflow: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);

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
    font-size: 2.4rem;
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
      color: #5a5a5a;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    :root.dark-theme & {
      color: #b3b3b3;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__modal-close-icon {
    font-size: 2.4rem;
  }

  &__modal-body {
    padding: 3rem;
    overflow-y: auto;
    flex: 1;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  &__form-label {
    font-size: 1.5rem;
    font-weight: 500;
    color: $color_text_primary;
  }

  &__form-input,
  &__form-select,
  &__form-textarea {
    padding: 1.2rem;
    border-radius: 0.8rem;
    font-size: 1.5rem;
    border: 1px solid;
    width: 100%;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.2);
      background-color: white;
      color: #000000;

      &:focus {
        border-color: #0072f5;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 114, 245, 0.2);
      }
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.2);
      background-color: #080d11;
      color: #ffffff;

      &:focus {
        border-color: #00c972;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 201, 114, 0.2);
      }
    }
  }

  &__form-select {
    appearance: none;
    padding-right: 3rem;
  }

  &__form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
    margin-top: 1rem;
  }

  &__form-button {
    padding: 1.2rem 2.4rem;
    border-radius: 1rem;
    font-size: 1.6rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 12rem;

    &--secondary {
      :root.light-theme & {
        background-color: transparent;
        color: #5a5a5a;
        border: 1px solid rgba(0, 0, 0, 0.2);

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
          transform: none;
          box-shadow: none;
        }
      }

      :root.dark-theme & {
        background-color: transparent;
        color: #b3b3b3;
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
          transform: none;
          box-shadow: none;
        }
      }
    }

    &--download {
      :root.light-theme & {
        background-color: #4caf50;
        color: white;

        &:hover:not(:disabled) {
          background-color: color.adjust(#4caf50, $lightness: -5%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
        }
      }

      :root.dark-theme & {
        background-color: #388e3c;
        color: white;

        &:hover:not(:disabled) {
          background-color: color.adjust(#388e3c, $lightness: 5%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(56, 142, 60, 0.2);
        }
      }
    }

    :root.light-theme & {
      background-color: #0072f5;
      color: white;

      &:hover:not(:disabled) {
        background-color: color.adjust(#0072f5, $lightness: -5%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 114, 245, 0.2);
      }

      &:disabled {
        background-color: color.adjust(#0072f5, $lightness: 20%);
        cursor: not-allowed;
      }
    }

    :root.dark-theme & {
      background-color: #00c972;
      color: #0e131b;

      &:hover:not(:disabled) {
        background-color: color.adjust(#00c972, $lightness: -5%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 201, 114, 0.2);
      }

      &:disabled {
        background-color: color.adjust(#00c972, $lightness: -20%);
        cursor: not-allowed;
      }
    }
  }

  &__button-icon {
    margin-right: 0.8rem;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }

  &__loading-icon {
    font-size: 2rem;
    animation: spin 1s linear infinite;
  }

  &__loading-row td {
    padding: 3rem 0;
  }

  &__loading-cell,
  &__empty-cell {
    text-align: center;
    padding: 4rem 2rem !important;
    color: $color_text_secondary;
  }

  &__link {
    color: $color_primary;
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__details-row {
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    &--full {
      flex-direction: column;
      gap: 0.8rem;
    }
  }

  &__details-label {
    font-weight: 600;
    min-width: 180px;
    font-size: 1.6rem;
    color: #0072f5;

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__details-value {
    flex: 1;
    font-size: 1.6rem;
    line-height: 1.5;
    word-break: break-word;

    &--notes {
      padding: 2rem;
      border-radius: 0.8rem;
      white-space: pre-line;
      font-size: 1.5rem;
      line-height: 1.6;

      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.02);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.02);
      }
    }
  }

  &__form-help {
    font-size: 1.2rem;
    margin-top: 0.4rem;
    color: $color_text_secondary;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
