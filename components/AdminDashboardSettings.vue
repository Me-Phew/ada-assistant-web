<script setup lang="ts">
import { ref } from "vue";

defineProps({
  animationComplete: {
    type: Boolean,
    default: false,
  },
});

// Theme settings
const currentTheme = ref(
  document.documentElement.classList.contains("dark-theme") ? "dark" : "light",
);
const themeOptions = [
  { id: "light", name: "Jasny", icon: "mdi:white-balance-sunny" },
  { id: "dark", name: "Ciemny", icon: "mdi:moon-waning-crescent" },
  { id: "auto", name: "Automatyczny", icon: "mdi:theme-light-dark" },
];

// Notification settings
const notificationSettings = ref({
  emailNotifications: true,
  pushNotifications: true,
  deviceAlerts: true,
  securityAlerts: true,
  systemUpdates: true,
});

// Security settings
const securitySettings = ref({
  twoFactorAuth: false,
  loginNotifications: true,
  sessionTimeout: "30",
});

const timeoutOptions = [
  { value: "15", label: "15 minut" },
  { value: "30", label: "30 minut" },
  { value: "60", label: "1 godzina" },
  { value: "120", label: "2 godziny" },
];

// System settings
const systemSettings = ref({
  dataSyncInterval: "30",
});

const dataSyncOptions = [
  { value: "5", label: "5 minut" },
  { value: "15", label: "15 minut" },
  { value: "30", label: "30 minut" },
  { value: "60", label: "1 godzina" },
];

// Profile settings
const profileSettings = ref({
  avatar: null,
});

// Save settings
const isLoading = ref(false);
const saveSuccess = ref(false);
const saveError = ref("");

const saveSettings = async () => {
  isLoading.value = true;
  saveError.value = "";
  saveSuccess.value = false;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Apply theme change
    if (currentTheme.value === "light") {
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.classList.add("light-theme");
    } else if (currentTheme.value === "dark") {
      document.documentElement.classList.remove("light-theme");
      document.documentElement.classList.add("dark-theme");
    }

    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (error) {
    saveError.value = "Wystąpił błąd podczas zapisywania ustawień";
  } finally {
    isLoading.value = false;
  }
};

// Reset settings
const showResetConfirmation = ref(false);

const triggerReset = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  showResetConfirmation.value = true;
};

const confirmReset = () => {
  currentTheme.value = "light";
  notificationSettings.value = {
    emailNotifications: true,
    pushNotifications: true,
    deviceAlerts: true,
    securityAlerts: true,
    systemUpdates: true,
  };
  securitySettings.value = {
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
  };
  systemSettings.value = {
    dataSyncInterval: "30",
  };
  showResetConfirmation.value = false;
};

const cancelReset = () => {
  showResetConfirmation.value = false;
};

// Avatar upload handling
const fileInputRef = ref(null);
const showAvatarUpload = ref(false);

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.match("image.*")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileSettings.value.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  profileSettings.value.avatar = null;
};

// Active section tracking for mobile
const activeSection = ref("profile");
</script>

<template>
  <div
    class="admin-dashboard-settings"
    :class="{ 'admin-dashboard-settings--loaded': animationComplete }"
  >
    <div class="admin-dashboard-settings__header">
      <h2 class="admin-dashboard-settings__title">
        <Icon
          name="mdi:cog"
          class="admin-dashboard-settings__icon"
        />
        Ustawienia
      </h2>
    </div>

    <!-- Mobile section selector -->
    <div class="admin-dashboard-settings__section-selector">
      <button
        v-for="section in ['profile', 'appearance', 'notifications', 'security', 'system', 'info']"
        :key="section"
        class="admin-dashboard-settings__section-button"
        :class="{ 'admin-dashboard-settings__section-button--active': activeSection === section }"
        @click="activeSection = section"
      >
        <Icon
          :name="`mdi:${
            section === 'profile'
              ? 'account-circle'
              : section === 'appearance'
                ? 'palette'
                : section === 'notifications'
                  ? 'bell'
                  : section === 'security'
                    ? 'shield'
                    : section === 'info'
                      ? 'information'
                      : 'tune'
          }`"
          class="admin-dashboard-settings__section-icon"
        />
        <span>{{
          section === "profile"
            ? "Profil"
            : section === "appearance"
              ? "Wygląd"
              : section === "notifications"
                ? "Powiadomienia"
                : section === "security"
                  ? "Bezpieczeństwo"
                  : section === "info"
                    ? "Informacje"
                    : "System"
        }}</span>
      </button>
    </div>

    <div class="admin-dashboard-settings__container">
      <!-- Profile Settings Card -->
      <div
        class="admin-dashboard-settings__card"
        :class="{ 'admin-dashboard-settings__card--active': activeSection === 'profile' }"
      >
        <div class="admin-dashboard-settings__card-header">
          <Icon
            name="mdi:account-circle"
            class="admin-dashboard-settings__card-icon"
          />
          <h3 class="admin-dashboard-settings__card-title">Profil użytkownika</h3>
        </div>

        <div class="admin-dashboard-settings__section">
          <div class="admin-dashboard-settings__avatar-section">
            <div
              class="admin-dashboard-settings__avatar"
              @mouseenter="showAvatarUpload = true"
              @mouseleave="showAvatarUpload = false"
              @click="triggerFileInput"
            >
              <template v-if="profileSettings.avatar">
                <img
                  :src="profileSettings.avatar"
                  alt="Avatar"
                  class="admin-dashboard-settings__avatar-image"
                />
              </template>
              <template v-else>
                <div class="admin-dashboard-settings__avatar-placeholder">AD</div>
              </template>

              <div
                class="admin-dashboard-settings__avatar-upload"
                :class="{ 'admin-dashboard-settings__avatar-upload--visible': showAvatarUpload }"
              >
                <Icon
                  name="mdi:camera"
                  class="admin-dashboard-settings__avatar-upload-icon"
                />
                <span class="admin-dashboard-settings__avatar-upload-text">Zmień</span>
              </div>
            </div>

            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="admin-dashboard-settings__file-input"
              @change="handleFileUpload"
            />

            <button
              v-if="profileSettings.avatar"
              class="admin-dashboard-settings__remove-avatar"
              @click="removeAvatar"
            >
              <Icon
                name="mdi:delete"
                class="admin-dashboard-settings__remove-avatar-icon"
              />
              Usuń avatar
            </button>
          </div>

          <div class="admin-dashboard-settings__profile-fields">
            <div class="admin-dashboard-settings__input-group">
              <label class="admin-dashboard-settings__input-label">Imię i nazwisko</label>
              <input
                type="text"
                class="admin-dashboard-settings__input"
                placeholder="Twoje imię i nazwisko"
                value="Administrator"
              />
            </div>

            <div class="admin-dashboard-settings__input-group">
              <label class="admin-dashboard-settings__input-label">Adres email</label>
              <input
                type="email"
                class="admin-dashboard-settings__input"
                placeholder="Twój adres email"
                value="admin@example.com"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Settings Card -->
      <div
        class="admin-dashboard-settings__card"
        :class="{ 'admin-dashboard-settings__card--active': activeSection === 'appearance' }"
      >
        <div class="admin-dashboard-settings__card-header">
          <Icon
            name="mdi:palette-outline"
            class="admin-dashboard-settings__card-icon"
          />
          <h3 class="admin-dashboard-settings__card-title">Wygląd</h3>
        </div>

        <div class="admin-dashboard-settings__section">
          <div class="admin-dashboard-settings__section-header">
            <h4 class="admin-dashboard-settings__section-title">Motyw</h4>
          </div>

          <div class="admin-dashboard-settings__theme-selector">
            <button
              v-for="theme in themeOptions"
              :key="theme.id"
              class="admin-dashboard-settings__theme-option"
              :class="{
                'admin-dashboard-settings__theme-option--active': currentTheme === theme.id,
              }"
              @click="currentTheme = theme.id"
            >
              <Icon
                :name="theme.icon"
                class="admin-dashboard-settings__theme-icon"
              />
              <span class="admin-dashboard-settings__theme-name">{{ theme.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Settings Card -->
      <div
        class="admin-dashboard-settings__card"
        :class="{ 'admin-dashboard-settings__card--active': activeSection === 'notifications' }"
      >
        <div class="admin-dashboard-settings__card-header">
          <Icon
            name="mdi:bell-outline"
            class="admin-dashboard-settings__card-icon"
          />
          <h3 class="admin-dashboard-settings__card-title">Powiadomienia</h3>
        </div>

        <div class="admin-dashboard-settings__section">
          <div class="admin-dashboard-settings__toggle-group">
            <div class="admin-dashboard-settings__toggle-item">
              <div class="admin-dashboard-settings__toggle-info">
                <h4 class="admin-dashboard-settings__toggle-title">Powiadomienia e-mail</h4>
                <p class="admin-dashboard-settings__toggle-desc">
                  Otrzymuj powiadomienia na adres e-mail
                </p>
              </div>
              <label class="admin-dashboard-settings__switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.emailNotifications"
                />
                <span class="admin-dashboard-settings__slider"></span>
              </label>
            </div>

            <div class="admin-dashboard-settings__toggle-item">
              <div class="admin-dashboard-settings__toggle-info">
                <h4 class="admin-dashboard-settings__toggle-title">Powiadomienia push</h4>
                <p class="admin-dashboard-settings__toggle-desc">
                  Otrzymuj powiadomienia push w aplikacji
                </p>
              </div>
              <label class="admin-dashboard-settings__switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.pushNotifications"
                />
                <span class="admin-dashboard-settings__slider"></span>
              </label>
            </div>

            <div class="admin-dashboard-settings__toggle-item">
              <div class="admin-dashboard-settings__toggle-info">
                <h4 class="admin-dashboard-settings__toggle-title">Alerty urządzeń</h4>
                <p class="admin-dashboard-settings__toggle-desc">Powiadomienia o stanie urządzeń</p>
              </div>
              <label class="admin-dashboard-settings__switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.deviceAlerts"
                />
                <span class="admin-dashboard-settings__slider"></span>
              </label>
            </div>

            <div class="admin-dashboard-settings__toggle-item">
              <div class="admin-dashboard-settings__toggle-info">
                <h4 class="admin-dashboard-settings__toggle-title">Alerty bezpieczeństwa</h4>
                <p class="admin-dashboard-settings__toggle-desc">
                  Powiadomienia o potencjalnych zagrożeniach
                </p>
              </div>
              <label class="admin-dashboard-settings__switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.securityAlerts"
                />
                <span class="admin-dashboard-settings__slider"></span>
              </label>
            </div>

            <div class="admin-dashboard-settings__toggle-item">
              <div class="admin-dashboard-settings__toggle-info">
                <h4 class="admin-dashboard-settings__toggle-title">Aktualizacje systemowe</h4>
                <p class="admin-dashboard-settings__toggle-desc">
                  Powiadomienia o dostępnych aktualizacjach
                </p>
              </div>
              <label class="admin-dashboard-settings__switch">
                <input
                  type="checkbox"
                  v-model="notificationSettings.systemUpdates"
                />
                <span class="admin-dashboard-settings__slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings Card -->
      <div
        class="admin-dashboard-settings__card"
        :class="{ 'admin-dashboard-settings__card--active': activeSection === 'security' }"
      >
        <div class="admin-dashboard-settings__card-header">
          <Icon
            name="mdi:shield-outline"
            class="admin-dashboard-settings__card-icon"
          />
          <h3 class="admin-dashboard-settings__card-title">Bezpieczeństwo</h3>
        </div>

        <div class="admin-dashboard-settings__section">
          <div class="admin-dashboard-settings__toggle-group">
            <div class="admin-dashboard-settings__toggle-item">
              <div class="admin-dashboard-settings__toggle-info">
                <h4 class="admin-dashboard-settings__toggle-title">Weryfikacja dwuetapowa</h4>
                <p class="admin-dashboard-settings__toggle-desc">
                  Dodatkowa warstwa bezpieczeństwa dla konta
                </p>
              </div>
              <label class="admin-dashboard-settings__switch">
                <input
                  type="checkbox"
                  v-model="securitySettings.twoFactorAuth"
                />
                <span class="admin-dashboard-settings__slider"></span>
              </label>
            </div>

            <div class="admin-dashboard-settings__toggle-item">
              <div class="admin-dashboard-settings__toggle-info">
                <h4 class="admin-dashboard-settings__toggle-title">Powiadomienia o logowaniu</h4>
                <p class="admin-dashboard-settings__toggle-desc">
                  Otrzymuj powiadomienia o nowych logowaniach
                </p>
              </div>
              <label class="admin-dashboard-settings__switch">
                <input
                  type="checkbox"
                  v-model="securitySettings.loginNotifications"
                />
                <span class="admin-dashboard-settings__slider"></span>
              </label>
            </div>
          </div>

          <div class="admin-dashboard-settings__input-group">
            <label class="admin-dashboard-settings__input-label">Czas bezczynności sesji</label>
            <div class="admin-dashboard-settings__select-wrapper">
              <select
                v-model="securitySettings.sessionTimeout"
                class="admin-dashboard-settings__select"
              >
                <option
                  v-for="option in timeoutOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <Icon
                name="mdi:chevron-down"
                class="admin-dashboard-settings__select-icon"
              />
            </div>
            <p class="admin-dashboard-settings__input-desc">
              Czas po którym nastąpi automatyczne wylogowanie
            </p>
          </div>

          <div class="admin-dashboard-settings__button-group">
            <button class="admin-dashboard-settings__security-button">
              <Icon
                name="mdi:lock-reset"
                class="admin-dashboard-settings__security-button-icon"
              />
              Zmień hasło
            </button>

            <button
              class="admin-dashboard-settings__security-button admin-dashboard-settings__security-button--danger"
            >
              <Icon
                name="mdi:account-cancel"
                class="admin-dashboard-settings__security-button-icon"
              />
              Zablokuj dostęp do urządzeń
            </button>
          </div>
        </div>
      </div>

      <!-- System Settings Card -->
      <div
        class="admin-dashboard-settings__card"
        :class="{ 'admin-dashboard-settings__card--active': activeSection === 'system' }"
      >
        <div class="admin-dashboard-settings__card-header">
          <Icon
            name="mdi:tune"
            class="admin-dashboard-settings__card-icon"
          />
          <h3 class="admin-dashboard-settings__card-title">System</h3>
        </div>

        <div class="admin-dashboard-settings__section">
          <div class="admin-dashboard-settings__input-group">
            <label class="admin-dashboard-settings__input-label">Język</label>
            <div class="admin-dashboard-settings__select-wrapper">
              <select class="admin-dashboard-settings__select">
                <option value="pl">Polski</option>
                <option value="en">English</option>
              </select>
              <Icon
                name="mdi:chevron-down"
                class="admin-dashboard-settings__select-icon"
              />
            </div>
          </div>

          <div class="admin-dashboard-settings__input-group">
            <label class="admin-dashboard-settings__input-label">Format daty</label>
            <div class="admin-dashboard-settings__select-wrapper">
              <select class="admin-dashboard-settings__select">
                <option value="dd.mm.yyyy">DD.MM.YYYY</option>
                <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              </select>
              <Icon
                name="mdi:chevron-down"
                class="admin-dashboard-settings__select-icon"
              />
            </div>
          </div>

          <div class="admin-dashboard-settings__input-group">
            <label class="admin-dashboard-settings__input-label">Format czasu</label>
            <div class="admin-dashboard-settings__select-wrapper">
              <select class="admin-dashboard-settings__select">
                <option value="24h">24-godzinny</option>
                <option value="12h">12-godzinny (AM/PM)</option>
              </select>
              <Icon
                name="mdi:chevron-down"
                class="admin-dashboard-settings__select-icon"
              />
            </div>
          </div>

          <div class="admin-dashboard-settings__toggle-item">
            <div class="admin-dashboard-settings__toggle-info">
              <h4 class="admin-dashboard-settings__toggle-title">Automatyczne aktualizacje</h4>
              <p class="admin-dashboard-settings__toggle-desc">
                Automatyczna instalacja aktualizacji systemu
              </p>
            </div>
            <label class="admin-dashboard-settings__switch">
              <input
                type="checkbox"
                checked
              />
              <span class="admin-dashboard-settings__slider"></span>
            </label>
          </div>

          <div class="admin-dashboard-settings__input-group">
            <label class="admin-dashboard-settings__input-label"
              >Częstotliwość synchronizacji</label
            >
            <div class="admin-dashboard-settings__select-wrapper">
              <select
                v-model="systemSettings.dataSyncInterval"
                class="admin-dashboard-settings__select"
              >
                <option
                  v-for="option in dataSyncOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <Icon
                name="mdi:chevron-down"
                class="admin-dashboard-settings__select-icon"
              />
            </div>
            <p class="admin-dashboard-settings__input-desc">
              Jak często system będzie pobierał nowe dane
            </p>
          </div>
        </div>
      </div>

      <!-- System Info Card -->
      <div
        class="admin-dashboard-settings__card"
        :class="{ 'admin-dashboard-settings__card--active': activeSection === 'info' }"
      >
        <div class="admin-dashboard-settings__card-header">
          <Icon
            name="mdi:information"
            class="admin-dashboard-settings__card-icon"
          />
          <h3 class="admin-dashboard-settings__card-title">Informacje o systemie</h3>
        </div>

        <div class="admin-dashboard-settings__section">
          <div class="admin-dashboard-settings__system-info">
            <div class="admin-dashboard-settings__system-info-item">
              <span class="admin-dashboard-settings__system-info-label">Wersja systemu:</span>
              <span class="admin-dashboard-settings__system-info-value">2.5.3</span>
            </div>
            <div class="admin-dashboard-settings__system-info-item">
              <span class="admin-dashboard-settings__system-info-label"
                >Ostatnia aktualizacja:</span
              >
              <span class="admin-dashboard-settings__system-info-value">2025-04-01</span>
            </div>
            <div class="admin-dashboard-settings__system-info-item">
              <span class="admin-dashboard-settings__system-info-label">Status systemu:</span>
              <span
                class="admin-dashboard-settings__system-info-value admin-dashboard-settings__system-info-value--online"
              >
                <span class="admin-dashboard-settings__status-dot"></span>
                Online
              </span>
            </div>
          </div>

          <div class="admin-dashboard-settings__system-details">
            <h4 class="admin-dashboard-settings__section-title">Szczegóły urządzenia</h4>
            <div class="admin-dashboard-settings__details-list">
              <div class="admin-dashboard-settings__details-item">
                <span class="admin-dashboard-settings__details-label">Adres IP:</span>
                <span class="admin-dashboard-settings__details-value">192.168.1.100</span>
              </div>
              <div class="admin-dashboard-settings__details-item">
                <span class="admin-dashboard-settings__details-label">MAC:</span>
                <span class="admin-dashboard-settings__details-value">00:1B:44:11:3A:B7</span>
              </div>
              <div class="admin-dashboard-settings__details-item">
                <span class="admin-dashboard-settings__details-label">Uptime:</span>
                <span class="admin-dashboard-settings__details-value">7 dni 14 godzin</span>
              </div>
              <div class="admin-dashboard-settings__details-item">
                <span class="admin-dashboard-settings__details-label">Dostępna pamięć:</span>
                <span class="admin-dashboard-settings__details-value">3.2 GB / 4 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="admin-dashboard-settings__actions">
      <div class="admin-dashboard-settings__status">
        <p
          v-if="saveSuccess"
          class="admin-dashboard-settings__success"
        >
          <Icon
            name="mdi:check-circle"
            class="admin-dashboard-settings__status-icon"
          />
          Zmiany zostały zapisane pomyślnie
        </p>
        <p
          v-if="saveError"
          class="admin-dashboard-settings__error"
        >
          <Icon
            name="mdi:alert-circle"
            class="admin-dashboard-settings__status-icon"
          />
          {{ saveError }}
        </p>
      </div>
      <div class="admin-dashboard-settings__buttons">
        <button
          class="admin-dashboard-settings__reset-button"
          @click="triggerReset"
        >
          <Icon
            name="mdi:refresh"
            class="admin-dashboard-settings__button-icon"
          />
          Przywróć domyślne
        </button>
        <button
          class="admin-dashboard-settings__save-button"
          @click="saveSettings"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <Icon
              name="mdi:loading"
              class="admin-dashboard-settings__button-icon admin-dashboard-settings__button-icon--loading"
            />
            Zapisywanie...
          </template>
          <template v-else>
            <Icon
              name="mdi:content-save"
              class="admin-dashboard-settings__button-icon"
            />
            Zapisz zmiany
          </template>
        </button>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div
      v-if="showResetConfirmation"
      class="admin-dashboard-settings__modal"
    >
      <div class="admin-dashboard-settings__modal-header">
        <Icon
          name="mdi:alert-circle"
          class="admin-dashboard-settings__modal-icon"
        />
        <h3 class="admin-dashboard-settings__modal-title">Przywracanie ustawień domyślnych</h3>
      </div>
      <div class="admin-dashboard-settings__modal-content">
        <p>Czy na pewno chcesz przywrócić domyślne ustawienia? Ta operacja jest nieodwracalna.</p>
      </div>
      <div class="admin-dashboard-settings__modal-actions">
        <button
          class="admin-dashboard-settings__modal-button admin-dashboard-settings__modal-button--cancel"
          @click="cancelReset"
        >
          <Icon
            name="mdi:close"
            class="admin-dashboard-settings__modal-button-icon"
          />
          Anuluj
        </button>
        <button
          class="admin-dashboard-settings__modal-button admin-dashboard-settings__modal-button--confirm"
          @click="confirmReset"
        >
          <Icon
            name="mdi:check"
            class="admin-dashboard-settings__modal-button-icon"
          />
          Potwierdź
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "~/assets/styles/global/variables/card_styles" as *;

.admin-dashboard-settings {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.3s;
  margin-bottom: 3rem;

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2.2rem;
    font-weight: 600;
    margin: 0;
  }

  &__icon {
    font-size: 2.4rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__section-selector {
    display: none;

    @include mobile {
      display: flex;
      justify-content: space-between;
      overflow-x: auto;
      padding: 0.5rem;
      margin-bottom: 2rem;
      gap: 0.5rem;

      &::-webkit-scrollbar {
        height: 3px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
      }
    }
  }

  &__section-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.8rem;
    border: none;
    background: transparent;
    min-width: 7rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &--active {
      :root.light-theme & {
        background-color: rgba(0, 114, 245, 0.1);
        color: #0072f5;
      }

      :root.dark-theme & {
        background-color: rgba(0, 201, 114, 0.1);
        color: #00c972;
      }
    }

    &:hover:not(&--active) {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.05);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__section-icon {
    font-size: 2.2rem;
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;

    @include mobile {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  &__card {
    border-radius: $dark_card_border_radius;
    padding: 2rem;

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

    @include mobile {
      display: none;

      &--active {
        display: block;
      }
    }
  }

  &__card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.8rem;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);
    }
  }

  &__card-icon {
    font-size: 2.2rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__card-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
    color: $color_text_primary;
  }

  &__section {
    margin-bottom: 1.5rem;
  }

  &__section-header {
    margin-bottom: 1.6rem;
  }

  &__section-title {
    font-size: 1.6rem;
    font-weight: 500;
    margin: 0 0 0.6rem 0;
    color: $color_text_primary;
  }

  &__theme-selector {
    display: flex;
    gap: 1.5rem;

    @include mobile {
      flex-wrap: wrap;
    }
  }

  &__theme-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.8rem 1.2rem;
    border-radius: 1rem;
    gap: 1.2rem;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      }

      &--active {
        border-color: #0072f5;
        background-color: rgba(0, 114, 245, 0.05);
      }
    }

    :root.dark-theme & {
      background-color: #080d11;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
      }

      &--active {
        border-color: #00c972;
        background-color: rgba(0, 201, 114, 0.05);
      }
    }

    @include mobile {
      flex: 1 1 100%;
    }
  }

  &__theme-icon {
    font-size: 3rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__theme-name {
    font-weight: 500;
    font-size: 1.5rem;

    :root.light-theme & {
      color: #333;
    }

    :root.dark-theme & {
      color: #e0e0e0;
    }
  }

  &__avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }

  &__avatar {
    position: relative;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 1rem;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    font-weight: 600;
    color: $color_text_secondary;
  }

  &__avatar-upload {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;

    &--visible {
      opacity: 1;
    }
  }

  &__avatar-upload-icon {
    font-size: 2.4rem;
    color: white;
    margin-bottom: 0.5rem;
  }

  &__avatar-upload-text {
    color: white;
    font-size: 1.4rem;
  }

  &__file-input {
    display: none;
  }

  &__remove-avatar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border-radius: 2rem;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: rgba(220, 38, 38, 0.1);
      color: #dc2626;

      &:hover {
        background-color: rgba(220, 38, 38, 0.2);
      }
    }

    :root.dark-theme & {
      background-color: rgba(220, 38, 38, 0.1);
      color: #ef4444;

      &:hover {
        background-color: rgba(220, 38, 38, 0.2);
      }
    }
  }

  &__remove-avatar-icon {
    font-size: 1.6rem;
  }

  &__profile-fields {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__toggle-group {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
  }

  &__toggle-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;
  }

  &__toggle-info {
    flex: 1;
  }

  &__toggle-title {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0 0 0.5rem 0;
    color: $color_text_primary;
  }

  &__toggle-desc {
    font-size: 1.3rem;
    margin: 0;
    color: $color_text_secondary;
  }

  &__switch {
    position: relative;
    display: inline-block;
    width: 5rem;
    height: 2.6rem;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 3.4rem;

    &:before {
      position: absolute;
      content: "";
      height: 2rem;
      width: 2rem;
      left: 0.3rem;
      bottom: 0.3rem;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    :root.light-theme input:checked + & {
      background-color: #0072f5;
    }

    :root.dark-theme input:checked + & {
      background-color: #00c972;
    }

    input:checked + &:before {
      transform: translateX(2.4rem);
    }
  }

  &__input-group {
    margin-bottom: 2rem;
  }

  &__input-label {
    display: block;
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.8rem;
    color: $color_text_primary;
  }

  &__input {
    width: 100%;
    padding: 1rem 1.6rem;
    border-radius: 0.6rem;
    font-size: 1.4rem;

    :root.light-theme & {
      border: 1px solid rgba(0, 0, 0, 0.1);
      background-color: white;
      color: $color_text_primary;
    }

    :root.dark-theme & {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #080d11;
      color: $color_text_primary;
    }

    &:focus {
      outline: none;

      :root.light-theme & {
        border-color: #0072f5;
        box-shadow: 0 0 0 2px rgba(0, 114, 245, 0.2);
      }

      :root.dark-theme & {
        border-color: #00c972;
        box-shadow: 0 0 0 2px rgba(0, 201, 114, 0.2);
      }
    }
  }

  &__select-wrapper {
    position: relative;
  }

  &__select {
    appearance: none;
    width: 100%;
    padding: 1rem 1.6rem;
    padding-right: 3.5rem;
    border-radius: 0.6rem;
    font-size: 1.4rem;
    cursor: pointer;

    :root.light-theme & {
      border: 1px solid rgba(0, 0, 0, 0.1);
      background-color: white;
      color: $color_text_primary;
    }

    :root.dark-theme & {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #080d11;
      color: $color_text_primary;
    }

    &:focus {
      outline: none;

      :root.light-theme & {
        border-color: #0072f5;
        box-shadow: 0 0 0 2px rgba(0, 114, 245, 0.2);
      }

      :root.dark-theme & {
        border-color: #00c972;
        box-shadow: 0 0 0 2px rgba(0, 201, 114, 0.2);
      }
    }
  }

  &__select-icon {
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: $color_text_secondary;
    font-size: 1.8rem;
  }

  &__input-desc {
    font-size: 1.3rem;
    margin: 0.8rem 0 0 0;
    color: $color_text_secondary;
  }

  &__button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2.5rem;
  }

  &__security-button {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 1.2rem 1.6rem;
    border-radius: 0.8rem;
    font-size: 1.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    &--danger {
      :root.light-theme & {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover {
          background-color: rgba(220, 38, 38, 0.2);
        }
      }

      :root.dark-theme & {
        background-color: rgba(220, 38, 38, 0.1);
        color: #ef4444;

        &:hover {
          background-color: rgba(220, 38, 38, 0.2);
        }
      }
    }
  }

  &__security-button-icon {
    font-size: 2rem;
  }

  &__system-info {
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2.5rem;

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }

  &__system-info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;

    &:not(:last-child) {
      border-bottom: 1px solid;

      :root.light-theme & {
        border-color: rgba(0, 0, 0, 0.05);
      }

      :root.dark-theme & {
        border-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__system-info-label {
    font-size: 1.5rem;
    color: $color_text_primary;
    font-weight: 500;
  }

  &__system-info-value {
    font-size: 1.5rem;
    font-weight: 500;
    color: $color_text_primary;

    &--online {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: #22c55e;
    }
  }

  &__status-dot {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    background-color: #22c55e;
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
  }

  &__system-details {
    margin-top: 2.5rem;
  }

  &__details-list {
    margin-top: 1.2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__details-item {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.02);
    padding: 1.4rem;
    border-radius: 0.8rem;

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }

  &__details-label {
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-bottom: 0.5rem;
  }

  &__details-value {
    font-size: 1.4rem;
    font-weight: 500;
    color: $color_text_primary;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;

    @include mobile {
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  &__status {
    min-height: 2.4rem;

    @include mobile {
      width: 100%;
      order: 2;
      text-align: center;
    }
  }

  &__success {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.5rem;
    margin: 0;
    color: #22c55e;

    @include mobile {
      justify-content: center;
    }
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.5rem;
    margin: 0;
    color: #ef4444;

    @include mobile {
      justify-content: center;
    }
  }

  &__status-icon {
    font-size: 2rem;
  }

  &__buttons {
    display: flex;
    gap: 1.5rem;

    @include mobile {
      width: 100%;
      order: 1;
    }
  }

  &__reset-button,
  &__save-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 1rem 2rem;
    font-size: 1.5rem;
    font-weight: 500;
    border-radius: 0.8rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    @include mobile {
      flex: 1;
    }
  }

  &__reset-button {
    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__save-button {
    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;

      &:hover:not(:disabled) {
        background-color: #0072f5;
        color: white;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;

      &:hover:not(:disabled) {
        background-color: #00c972;
        color: #0e131b;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  &__button-icon {
    font-size: 1.8rem;

    &--loading {
      animation: spin 1s linear infinite;
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
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    width: 100%;
    max-width: 460px;
    border-radius: 1.2rem;
    padding: 2rem;
    animation: slideDown 0.3s ease-out forwards;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: #101419;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__modal-header {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin-bottom: 1.6rem;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);
    }
  }

  &__modal-icon {
    font-size: 2.4rem;
    color: #ff6a00;
  }

  &__modal-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: $color_text_primary;
  }

  &__modal-content {
    margin-bottom: 2rem;

    p {
      font-size: 1.5rem;
      line-height: 1.5;
      color: $color_text_primary;
    }
  }

  &__modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  &__modal-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.8rem 1.6rem;
    border-radius: 0.6rem;
    font-size: 1.4rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &--cancel {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.05);
        color: $color_text_primary;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
        color: $color_text_primary;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    &--confirm {
      :root.light-theme & {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover {
          background-color: #dc2626;
          color: white;
        }
      }

      :root.dark-theme & {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;

        &:hover {
          background-color: #ef4444;
          color: white;
        }
      }
    }
  }

  &__modal-button-icon {
    font-size: 1.8rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
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

@keyframes slideDown {
  from {
    transform: translate(-50%, -10px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>
