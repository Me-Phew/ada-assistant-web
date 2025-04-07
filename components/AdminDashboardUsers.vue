<script setup lang="ts">
import { ref } from "vue";

defineProps({
  animationComplete: {
    type: Boolean,
    default: false,
  },
});

// Mock danych - użytkownicy
const users = ref([
  {
    id: 1,
    name: "Administrator",
    email: "admin@example.com",
    role: "Administrator",
    lastActive: "2 min temu",
  },
  {
    id: 2,
    name: "Jan Kowalski",
    email: "jan@example.com",
    role: "Użytkownik",
    lastActive: "1 dzień temu",
  },
  {
    id: 3,
    name: "Anna Nowak",
    email: "anna@example.com",
    role: "Użytkownik",
    lastActive: "3 godz. temu",
  },
]);

const showUserModal = ref(false);
const currentUser = ref(null);
const isAddingUser = ref(false);
const newUser = ref({
  name: "",
  email: "",
  password: "",
  role: "Użytkownik",
});

const openAddUserModal = () => {
  currentUser.value = null;
  newUser.value = {
    name: "",
    email: "",
    password: "",
    role: "Użytkownik",
  };
  showUserModal.value = true;
};

const openEditUserModal = (user) => {
  currentUser.value = user;
  newUser.value = {
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
  };
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
};

const saveUser = async () => {
  if (isAddingUser.value) return;

  isAddingUser.value = true;
  try {
    // Symulacja opóźnienia API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (currentUser.value) {
      const index = users.value.findIndex((u) => u.id === currentUser.value.id);
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          name: newUser.value.name,
          email: newUser.value.email,
          role: newUser.value.role,
        };
      }
    } else {
      const id = users.value.length + 1;
      users.value.push({
        id,
        name: newUser.value.name,
        email: newUser.value.email,
        role: newUser.value.role,
        lastActive: "Nigdy",
      });
    }

    closeUserModal();
  } finally {
    isAddingUser.value = false;
  }
};

const deleteUser = (id: number) => {
  users.value = users.value.filter((user) => user.id !== id);
};
</script>

<template>
  <div
    class="admin-dashboard-users"
    :class="{ 'admin-dashboard-users--loaded': animationComplete }"
  >
    <div class="admin-dashboard-users__header">
      <h2 class="admin-dashboard-users__title">
        <Icon
          name="mdi:account-group"
          class="admin-dashboard-users__icon"
        />
        Zarządzanie użytkownikami
      </h2>
      <button
        class="admin-dashboard-users__add-button"
        @click="openAddUserModal"
      >
        <Icon
          name="mdi:account-plus"
          class="admin-dashboard-users__add-icon"
        />
        Dodaj użytkownika
      </button>
    </div>

    <div class="admin-dashboard-users__card">
      <table class="admin-dashboard-users__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imię i nazwisko</th>
            <th>Email</th>
            <th>Rola</th>
            <th>Ostatnia aktywność</th>
            <th class="admin-dashboard-users__actions-header">Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="admin-dashboard-users__table-row"
          >
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span
                class="admin-dashboard-users__role-badge"
                :class="{
                  'admin-dashboard-users__role-badge--admin': user.role === 'Administrator',
                }"
              >
                {{ user.role }}
              </span>
            </td>
            <td>{{ user.lastActive }}</td>
            <td class="admin-dashboard-users__actions-cell">
              <div class="admin-dashboard-users__actions">
                <button
                  class="admin-dashboard-users__action-button"
                  @click="openEditUserModal(user)"
                >
                  <Icon
                    name="mdi:pencil"
                    class="admin-dashboard-users__action-icon"
                  />
                </button>
                <button
                  class="admin-dashboard-users__action-button admin-dashboard-users__action-button--danger"
                  @click="deleteUser(user.id)"
                >
                  <Icon
                    name="mdi:delete"
                    class="admin-dashboard-users__action-icon"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal dodawania/edycji użytkownika -->
    <Teleport to="body">
      <div
        v-if="showUserModal"
        class="admin-dashboard-users__modal-overlay"
        @click="closeUserModal"
      >
        <div
          class="admin-dashboard-users__modal"
          @click.stop
        >
          <div class="admin-dashboard-users__modal-header">
            <h2 class="admin-dashboard-users__modal-title">
              {{ currentUser ? "Edytuj użytkownika" : "Dodaj użytkownika" }}
            </h2>
            <button
              class="admin-dashboard-users__modal-close"
              @click="closeUserModal"
            >
              <Icon
                name="mdi:close"
                class="admin-dashboard-users__modal-close-icon"
              />
            </button>
          </div>

          <div class="admin-dashboard-users__modal-body">
            <form
              @submit.prevent="saveUser"
              class="admin-dashboard-users__form"
            >
              <div class="admin-dashboard-users__form-group">
                <label class="admin-dashboard-users__form-label">Imię i nazwisko</label>
                <input
                  v-model="newUser.name"
                  class="admin-dashboard-users__form-input"
                  type="text"
                  placeholder="Imię i nazwisko"
                  required
                />
              </div>

              <div class="admin-dashboard-users__form-group">
                <label class="admin-dashboard-users__form-label">Email</label>
                <input
                  v-model="newUser.email"
                  class="admin-dashboard-users__form-input"
                  type="email"
                  placeholder="Email użytkownika"
                  required
                />
              </div>

              <div
                class="admin-dashboard-users__form-group"
                v-if="!currentUser"
              >
                <label class="admin-dashboard-users__form-label">Hasło</label>
                <input
                  v-model="newUser.password"
                  class="admin-dashboard-users__form-input"
                  type="password"
                  placeholder="Hasło"
                  :required="!currentUser"
                />
              </div>

              <div class="admin-dashboard-users__form-group">
                <label class="admin-dashboard-users__form-label">Rola</label>
                <div class="admin-dashboard-users__select-wrapper">
                  <select
                    v-model="newUser.role"
                    class="admin-dashboard-users__form-select"
                  >
                    <option value="Użytkownik">Użytkownik</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                  <Icon
                    name="mdi:chevron-down"
                    class="admin-dashboard-users__select-icon"
                  />
                </div>
              </div>

              <div class="admin-dashboard-users__form-actions">
                <button
                  type="button"
                  class="admin-dashboard-users__form-button admin-dashboard-users__form-button--secondary"
                  @click="closeUserModal"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  class="admin-dashboard-users__form-button"
                  :disabled="isAddingUser"
                >
                  <span v-if="!isAddingUser">
                    {{ currentUser ? "Zapisz zmiany" : "Dodaj użytkownika" }}
                  </span>
                  <span
                    v-else
                    class="admin-dashboard-users__loading"
                  >
                    <Icon
                      name="mdi:loading"
                      class="admin-dashboard-users__loading-icon"
                    />
                    {{ currentUser ? "Zapisywanie..." : "Dodawanie..." }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "~/assets/styles/global/variables/card_styles" as *;

.admin-dashboard-users {
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

  &__icon {
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

  &__role-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 1.3rem;
    font-weight: 500;
    background-color: rgba(59, 130, 246, 0.2);
    color: #3b82f6;

    &--admin {
      background-color: rgba(139, 92, 246, 0.2);
      color: #8b5cf6;
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

  // Modal styles
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
