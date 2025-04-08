<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

defineProps<{
  showEffects: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-effects"): void;
}>();

const toggleEffects = () => {
  emit("toggle-effects");
};

const notifications = ref([
  { id: 1, message: "Nowe urządzenie zarejestrowane", time: "2 min temu", read: false },
  { id: 2, message: "Aktualizacja systemu dostępna", time: "1 godzina temu", read: false },
  { id: 3, message: "Kopia zapasowa zakończona", time: "5 godzin temu", read: true },
]);

const showNotifications = ref(false);
const toggleNotifications = () => {
  showProfileMenu.value = false;
  showNotifications.value = !showNotifications.value;
};

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const markAllRead = () => {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
};

const user = {
  name: "Admin",
  avatar: null,
  initials: "AD",
};

const showProfileMenu = ref(false);
const toggleProfileMenu = () => {
  showNotifications.value = false;
  showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = () => {
  console.log("Logging out...");
};

const closeAllDropdowns = () => {
  showNotifications.value = false;
  showProfileMenu.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
  const notificationsBtn = document.querySelector(".dashboard-header__notifications-button");
  const notificationsDropdown = document.querySelector(".dashboard-header__notifications-dropdown");
  const profileBtn = document.querySelector(".dashboard-header__avatar");
  const profileDropdown = document.querySelector(".dashboard-header__profile-dropdown");

  const clickedElement = event.target as HTMLElement;

  const isNotificationRelated =
    notificationsBtn?.contains(clickedElement) || notificationsDropdown?.contains(clickedElement);

  const isProfileRelated =
    profileBtn?.contains(clickedElement) || profileDropdown?.contains(clickedElement);

  if (!isNotificationRelated && !isProfileRelated) {
    closeAllDropdowns();
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const headerLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    headerLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div class="dashboard-header">
    <div class="dashboard-header__actions">
      <!-- Effects toggle button -->
      <button
        class="dashboard-header__effects-toggle"
        :class="{ 'dashboard-header__effects-toggle--loaded': headerLoaded }"
        @click="toggleEffects"
      >
        <Icon :name="showEffects ? 'mdi:sparkles' : 'mdi:sparkles-off'" />
        {{
          showEffects
            ? $t("components.dashboardHeader.hideEffects")
            : $t("components.dashboardHeader.showEffects")
        }}
      </button>

      <!-- Notifications -->
      <div class="dashboard-header__notifications">
        <button
          class="dashboard-header__notifications-button"
          :class="{ 'dashboard-header__notifications-button--loaded': headerLoaded }"
          @click.stop="toggleNotifications"
        >
          <Icon
            name="mdi:bell"
            class="dashboard-header__notifications-icon"
          />
          <span
            v-if="unreadCount > 0"
            class="dashboard-header__notifications-badge"
          >
            {{ unreadCount }}
          </span>
        </button>

        <div
          v-if="showNotifications"
          class="dashboard-header__notifications-dropdown"
          @click.stop
        >
          <div class="dashboard-header__notifications-header">
            <h3 class="dashboard-header__notifications-title">
              {{ $t("components.dashboardHeader.notifications") }}
            </h3>
            <button
              v-if="unreadCount > 0"
              class="dashboard-header__notifications-clear"
              @click="markAllRead"
            >
              {{ $t("components.dashboardHeader.markAllRead") }}
            </button>
          </div>

          <div class="dashboard-header__notifications-list">
            <div
              v-if="notifications.length === 0"
              class="dashboard-header__no-notifications"
            >
              {{ $t("components.dashboardHeader.noNotifications") }}
            </div>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="dashboard-header__notification"
            >
              <span
                v-if="!notification.read"
                class="dashboard-header__notification-dot"
              ></span>
              <div class="dashboard-header__notification-content">
                <p class="dashboard-header__notification-message">
                  {{ notification.message }}
                </p>
                <p class="dashboard-header__notification-time">
                  {{ notification.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile -->
      <div class="dashboard-header__profile">
        <button
          class="dashboard-header__avatar"
          :class="{ 'dashboard-header__avatar--loaded': headerLoaded }"
          @click.stop="toggleProfileMenu"
        >
          <img
            v-if="user.avatar"
            :src="user.avatar"
            alt="User avatar"
            class="dashboard-header__avatar-image"
          />
          <span v-else>{{ user.initials }}</span>
        </button>

        <div
          v-if="showProfileMenu"
          class="dashboard-header__profile-dropdown"
          @click.stop
        >
          <div class="dashboard-header__profile-header">
            <div class="dashboard-header__profile-avatar">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                alt="User avatar"
              />
              <span v-else>{{ user.initials }}</span>
            </div>
            <div class="dashboard-header__profile-info">
              <p class="dashboard-header__profile-name">{{ user.name }}</p>
            </div>
          </div>

          <div class="dashboard-header__profile-menu">
            <button
              class="dashboard-header__profile-menu-item"
              @click="$router.push('/profile')"
            >
              <Icon
                name="mdi:account"
                class="dashboard-header__profile-menu-icon"
              />
              {{ $t("components.dashboardHeader.profile") }}
            </button>
            <button
              class="dashboard-header__profile-menu-item"
              @click="$router.push('/settings')"
            >
              <Icon
                name="mdi:cog"
                class="dashboard-header__profile-menu-icon"
              />
              {{ $t("components.dashboardHeader.settings") }}
            </button>
            <button
              class="dashboard-header__profile-menu-item"
              @click="handleLogout"
            >
              <Icon
                name="mdi:logout"
                class="dashboard-header__profile-menu-icon"
              />
              {{ $t("components.dashboardHeader.logout") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "~/assets/styles/global/variables/card_styles" as *;

.dashboard-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.5rem 4rem;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  background-color: transparent;
  width: auto;
  height: 15rem;

  @include mobile {
    padding: 1.5rem 2rem;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  &__effects-toggle {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem 1.6rem;
    border-radius: 2rem;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(-10px);

    &--loaded {
      opacity: 1;
      transform: translateY(0);
    }

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

    &:active {
      transform: translateY(1px);
    }
  }

  &__notifications {
    position: relative;
  }

  &__notifications-button {
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(-10px);
    transition-delay: 0.1s;

    &--loaded {
      opacity: 1;
      transform: translateY(0);
    }

    :root.light-theme & {
      background-color: white;
      color: $color_text_primary;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

      &:hover {
        background-color: color.adjust(white, $lightness: -5%);
      }
    }

    :root.dark-theme & {
      background-color: #080d11;
      color: $color_text_primary;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);

      &:hover {
        background-color: color.adjust(#080d11, $lightness: 5%);
      }
    }
  }

  &__notifications-icon {
    font-size: 1.8rem;
  }

  &__notifications-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: #dc2626;
    color: white;
    border-radius: 50%;
    width: 1.8rem;
    height: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 500;
    animation: pulseNotification 2s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  &__notifications-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.8rem;
    width: 32rem;
    border-radius: 1rem;
    overflow: hidden;
    z-index: 100;
    animation: slideDown 0.2s ease-out forwards;

    @include mobile {
      width: 90vw;
      left: 50%;
      transform: translateX(-50%);
    }

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      background-color: #080d11;
      box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(0, 201, 114, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__notifications-header {
    padding: 1.6rem;
    border-bottom: 1px solid;
    display: flex;
    justify-content: space-between;
    align-items: center;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);
    }
  }

  &__notifications-title {
    font-size: 1.6rem;
    font-weight: 600;
    color: $color_text_primary;
  }

  &__notifications-clear {
    background: none;
    border: none;
    font-size: 1.3rem;
    color: $color_text_secondary;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
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

  &__notifications-list {
    max-height: 40rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.4rem;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.1);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.1);
      }
      border-radius: 0.2rem;
    }
  }

  &__notification {
    padding: 1.6rem;
    display: flex;
    align-items: flex-start;
    gap: 1.2rem;
    border-bottom: 1px solid;
    transition: background-color 0.2s ease;

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

    &:last-child {
      border-bottom: none;
    }
  }

  &__notification-dot {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #00c972;
    margin-top: 0.4rem;
  }

  &__notification-content {
    flex: 1;
  }

  &__notification-message {
    font-size: 1.4rem;
    color: $color_text_primary;
    margin-bottom: 0.4rem;
  }

  &__notification-time {
    font-size: 1.2rem;
    color: $color_text_secondary;
  }

  &__no-notifications {
    padding: 2.4rem 1.6rem;
    text-align: center;
    font-size: 1.4rem;
    color: $color_text_secondary;
  }

  &__profile {
    position: relative;
  }

  &__avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(-10px);
    transition-delay: 0.2s;

    &--loaded {
      opacity: 1;
      transform: translateY(0);
    }

    :root.light-theme & {
      background-color: white;
      color: $color_primary;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    :root.dark-theme & {
      background-color: #080d11;
      color: $color_primary;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }

    span {
      font-size: 1.6rem;
      font-weight: 500;
    }
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  &__profile-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.8rem;
    width: 24rem;
    border-radius: 1rem;
    overflow: hidden;
    z-index: 100;
    animation: slideDown 0.2s ease-out forwards;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      background-color: #080d11;
      box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(0, 201, 114, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__profile-header {
    padding: 1.6rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    border-bottom: 1px solid;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);
    }
  }

  &__profile-avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    span {
      font-size: 1.6rem;
      font-weight: 500;
    }
  }

  &__profile-info {
    flex: 1;
    overflow: hidden;
  }

  &__profile-name {
    font-size: 1.6rem;
    font-weight: 600;
    color: $color_text_primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__profile-menu {
    padding: 0.8rem 0;
  }

  &__profile-menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1.2rem 1.6rem;
    font-size: 1.4rem;
    color: $color_text_primary;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    gap: 1rem;
    transition: background-color 0.2s ease;

    &:hover {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.05);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__profile-menu-icon {
    font-size: 1.8rem;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseNotification {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(220, 38, 38, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  }
}
</style>
