<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  animationComplete: boolean;
}>();

const showRegisterDeviceModal = ref<boolean>(false);
const isAddingDevice = ref<boolean>(false);

const newDevice = ref({
  name: "",
  deviceId: "",
  type: "ADA-esp32",
  description: "",
});

// Mock danych - urządzenia
const devices = ref([
  {
    id: 1,
    name: "ADA-esp32",
    type: "ESP32",
    status: "online",
    owner: "user@example.com",
    lastActive: "2 min temu",
  },
  {
    id: 2,
    name: "ADA-Phone",
    type: "PhoneApp",
    status: "offline",
    owner: "johndoe@example.com",
    lastActive: "3 dni temu",
  },
  {
    id: 3,
    name: "ADA-esp32",
    type: "ESP32",
    status: "online",
    owner: "alice@example.com",
    lastActive: "15 min temu",
  },
]);

const openRegisterDeviceModal = () => {
  showRegisterDeviceModal.value = true;
};

const closeRegisterDeviceModal = () => {
  showRegisterDeviceModal.value = false;
  // Reset formularza
  newDevice.value = {
    name: "",
    deviceId: "",
    type: "ESP32",
    description: "",
  };
};

const registerDevice = async () => {
  if (isAddingDevice.value) return;

  isAddingDevice.value = true;
  try {
    // Tutaj w przyszłości kod do rejestracji urządzenia w API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Symulacja opóźnienia

    const id = devices.value.length + 1;
    devices.value.push({
      id,
      name: newDevice.value.name,
      type: newDevice.value.type.toUpperCase(),
      status: "offline",
      owner: "Nieprzypisane",
      lastActive: "Nigdy",
    });

    // Zamknij modal
    closeRegisterDeviceModal();
  } finally {
    isAddingDevice.value = false;
  }
};

const deleteDevice = (id: number) => {
  // Usunięcie urządzenia
  devices.value = devices.value.filter((device) => device.id !== id);
};
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
        Zarządzanie urządzeniami
      </h2>
      <button
        class="admin-dashboard-devices__add-button"
        @click="openRegisterDeviceModal"
      >
        <Icon
          name="mdi:plus"
          class="admin-dashboard-devices__add-icon"
        />
        Zarejestruj nowe urządzenie
      </button>
    </div>

    <div class="admin-dashboard-devices__card">
      <table class="admin-dashboard-devices__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Typ</th>
            <th>Status</th>
            <th>Właściciel</th>
            <th>Ostatnia aktywność</th>
            <th class="admin-dashboard-devices__actions-header">Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="device in devices"
            :key="device.id"
            class="admin-dashboard-devices__table-row"
          >
            <td>{{ device.id }}</td>
            <td>{{ device.name }}</td>
            <td>{{ device.type }}</td>
            <td>
              <span
                class="admin-dashboard-devices__status-badge"
                :class="`admin-dashboard-devices__status-badge--${device.status}`"
              >
                {{ device.status }}
              </span>
            </td>
            <td>{{ device.owner }}</td>
            <td>{{ device.lastActive }}</td>
            <td class="admin-dashboard-devices__actions-cell">
              <div class="admin-dashboard-devices__actions">
                <button class="admin-dashboard-devices__action-button">
                  <Icon
                    name="mdi:pencil"
                    class="admin-dashboard-devices__action-icon"
                  />
                </button>
                <button
                  class="admin-dashboard-devices__action-button admin-dashboard-devices__action-button--danger"
                  @click="deleteDevice(device.id)"
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

    <!-- Modal rejestracji urządzenia -->
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
            <h2 class="admin-dashboard-devices__modal-title">Zarejestruj nowe urządzenie</h2>
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
              @submit.prevent="registerDevice"
              class="admin-dashboard-devices__form"
            >
              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Nazwa urządzenia</label>
                <input
                  v-model="newDevice.name"
                  class="admin-dashboard-devices__form-input"
                  type="text"
                  placeholder="Np. ADA-ESP32"
                  required
                />
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">ID urządzenia</label>
                <input
                  v-model="newDevice.deviceId"
                  class="admin-dashboard-devices__form-input"
                  type="text"
                  placeholder="Unikalny identyfikator urządzenia"
                  required
                />
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Typ urządzenia</label>
                <div class="admin-dashboard-devices__select-wrapper">
                  <select
                    v-model="newDevice.type"
                    class="admin-dashboard-devices__form-select"
                  >
                    <option value="ADA-esp32">ESP32</option>
                    <option value="ADA-Phone">PhoneApp</option>
                    <option value="ADA-other">Inne</option>
                  </select>
                  <Icon
                    name="mdi:chevron-down"
                    class="admin-dashboard-devices__select-icon"
                  />
                </div>
              </div>

              <div class="admin-dashboard-devices__form-group">
                <label class="admin-dashboard-devices__form-label">Opis (opcjonalnie)</label>
                <textarea
                  v-model="newDevice.description"
                  class="admin-dashboard-devices__form-textarea"
                  placeholder="Opcjonalny opis urządzenia"
                ></textarea>
              </div>

              <div class="admin-dashboard-devices__form-actions">
                <button
                  type="button"
                  class="admin-dashboard-devices__form-button admin-dashboard-devices__form-button--secondary"
                  @click="closeRegisterDeviceModal"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  class="admin-dashboard-devices__form-button"
                  :disabled="isAddingDevice"
                >
                  <span v-if="!isAddingDevice">Zarejestruj urządzenie</span>
                  <span
                    v-else
                    class="admin-dashboard-devices__loading"
                  >
                    <Icon
                      name="mdi:loading"
                      class="admin-dashboard-devices__loading-icon"
                    />
                    Rejestracja...
                  </span>
                </button>
              </div>
            </form>
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

    @include mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
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

    @include mobile {
      width: 100%;
      justify-content: center;
    }
  }

  &__add-icon {
    font-size: 2rem;
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
    font-size: 1.5rem;

    th,
    td {
      padding: 1.6rem;
      text-align: left;
    }

    th {
      font-weight: 600;

      :root.light-theme & {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      :root.dark-theme & {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }

    @include mobile {
      display: block;
      overflow-x: auto;

      th,
      td {
        padding: 1.2rem;
        min-width: 12rem;
      }
    }
  }

  &__actions-header {
    text-align: center !important;
  }

  &__actions-cell {
    text-align: center;
    padding: 0;
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
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 1.3rem;
    font-weight: 500;

    &--online {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;
    }

    &--offline {
      background-color: rgba(220, 38, 38, 0.2);
      color: #dc2626;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    width: 100%;
  }

  &__action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.6rem;
    height: 3.6rem;
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
    right: 1rem;
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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out forwards;
  }

  &__modal {
    width: 500px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 1.5rem;
    animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;

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
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
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
    padding: 2rem;
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
    min-height: 10rem;
    resize: vertical;
  }

  &__form-select {
    appearance: none;
    padding-right: 3rem;
  }

  &__form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    @include mobile {
      flex-direction: column;
    }
  }

  &__form-button {
    padding: 1.2rem 2.4rem;
    border-radius: 1rem;
    font-size: 1.6rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 16rem;

    @include mobile {
      width: 100%;
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

      &--secondary {
        background-color: transparent;
        color: #5a5a5a;
        border: 1px solid rgba(0, 0, 0, 0.2);

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
          transform: none;
          box-shadow: none;
        }
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

      &--secondary {
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
