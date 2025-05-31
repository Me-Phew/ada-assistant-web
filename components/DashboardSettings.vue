<script lang="ts" setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useUrl } from "~/composables/register";

defineProps<{
  animationComplete: boolean;
}>();

const { t } = useI18n();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isSubmitting = ref(false);
const showSuccess = ref(false);
const errorMessage = ref("");

const activeSection = ref("account");

const currentTheme = ref(
  document.documentElement.classList.contains("dark-theme") ? "dark" : "light",
);
const themeOptions = [
  { id: "light", name: "Light", icon: "mdi:white-balance-sunny" },
  { id: "dark", name: "Dark", icon: "mdi:moon-waning-crescent" },
];

const changeTheme = (themeId) => {
  currentTheme.value = themeId;

  if (themeId === "light") {
    document.documentElement.classList.remove("dark-theme");
    document.documentElement.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.remove("light-theme");
    document.documentElement.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  }
};

const changePassword = async () => {
  if (isSubmitting.value) return;

  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = "Please fill in all password fields";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "New passwords don't match";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";
  showSuccess.value = false;

  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    await $fetch("/auth/change-password", {
      method: "POST",
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showSuccess.value = true;
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);
  } catch (error) {
    console.error("Password change error:", error);
    if (error?.data?.message) {
      errorMessage.value = error.data.message;
    } else {
      errorMessage.value = "Failed to change password. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

watch(activeSection, () => {
  errorMessage.value = "";
  showSuccess.value = false;
});
</script>

<template>
  <div
    class="dashboard-settings"
    :class="{ 'dashboard-settings--loaded': animationComplete }"
  >
    <!-- Mobile section selector -->
    <div class="dashboard-settings__section-selector">
      <button
        v-for="section in ['account', 'appearance']"
        :key="section"
        class="dashboard-settings__section-button"
        :class="{
          'dashboard-settings__section-button--active': activeSection === section,
        }"
        @click="activeSection = section"
      >
        <Icon
          :name="section === 'account' ? 'mdi:shield-account' : 'mdi:palette-outline'"
          class="dashboard-settings__section-icon"
        />
        <span>{{ $t(`components.dashboardSettings.sections.${section}`) }}</span>
      </button>
    </div>

    <div class="dashboard-settings__container">
      <!-- Account Settings Card -->
      <div
        class="dashboard-settings__card"
        :class="{ 'dashboard-settings__card--active': activeSection === 'account' }"
      >
        <div class="dashboard-settings__card-header">
          <Icon
            name="mdi:shield-account"
            class="dashboard-settings__card-icon"
          />
          <h3 class="dashboard-settings__card-title">
            {{ $t("components.dashboardSettings.account.title") }}
          </h3>
        </div>

        <div class="dashboard-settings__section">
          <h4 class="dashboard-settings__section-title">
            {{ $t("components.dashboardSettings.account.passwordTitle") }}
          </h4>

          <!-- Alert messages -->
          <div
            v-if="errorMessage"
            class="dashboard-settings__alert dashboard-settings__alert--error"
          >
            <Icon
              name="mdi:alert-circle"
              class="dashboard-settings__alert-icon"
            />
            {{ errorMessage }}
          </div>

          <div
            v-if="showSuccess"
            class="dashboard-settings__alert dashboard-settings__alert--success"
          >
            <Icon
              name="mdi:check-circle"
              class="dashboard-settings__alert-icon"
            />
            {{ $t("components.dashboardSettings.account.passwordSuccess") }}
          </div>

          <!-- Password form -->
          <form
            @submit.prevent="changePassword"
            class="dashboard-settings__password-form"
          >
            <div class="dashboard-settings__input-group">
              <label
                for="current-password"
                class="dashboard-settings__input-label"
              >
                {{ $t("components.dashboardSettings.account.currentPassword") }}
              </label>
              <input
                id="current-password"
                v-model="currentPassword"
                type="password"
                class="dashboard-settings__input"
                autocomplete="current-password"
                :placeholder="$t('components.dashboardSettings.account.currentPasswordPlaceholder')"
                required
              />
            </div>

            <div class="dashboard-settings__input-group">
              <label
                for="new-password"
                class="dashboard-settings__input-label"
              >
                {{ $t("components.dashboardSettings.account.newPassword") }}
              </label>
              <input
                id="new-password"
                v-model="newPassword"
                type="password"
                class="dashboard-settings__input"
                autocomplete="new-password"
                :placeholder="$t('components.dashboardSettings.account.newPasswordPlaceholder')"
                required
              />
            </div>

            <div class="dashboard-settings__input-group">
              <label
                for="confirm-password"
                class="dashboard-settings__input-label"
              >
                {{ $t("components.dashboardSettings.account.confirmPassword") }}
              </label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                class="dashboard-settings__input"
                autocomplete="new-password"
                :placeholder="$t('components.dashboardSettings.account.confirmPasswordPlaceholder')"
                required
              />
            </div>

            <button
              type="submit"
              class="dashboard-settings__button dashboard-settings__button--primary"
              :disabled="isSubmitting"
            >
              <Icon
                v-if="isSubmitting"
                name="mdi:loading"
                class="dashboard-settings__loading-icon"
              />
              <Icon
                v-else
                name="mdi:content-save"
              />
              {{
                isSubmitting
                  ? $t("components.dashboardSettings.account.saving")
                  : $t("components.dashboardSettings.account.savePassword")
              }}
            </button>
          </form>
        </div>
      </div>

      <!-- Theme Settings Card -->
      <div
        class="dashboard-settings__card"
        :class="{ 'dashboard-settings__card--active': activeSection === 'appearance' }"
      >
        <div class="dashboard-settings__card-header">
          <Icon
            name="mdi:palette-outline"
            class="dashboard-settings__card-icon"
          />
          <h3 class="dashboard-settings__card-title">
            {{ $t("components.dashboardSettings.appearance.title") }}
          </h3>
        </div>

        <div class="dashboard-settings__section">
          <h4 class="dashboard-settings__section-title">
            {{ $t("components.dashboardSettings.appearance.themeTitle") }}
          </h4>

          <!-- Theme selector -->
          <div class="dashboard-settings__theme-selector">
            <div
              v-for="theme in themeOptions"
              :key="theme.id"
              class="dashboard-settings__theme-option"
              :class="{ 'dashboard-settings__theme-option--active': currentTheme === theme.id }"
              @click="changeTheme(theme.id)"
            >
              <Icon
                :name="theme.icon"
                class="dashboard-settings__theme-icon"
              />
              <span class="dashboard-settings__theme-name">
                {{ $t(`components.dashboardSettings.appearance.${theme.id}Theme`) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "~/assets/styles/global/variables/card_styles" as *;

.dashboard-settings {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.3s;
  margin-bottom: 3rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  &--loaded {
    opacity: 1;
    transform: translateY(0);
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
        display: none;
      }
    }
  }

  &__container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    margin: 0 auto;
  }

  &__card {
    flex: 1;
    min-width: 300px;
    max-width: 450px;
    border-radius: $dark_card_border_radius;
    padding: 1.5rem;

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
      width: 100%;
      max-width: 100%;

      &--active {
        display: block;
      }
    }
  }

  &__card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
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
    font-size: 1.9rem;
    font-weight: 600;
    margin: 0;
    color: $color_text_primary;
  }

  &__section {
    margin-bottom: 1.2rem;
  }

  &__section-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 1.2rem 0;
    color: $color_text_primary;
  }

  &__password-form {
    max-width: 100%;
  }

  &__theme-selector {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  &__theme-option {
    flex: 1;
    max-width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border-radius: 0.8rem;
    gap: 0.8rem;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      }

      &--active {
        border-color: rgba(0, 114, 245, 0.5);
        background-color: rgba(0, 114, 245, 0.05);
      }
    }

    :root.dark-theme & {
      background-color: #080d11;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }

      &--active {
        border-color: rgba(0, 201, 114, 0.5);
        background-color: rgba(0, 201, 114, 0.05);
      }
    }

    @include mobile {
      flex: 1 1 100%;
    }
  }

  &__theme-icon {
    font-size: 2.2rem;
  }

  &__theme-name {
    font-size: 1.3rem;
  }

  &__language-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__language-option {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.2rem 1.6rem;
    border-radius: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;

    :root.light-theme & {
      background-color: white;

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }

      &--active {
        border-color: rgba(0, 114, 245, 0.5);
        background-color: rgba(0, 114, 245, 0.05);
      }
    }

    :root.dark-theme & {
      background-color: #080d11;

      &:hover {
        background-color: rgba(255, 255, 255, 0.02);
      }

      &--active {
        border-color: rgba(0, 201, 114, 0.5);
        background-color: rgba(0, 201, 114, 0.05);
      }
    }
  }

  &__language-flag {
    width: 3.2rem;
    height: 3.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__language-flag-icon {
    font-size: 2.4rem;
  }

  &__language-name {
    font-size: 1.5rem;
    font-weight: 500;
  }

  &__language-info {
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 0.6rem;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.03);
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }

  &__input-group {
    margin-bottom: 1.6rem;
  }

  &__input-label {
    display: block;
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 0.8rem;
    color: $color_text_primary;
  }

  &__input {
    width: 100%;
    padding: 1.2rem 1.6rem;
    border-radius: 0.8rem;
    font-size: 1.4rem;
    transition: all 0.2s ease;

    :root.light-theme & {
      border: 1px solid rgba(0, 0, 0, 0.1);
      background-color: white;
      color: $color_text_primary;

      &:focus {
        outline: none;
        border-color: rgba(0, 114, 245, 0.5);
        box-shadow: 0 0 0 3px rgba(0, 114, 245, 0.2);
      }
    }

    :root.dark-theme & {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #080d11;
      color: $color_text_primary;

      &:focus {
        outline: none;
        border-color: rgba(0, 201, 114, 0.5);
        box-shadow: 0 0 0 3px rgba(0, 201, 114, 0.2);
      }
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 1.2rem 2rem;
    border-radius: 0.8rem;
    font-size: 1.5rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &--primary {
      :root.light-theme & {
        background-color: rgba(0, 114, 245, 0.1);
        color: #0072f5;

        &:hover:not(:disabled) {
          background-color: rgba(0, 114, 245, 0.2);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      :root.dark-theme & {
        background-color: rgba(0, 201, 114, 0.1);
        color: #00c972;

        &:hover:not(:disabled) {
          background-color: rgba(0, 201, 114, 0.2);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }

  &__loading-icon {
    animation: spin 1s linear infinite;
  }

  &__alert {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.4rem 1.8rem;
    border-radius: 0.8rem;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    font-weight: 500;

    &--success {
      border-left: 4px solid #22c55e;

      :root.light-theme & {
        background-color: rgba(34, 197, 94, 0.15);
        color: #15803d;
      }

      :root.dark-theme & {
        background-color: rgba(34, 197, 94, 0.2);
        color: #4ade80;
      }
    }
  }

  &__alert-icon {
    font-size: 2.2rem;
    flex-shrink: 0;

    :root.light-theme & {
      &.mdi\:check-circle {
        color: #16a34a;
      }
    }

    :root.dark-theme & {
      &.mdi\:check-circle {
        color: #4ade80;
      }
    }
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
