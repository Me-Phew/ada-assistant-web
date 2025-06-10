<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useUrl } from "~/composables/register";

defineProps<{
  animationComplete: boolean;
}>();

const isLoadingFirmware = ref<boolean>(false);
const isAddingFirmware = ref<boolean>(false);
const showAddFirmwareModal = ref<boolean>(false);
const showFirmwareDetailsModal = ref<boolean>(false);

const selectedFirmware = ref<any>(null);

const newFirmware = ref({
  version: "",
  codename: "",
  releaseNotes: "",
  releaseUrl: "",
});

const firmwareVersions = ref<any[]>([]);

const firmwareSearchQuery = ref("");

const filteredFirmwareVersions = computed(() => {
  if (!firmwareSearchQuery.value.trim()) {
    return firmwareVersions.value;
  }

  const query = firmwareSearchQuery.value.toLowerCase().trim();
  return firmwareVersions.value.filter(
    (firmware) =>
      firmware.version.toLowerCase().includes(query) ||
      firmware.codename.toLowerCase().includes(query) ||
      firmware.releaseNotes?.toLowerCase().includes(query) ||
      firmware.releaseUrl.toLowerCase().includes(query),
  );
});

const fetchFirmware = async () => {
  isLoadingFirmware.value = true;
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    console.log("Fetching firmware from:", baseURL + "/admin/firmware");

    const response = await $fetch("/admin/firmware", {
      method: "GET",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Firmware API response:", response);

    if (Array.isArray(response)) {
      firmwareVersions.value = response;
    } else if (response.firmwareVersions) {
      firmwareVersions.value = response.firmwareVersions;
    } else if (response.data) {
      firmwareVersions.value = Array.isArray(response.data) ? response.data : [response.data];
    } else {
      firmwareVersions.value = [response];
    }

    console.log("Firmware versions after processing:", firmwareVersions.value);
  } catch (error) {
    console.error("Failed to fetch firmware versions:", error);
    alert("Error fetching firmware data. Check console for details.");
  } finally {
    isLoadingFirmware.value = false;
  }
};

const openAddFirmwareModal = () => {
  showAddFirmwareModal.value = true;
  newFirmware.value = {
    version: "",
    codename: "",
    releaseNotes: "",
    releaseUrl: "",
  };
};

const closeAddFirmwareModal = () => {
  showAddFirmwareModal.value = false;
};

const openFirmwareDetails = (firmware) => {
  selectedFirmware.value = firmware;
  showFirmwareDetailsModal.value = true;
};

const closeFirmwareDetailsModal = () => {
  showFirmwareDetailsModal.value = false;
  selectedFirmware.value = null;
};

const addFirmware = async () => {
  if (isAddingFirmware.value) return;

  if (
    !newFirmware.value.version ||
    !newFirmware.value.codename ||
    !newFirmware.value.releaseNotes ||
    !newFirmware.value.releaseUrl
  ) {
    alert("All fields are required");
    return;
  }

  if (!newFirmware.value.releaseUrl.startsWith("http")) {
    newFirmware.value.releaseUrl = "https://" + newFirmware.value.releaseUrl;
  }

  isAddingFirmware.value = true;
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    const payload = {
      version: newFirmware.value.version.trim(),
      codename: newFirmware.value.codename.trim(),
      releaseNotes: newFirmware.value.releaseNotes.trim(),
      releaseUrl: newFirmware.value.releaseUrl.trim(),
    };

    console.log("Sending firmware payload:", payload);

    const response = await $fetch("/admin/firmware", {
      method: "POST",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    console.log("Firmware creation response:", response);
    await fetchFirmware();
    closeAddFirmwareModal();
  } catch (error) {
    console.error("Failed to add firmware:", error);

    let errorMessage = "Failed to add firmware. Please try again.";
    if (error.response) {
      try {
        const errorData = await error.response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Error: ${error.response.statusText || error.message}`;
      }
    }

    alert(errorMessage);
  } finally {
    isAddingFirmware.value = false;
  }
};

const deleteFirmware = async (id) => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    await $fetch(`/admin/firmware/${id}`, {
      method: "DELETE",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await fetchFirmware();
  } catch (error) {
    console.error("Failed to delete firmware:", error);
    alert("Failed to delete firmware. Please try again.");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(async () => {
  await fetchFirmware();
});

defineExpose({
  openAddFirmwareModal,
});
</script>

<template>
  <section
    class="admin-dashboard-firmware"
    :class="{ 'admin-dashboard-firmware--loaded': animationComplete }"
  >
    <div class="admin-dashboard-firmware__header">
      <h2 class="admin-dashboard-firmware__title">
        <Icon
          name="mdi:update"
          class="admin-dashboard-firmware__title-icon"
        />
        Firmware Management
      </h2>
      <div class="admin-dashboard-firmware__actions">
        <button
          class="admin-dashboard-firmware__add-button"
          @click="openAddFirmwareModal"
        >
          <Icon
            name="mdi:plus"
            class="admin-dashboard-firmware__add-icon"
          />
          Add Firmware
        </button>
      </div>
    </div>

    <!-- Firmware section -->
    <div class="admin-dashboard-firmware__card">
      <div class="admin-dashboard-firmware__search-wrapper">
        <div class="admin-dashboard-firmware__search">
          <Icon
            name="mdi:magnify"
            class="admin-dashboard-firmware__search-icon"
          />
          <input
            v-model="firmwareSearchQuery"
            type="text"
            class="admin-dashboard-firmware__search-input"
            placeholder="Search firmware by version, codename or release notes..."
          />
          <button
            v-if="firmwareSearchQuery"
            class="admin-dashboard-firmware__search-clear"
            @click="firmwareSearchQuery = ''"
          >
            <Icon name="mdi:close" />
          </button>
        </div>
      </div>
      <table class="admin-dashboard-firmware__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Version</th>
            <th>Codename</th>
            <th>Release URL</th>
            <th>Created At</th>
            <th class="admin-dashboard-firmware__actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="isLoadingFirmware"
            class="admin-dashboard-firmware__loading-row"
          >
            <td
              colspan="6"
              class="admin-dashboard-firmware__loading-cell"
            >
              <div class="admin-dashboard-firmware__loading">
                <Icon
                  name="mdi:loading"
                  class="admin-dashboard-firmware__loading-icon"
                />
                Loading firmware versions...
              </div>
            </td>
          </tr>
          <tr
            v-else-if="filteredFirmwareVersions.length === 0"
            class="admin-dashboard-firmware__empty-row"
          >
            <td
              colspan="6"
              class="admin-dashboard-firmware__empty-cell"
            >
              <template v-if="firmwareVersions.length === 0">
                No firmware versions found. Click "Add Firmware" to create a new version.
              </template>
              <template v-else>
                No firmware versions match your search. Try different search terms.
              </template>
            </td>
          </tr>
          <tr
            v-for="firmware in filteredFirmwareVersions"
            :key="firmware.id"
            class="admin-dashboard-firmware__table-row"
          >
            <td>{{ firmware.id.substring(0, 8) }}...</td>
            <td>{{ firmware.version }}</td>
            <td>{{ firmware.codename }}</td>
            <td>
              <a
                :href="firmware.releaseUrl"
                target="_blank"
                class="admin-dashboard-firmware__link"
              >
                {{ firmware.releaseUrl.substring(0, 30) }}...
              </a>
            </td>
            <td>{{ formatDate(firmware.createdAt) }}</td>
            <td class="admin-dashboard-firmware__actions-cell">
              <div class="admin-dashboard-firmware__actions">
                <button
                  class="admin-dashboard-firmware__action-button"
                  @click="openFirmwareDetails(firmware)"
                  title="View details"
                >
                  <Icon
                    name="mdi:eye"
                    class="admin-dashboard-firmware__action-icon"
                  />
                </button>
                <button
                  class="admin-dashboard-firmware__action-button admin-dashboard-firmware__action-button--danger"
                  @click="deleteFirmware(firmware.id)"
                  title="Delete firmware"
                >
                  <Icon
                    name="mdi:delete"
                    class="admin-dashboard-firmware__action-icon"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add firmware modal -->
    <Teleport to="body">
      <div
        v-if="showAddFirmwareModal"
        class="admin-dashboard-firmware__modal-overlay"
        @click="closeAddFirmwareModal"
      >
        <div
          class="admin-dashboard-firmware__modal"
          @click.stop
        >
          <div class="admin-dashboard-firmware__modal-header">
            <h3 class="admin-dashboard-firmware__modal-title">Add New Firmware Version</h3>
            <button
              class="admin-dashboard-firmware__modal-close"
              @click="closeAddFirmwareModal"
            >
              <Icon
                name="mdi:close"
                class="admin-dashboard-firmware__modal-close-icon"
              />
            </button>
          </div>
          <div class="admin-dashboard-firmware__modal-body">
            <form
              class="admin-dashboard-firmware__form"
              @submit.prevent="addFirmware"
            >
              <div class="admin-dashboard-firmware__form-group">
                <label class="admin-dashboard-firmware__form-label">Version</label>
                <input
                  v-model="newFirmware.version"
                  type="text"
                  class="admin-dashboard-firmware__form-input"
                  placeholder="e.g. 1.0.0"
                  required
                />
              </div>

              <div class="admin-dashboard-firmware__form-group">
                <label class="admin-dashboard-firmware__form-label">Codename</label>
                <input
                  v-model="newFirmware.codename"
                  type="text"
                  class="admin-dashboard-firmware__form-input"
                  placeholder="e.g. Horizon"
                  required
                />
              </div>

              <div class="admin-dashboard-firmware__form-group">
                <label class="admin-dashboard-firmware__form-label">Release URL</label>
                <input
                  v-model="newFirmware.releaseUrl"
                  type="url"
                  class="admin-dashboard-firmware__form-input"
                  placeholder="https://example.com/firmware/v1.0.0"
                  required
                />
              </div>

              <div class="admin-dashboard-firmware__form-group">
                <label class="admin-dashboard-firmware__form-label">Release Notes</label>
                <textarea
                  v-model="newFirmware.releaseNotes"
                  class="admin-dashboard-firmware__form-textarea"
                  placeholder="Enter release notes"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div class="admin-dashboard-firmware__form-actions">
                <button
                  type="button"
                  class="admin-dashboard-firmware__form-button admin-dashboard-firmware__form-button--secondary"
                  @click="closeAddFirmwareModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="admin-dashboard-firmware__form-button"
                  :disabled="isAddingFirmware"
                >
                  <div
                    v-if="isAddingFirmware"
                    class="admin-dashboard-firmware__loading"
                  >
                    <Icon
                      name="mdi:loading"
                      class="admin-dashboard-firmware__loading-icon"
                    />
                    Adding...
                  </div>
                  <span v-else>Add Firmware</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Firmware details modal -->
    <Teleport to="body">
      <div
        v-if="showFirmwareDetailsModal && selectedFirmware"
        class="admin-dashboard-firmware__modal-overlay"
        @click="closeFirmwareDetailsModal"
      >
        <div
          class="admin-dashboard-firmware__modal"
          @click.stop
        >
          <div class="admin-dashboard-firmware__modal-header">
            <h3 class="admin-dashboard-firmware__modal-title">Firmware Details</h3>
            <button
              class="admin-dashboard-firmware__modal-close"
              @click="closeFirmwareDetailsModal"
            >
              <Icon
                name="mdi:close"
                class="admin-dashboard-firmware__modal-close-icon"
              />
            </button>
          </div>
          <div class="admin-dashboard-firmware__modal-body">
            <div class="admin-dashboard-firmware__details">
              <div class="admin-dashboard-firmware__details-row">
                <div class="admin-dashboard-firmware__details-label">ID:</div>
                <div class="admin-dashboard-firmware__details-value">{{ selectedFirmware.id }}</div>
              </div>
              <div class="admin-dashboard-firmware__details-row">
                <div class="admin-dashboard-firmware__details-label">Version:</div>
                <div class="admin-dashboard-firmware__details-value">
                  {{ selectedFirmware.version }}
                </div>
              </div>
              <div class="admin-dashboard-firmware__details-row">
                <div class="admin-dashboard-firmware__details-label">Codename:</div>
                <div class="admin-dashboard-firmware__details-value">
                  {{ selectedFirmware.codename }}
                </div>
              </div>
              <div class="admin-dashboard-firmware__details-row">
                <div class="admin-dashboard-firmware__details-label">Release URL:</div>
                <div class="admin-dashboard-firmware__details-value">
                  <a
                    :href="selectedFirmware.releaseUrl"
                    target="_blank"
                    class="admin-dashboard-firmware__link"
                  >
                    {{ selectedFirmware.releaseUrl }}
                  </a>
                </div>
              </div>
              <div class="admin-dashboard-firmware__details-row">
                <div class="admin-dashboard-firmware__details-label">Created At:</div>
                <div class="admin-dashboard-firmware__details-value">
                  {{ formatDate(selectedFirmware.createdAt) }}
                </div>
              </div>
              <div class="admin-dashboard-firmware__details-row">
                <div class="admin-dashboard-firmware__details-label">Updated At:</div>
                <div class="admin-dashboard-firmware__details-value">
                  {{ formatDate(selectedFirmware.updatedAt) }}
                </div>
              </div>
              <div
                class="admin-dashboard-firmware__details-row admin-dashboard-firmware__details-row--full"
              >
                <div class="admin-dashboard-firmware__details-label">Release Notes:</div>
                <div
                  class="admin-dashboard-firmware__details-value admin-dashboard-firmware__details-value--notes"
                >
                  {{ selectedFirmware.releaseNotes }}
                </div>
              </div>
            </div>
            <div class="admin-dashboard-firmware__form-actions">
              <button
                class="admin-dashboard-firmware__form-button admin-dashboard-firmware__form-button--secondary"
                @click="closeFirmwareDetailsModal"
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

.admin-dashboard-firmware {
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

  &__search-wrapper {
    padding: 1.5rem 2rem;

    :root.light-theme & {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__search {
    display: flex;
    align-items: center;
    position: relative;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.03);
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.03);
    }

    padding: 0.8rem 1.2rem;
    border-radius: 0.8rem;
  }

  &__search-icon {
    font-size: 2rem;
    margin-right: 0.8rem;
    opacity: 0.6;
  }

  &__search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 1.4rem;
    outline: none;

    :root.dark-theme & {
      color: white;
    }
  }

  &__search-clear {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    padding: 0;

    :root.light-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    :root.dark-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
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

  &__form-textarea {
    min-height: 120px;
    resize: vertical;
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
