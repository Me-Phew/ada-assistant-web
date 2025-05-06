<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  animationComplete: {
    type: Boolean,
    default: false,
  },
});

// Dane statystyk
const stats = [
  {
    id: "devices",
    title: t("components.adminDashboardOverview.stats.devices.title"),
    value: 12,
    label: t("components.adminDashboardOverview.stats.devices.label"),
    icon: "mdi:devices",
    colorClass: "devices",
  },
  {
    id: "users",
    title: t("components.adminDashboardOverview.stats.users.title"),
    value: 28,
    label: t("components.adminDashboardOverview.stats.users.label"),
    icon: "mdi:account-group",
    colorClass: "users",
  },
  {
    id: "activity",
    title: t("components.adminDashboardOverview.stats.activity.title"),
    value: 186,
    label: t("components.adminDashboardOverview.stats.activity.label"),
    icon: "mdi:chart-line",
    colorClass: "stats",
  },
  {
    id: "alerts",
    title: t("components.adminDashboardOverview.stats.alerts.title"),
    value: 2,
    label: t("components.adminDashboardOverview.stats.alerts.label"),
    icon: "mdi:alert-circle-outline",
    colorClass: "alerts",
  },
];

// Szybkie akcje
const quickActions = [
  {
    id: "register-device",
    title: t("components.adminDashboardOverview.quickActions.registerDevice"),
    icon: "mdi:plus-circle-outline",
    action: () => console.log("Register device"),
    colorClass: "theme-color",
  },
  {
    id: "add-user",
    title: t("components.adminDashboardOverview.quickActions.addUser"),
    icon: "mdi:account-plus",
    action: () => console.log("Add user"),
    colorClass: "theme-color",
  },
  {
    id: "update-firmware",
    title: t("components.adminDashboardOverview.quickActions.updateFirmware"),
    icon: "mdi:update",
    action: () => console.log("Update firmware"),
    colorClass: "theme-color",
  },
  {
    id: "system-backup",
    title: t("components.adminDashboardOverview.quickActions.systemBackup"),
    icon: "mdi:backup-restore",
    action: () => console.log("System backup"),
    colorClass: "theme-color",
  },
];

// Ostatnie aktywności
const recentActivities = [
  {
    id: 1,
    type: "device",
    action: "Zarejestrowano nowe urządzenie",
    user: "Admin",
    time: "2 minuty temu",
    icon: "mdi:devices",
  },
  {
    id: 2,
    type: "user",
    action: "Dodano nowego użytkownika",
    user: "Admin",
    time: "15 minut temu",
    icon: "mdi:account-plus",
  },
  {
    id: 3,
    type: "system",
    action: "Aktualizacja systemu",
    user: "System",
    time: "1 godzinę temu",
    icon: "mdi:update",
  },
  {
    id: 4,
    type: "alert",
    action: "Wykryto problem z urządzeniem ESP32-Living",
    user: "System",
    time: "3 godziny temu",
    icon: "mdi:alert",
  },
];
</script>

<template>
  <div
    class="admin-dashboard-overview"
    :class="{ 'admin-dashboard-overview--loaded': animationComplete }"
  >
    <!-- Statystyki -->
    <div class="admin-dashboard-overview__stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="admin-dashboard-overview__stats-card"
      >
        <div class="admin-dashboard-overview__stats-header">
          <div
            class="admin-dashboard-overview__stats-icon"
            :class="`admin-dashboard-overview__stats-icon--${stat.colorClass}`"
          >
            <Icon :name="stat.icon" />
          </div>
          <h3 class="admin-dashboard-overview__stats-title">{{ stat.title }}</h3>
        </div>
        <div class="admin-dashboard-overview__stats-value">{{ stat.value }}</div>
        <div class="admin-dashboard-overview__stats-label">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Dwa kolumny z akcjami i aktywnościami -->
    <div class="admin-dashboard-overview__two-columns">
      <!-- Szybkie akcje -->
      <div class="admin-dashboard-overview__quick-actions">
        <h3 class="admin-dashboard-overview__section-title">
          <Icon
            name="mdi:flash"
            class="admin-dashboard-overview__section-icon"
          />
          Szybkie akcje
        </h3>

        <div class="admin-dashboard-overview__quick-actions-grid">
          <button
            v-for="action in quickActions"
            :key="action.id"
            class="admin-dashboard-overview__quick-action"
            :class="`admin-dashboard-overview__quick-action--${action.colorClass}`"
          >
            <Icon
              :name="action.icon"
              class="admin-dashboard-overview__quick-action-icon"
            />
            <span class="admin-dashboard-overview__quick-action-title">{{ action.title }}</span>
          </button>
        </div>
      </div>

      <!-- Ostatnie aktywności -->
      <div class="admin-dashboard-overview__activities">
        <h3 class="admin-dashboard-overview__section-title">
          <Icon
            name="mdi:history"
            class="admin-dashboard-overview__section-icon"
          />
          Ostatnie aktywności
        </h3>

        <ul class="admin-dashboard-overview__activities-list custom-scrollbar">
          <li
            v-for="activity in recentActivities"
            :key="activity.id"
            class="admin-dashboard-overview__activity-item"
          >
            <div class="admin-dashboard-overview__activity-icon">
              <Icon :name="activity.icon" />
            </div>
            <div class="admin-dashboard-overview__activity-content">
              <div class="admin-dashboard-overview__activity-action">{{ activity.action }}</div>
              <div class="admin-dashboard-overview__activity-details">
                <div class="admin-dashboard-overview__activity-user">
                  <Icon
                    name="mdi:account"
                    class="admin-dashboard-overview__activity-user-icon"
                  />
                  {{ activity.user }}
                </div>
                <div class="admin-dashboard-overview__activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/card_styles" as *;

.admin-dashboard-overview {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.3s;

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  &__stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;

    @include mobile {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @include tablet {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__stats-card {
    border-radius: $dark_card_border_radius;
    padding: 2rem;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    :root.light-theme & {
      background-color: $light_card_bg;
      box-shadow: $light_card_shadow;

      &:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
    }

    :root.dark-theme & {
      background-color: $dark_card_bg;
      box-shadow: $dark_card_shadow;
      border: $dark_card_border;

      &:hover {
        box-shadow:
          0 12px 30px rgba(0, 0, 0, 0.3),
          $dark_card_glow;
      }
    }
  }

  &__stats-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__stats-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;

    &--devices {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;
    }

    &--users {
      background-color: rgba(132, 204, 22, 0.1);
      color: #84cc16;
    }

    &--stats {
      background-color: rgba(232, 121, 249, 0.1);
      color: #e879f9;
    }

    &--alerts {
      background-color: rgba(251, 113, 133, 0.1);
      color: #fb7185;
    }
  }

  &__stats-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
    color: $color_text_primary;
  }

  &__stats-value {
    font-size: 3.6rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5rem;

    :root.light-theme & {
      background: linear-gradient(45deg, #0072f5, #79b4ef);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    :root.dark-theme & {
      background: linear-gradient(45deg, #00c972, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__stats-label {
    font-size: 1.5rem;
    color: $color_text_secondary;
  }

  &__two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 2rem 0;
    color: $color_text_primary;
  }

  &__section-icon {
    font-size: 2.4rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__quick-actions {
    border-radius: $dark_card_border_radius;
    padding: 2rem;

    :root.light-theme & {
      background-color: $light_card_bg;
      box-shadow: $light_card_shadow;
    }

    :root.dark-theme & {
      background-color: $dark_card_bg;
      box-shadow: $dark_card_shadow, $dark_card_glow;
      border: $dark_card_border;
    }
  }

  &__quick-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__quick-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    border-radius: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;

    &--theme-color {
      :root.light-theme & {
        background-color: rgba(0, 114, 245, 0.1);
        color: #0072f5;

        &:hover {
          background-color: #0072f5;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 114, 245, 0.2);
        }
      }

      :root.dark-theme & {
        background-color: rgba(0, 201, 114, 0.1);
        color: #00c972;

        &:hover {
          background-color: #00c972;
          color: #0e131b;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 201, 114, 0.2);
        }
      }
    }
  }

  &__quick-action-icon {
    font-size: 3.2rem;
    margin-bottom: 1rem;
  }

  &__quick-action-title {
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
  }

  &__activities {
    border-radius: $dark_card_border_radius;
    padding: 2rem;

    :root.light-theme & {
      background-color: $light_card_bg;
      box-shadow: $light_card_shadow;
    }

    :root.dark-theme & {
      background-color: $dark_card_bg;
      box-shadow: $dark_card_shadow, $dark_card_glow;
      border: $dark_card_border;
    }
  }

  &__activities-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-height: 40rem;
    overflow-y: auto;
    padding-right: 0.8rem;
  }

  &__activity-item {
    display: flex;
    gap: 1.5rem;
    padding-bottom: 1.5rem;

    &:not(:last-child) {
      border-bottom: 1px solid;

      :root.light-theme & {
        border-color: rgba(0, 0, 0, 0.1);
      }

      :root.dark-theme & {
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__activity-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 2.2rem;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;
    }
  }

  &__activity-user-icon {
    font-size: 1.6rem;
    margin-right: 0.5rem;
  }

  &__activity-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  &__activity-action {
    font-size: 1.6rem;
    font-weight: 500;
    color: $color_text_primary;
  }

  &__activity-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.4rem;
    color: $color_text_secondary;
  }

  &__activity-user {
    display: flex;
    align-items: center;
  }

  &__activity-time {
    font-size: 1.3rem;
  }
}

.custom-scrollbar {
  /* WebKit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
  }

  /* Firefox */
  scrollbar-width: thin;

  :root.light-theme & {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }

  :root.dark-theme & {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
}
</style>
