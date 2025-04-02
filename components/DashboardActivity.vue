<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  animationComplete: boolean;
}>();

interface ActivityItem {
  id: number;
  action: string;
  device: string;
  time: string;
  details: string;
  icon: string;
}

const activities = ref<ActivityItem[]>([
  {
    id: 1,
    action: "Rozpoczęcie rozmowy",
    device: "Ada Assistant",
    time: "3 min temu",
    details: "Zapytanie o pogodę",
    icon: "mdi:robot",
  },
  {
    id: 2,
    action: "Muzyka uruchomiona",
    device: "Spotify",
    time: "15 min temu",
    details: "Playlista: Discover Weekly",
    icon: "mdi:spotify",
  },
  {
    id: 3,
    action: "Dodano wydarzenie",
    device: "Google Calendar",
    time: "34 min temu",
    details: "Spotkanie zespołu: 14:00",
    icon: "mdi:calendar-plus",
  },
  {
    id: 4,
    action: "Zakończono rozmowę",
    device: "Ada Assistant",
    time: "1 godz. temu",
    details: "Trwała 4 min 23 sek.",
    icon: "mdi:robot-off",
  },
  {
    id: 5,
    action: "Zmieniono utwór",
    device: "Spotify",
    time: "2 godz. temu",
    details: "Arctic Monkeys - 505",
    icon: "mdi:music-note",
  },
]);
</script>

<template>
  <section
    class="dashboard-activity"
    :class="{ 'dashboard-activity--loaded': animationComplete }"
  >
    <div class="dashboard-activity__header">
      <h2 class="dashboard-activity__title">
        <Icon name="mdi:history" />
        {{ $t("components.dashboardActivity.title") }}
      </h2>
      <NuxtLink
        to="/activity"
        class="dashboard-activity__action"
      >
        {{ $t("components.dashboardActivity.viewAll") }}
      </NuxtLink>
    </div>

    <div class="dashboard-activity__list custom-scrollbar">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="dashboard-activity__item"
      >
        <div class="dashboard-activity__icon">
          <Icon :name="activity.icon" />
        </div>
        <div class="dashboard-activity__content">
          <div class="dashboard-activity__action-text">{{ activity.action }}</div>
          <div class="dashboard-activity__device-details">
            <span class="dashboard-activity__device">{{ activity.device }}</span>
            <span
              class="dashboard-activity__details"
              :title="activity.details"
              >{{ activity.details }}</span
            >
          </div>
        </div>
        <div class="dashboard-activity__time">{{ activity.time }}</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/card_styles" as *;

.dashboard-activity {
  border-radius: $dark_card_border_radius;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.1s;

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
    display: flex;
    align-items: center;
    padding: 1.2rem 2rem;
    border-bottom: 1px solid;
    height: 65px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
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

  &__content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  &__action-text {
    font-size: 1.5rem;
    font-weight: 500;
    color: $color_text_primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__device-details {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.3rem;
    color: $color_text_secondary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__device {
    flex-shrink: 0;
  }

  &__details {
    font-weight: 500;
    padding: 0.2rem 0.4rem;
    border-radius: 0.4rem;
    overflow: hidden;
    text-overflow: ellipsis;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  &__time {
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-left: 1.2rem;
    white-space: nowrap;
  }
}

.custom-scrollbar {
  /* WebKit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 6px;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    transition: background-color 0.3s ease;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.2);

      &:hover {
        background-color: rgba(0, 114, 245, 0.4);
      }
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.2);

      &:hover {
        background-color: rgba(0, 201, 114, 0.4);
      }
    }
  }

  /* Firefox */
  scrollbar-width: thin;

  :root.light-theme & {
    scrollbar-color: rgba(0, 114, 245, 0.2) transparent;
  }

  :root.dark-theme & {
    scrollbar-color: rgba(0, 201, 114, 0.2) transparent;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      :root.light-theme & {
        background-color: rgba(0, 114, 245, 0.3);
      }

      :root.dark-theme & {
        background-color: rgba(0, 201, 114, 0.3);
      }
    }
  }
}
</style>
