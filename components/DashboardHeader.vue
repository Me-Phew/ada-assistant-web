<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useLogout } from "~/composables/register";

defineProps<{
  showEffects: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-effects"): void;
}>();

interface Customer {
  id?: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

const customer = useState<Customer | null>("customer");
const router = useRouter();

const userDisplayName = computed(() => {
  if (!customer.value) return "";

  return customer.value.name || customer.value.email.split("@")[0];
});

const userInitials = computed(() => {
  if (!customer.value) return "";

  if (customer.value.name) {
    const nameParts = customer.value.name.split(" ");
    if (nameParts.length > 1) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    } else {
      return customer.value.name.substring(0, 2).toUpperCase();
    }
  }

  return customer.value.email.charAt(0).toUpperCase();
});

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

const showProfileMenu = ref(false);
const toggleProfileMenu = () => {
  showNotifications.value = false;
  showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = async () => {
  try {
    await useLogout();
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
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
        <Icon
          :name="showEffects ? 'mdi:eye-off' : 'mdi:eye'"
          class="dashboard-header__effects-icon"
        />
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
          @click="toggleNotifications"
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
              <div
                v-if="!notification.read"
                class="dashboard-header__notification-dot"
              ></div>
              <div class="dashboard-header__notification-content">
                <div class="dashboard-header__notification-message">{{ notification.message }}</div>
                <div class="dashboard-header__notification-time">{{ notification.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User profile -->
      <div class="dashboard-header__profile">
        <button
          class="dashboard-header__avatar"
          :class="{ 'dashboard-header__avatar--loaded': headerLoaded }"
          @click="toggleProfileMenu"
        >
          <img
            v-if="customer?.avatar"
            :src="customer.avatar"
            alt="User avatar"
            class="dashboard-header__avatar-image"
          />
          <span
            v-else
            class="dashboard-header__avatar-initials"
            >{{ userInitials }}</span
          >
        </button>

        <div
          v-if="showProfileMenu"
          class="dashboard-header__profile-dropdown"
        >
          <div class="dashboard-header__profile-header">
            <div class="dashboard-header__profile-avatar">
              <img
                v-if="customer?.avatar"
                :src="customer.avatar"
                alt="User avatar"
                class="dashboard-header__profile-avatar-image"
              />
              <span v-else>{{ userInitials }}</span>
            </div>
            <div class="dashboard-header__profile-info">
              <div class="dashboard-header__profile-name">{{ userDisplayName }}</div>
              <div class="dashboard-header__profile-email">{{ customer?.email }}</div>
            </div>
          </div>

          <ul class="dashboard-header__profile-menu">
            <li class="dashboard-header__profile-menu-item">
              <Icon
                name="mdi:account"
                class="dashboard-header__profile-menu-icon"
              />
              {{ $t("components.dashboardHeader.profile") }}
            </li>
            <li class="dashboard-header__profile-menu-item">
              <Icon
                name="mdi:cog"
                class="dashboard-header__profile-menu-icon"
              />
              {{ $t("components.dashboardHeader.settings") }}
            </li>
            <li
              class="dashboard-header__profile-menu-item"
              @click="handleLogout"
            >
              <Icon
                name="mdi:logout"
                class="dashboard-header__profile-menu-icon"
              />
              {{ $t("components.dashboardHeader.logout") }}
            </li>
          </ul>
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
      background-color: rgba(255, 255, 255, 0.8);
      color: #333;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: rgba(20, 29, 38, 0.7);
      color: #fff;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
      background-color: rgba(255, 255, 255, 0.8);
      color: #333;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: rgba(20, 29, 38, 0.7);
      color: #fff;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
  }

  &__notifications-dropdown {
    position: absolute;
    top: 4.5rem;
    right: 0;
    width: 32rem;
    max-height: 40rem;
    overflow-y: auto;
    border-radius: 1rem;
    z-index: 100;
    animation: slideDown 0.3s ease-out forwards;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    :root.light-theme & {
      background-color: white;
    }

    :root.dark-theme & {
      background-color: #1d2129;
    }

    @include mobile {
      width: 28rem;
      right: -10rem;
    }
  }

  &__notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    :root.dark-theme & {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__notifications-title {
    font-size: 1.6rem;
    font-weight: 600;
  }

  &__notifications-clear {
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    color: $color_primary;
  }

  &__notifications-list {
    padding: 1rem 0;
    max-height: 30rem;
    overflow-y: auto;
  }

  &__notification {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: background-color 0.2s;

    &:hover {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.03);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.03);
      }
    }
  }

  &__notification-dot {
    width: 0.8rem;
    height: 0.8rem;
    background-color: $color_primary;
    border-radius: 50%;
    margin-top: 0.6rem;
    animation: pulseNotification 2s infinite;
  }

  &__notification-content {
    flex: 1;
  }

  &__notification-message {
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
  }

  &__notification-time {
    font-size: 1.2rem;
    color: $color_text_secondary;
  }

  &__no-notifications {
    padding: 2rem;
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
    font-size: 1.6rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(-10px);
    transition-delay: 0.2s;

    :root.light-theme & {
      background-color: rgba(255, 255, 255, 0.8);
      color: #333;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: rgba(20, 29, 38, 0.7);
      color: #fff;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    &--loaded {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__avatar-initials {
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  &__profile-dropdown {
    position: absolute;
    top: 4.5rem;
    right: 0;
    width: 28rem;
    border-radius: 1rem;
    overflow: hidden;
    z-index: 100;
    animation: slideDown 0.3s ease-out forwards;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    :root.light-theme & {
      background-color: white;
    }

    :root.dark-theme & {
      background-color: #1d2129;
    }
  }

  &__profile-header {
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    :root.dark-theme & {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__profile-avatar {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    font-weight: 500;

    :root.light-theme & {
      background-color: #f5f5f5;
      color: #333;
    }

    :root.dark-theme & {
      background-color: #2c333f;
      color: #fff;
    }
  }

  &__profile-info {
    flex: 1;
  }

  &__profile-name {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  &__profile-email {
    font-size: 1.4rem;
    color: $color_text_secondary;
  }

  &__profile-menu {
    padding: 1rem 0;
  }

  &__profile-menu-item {
    padding: 1.2rem 2rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.03);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.03);
      }
    }
  }

  &__profile-menu-icon {
    font-size: 2rem;
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
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
