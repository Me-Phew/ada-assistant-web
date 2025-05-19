<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useUrl } from "~/composables/register";

const { t } = useI18n();

defineProps({
  animationComplete: {
    type: Boolean,
    default: false,
  },
});

const users = ref([]);
const showUserModal = ref(false);
const currentUser = ref(null);
const isLoading = ref(false);
const isAddingUser = ref(false);
const isDeleting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const newUser = ref({
  email: "",
  password: "",
  role: "user",
  verified: true,
});

const showDeleteConfirmModal = ref(false);
const userToDelete = ref(null);

const showToast = (message, isError = false) => {
  if (isError) {
    errorMessage.value = message;
    setTimeout(() => {
      errorMessage.value = "";
    }, 7000);
  } else {
    successMessage.value = message;
    setTimeout(() => {
      successMessage.value = "";
    }, 7000);
  }
};

const fetchUsers = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      showToast("No authentication token found. Please login again.", true);
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
  } catch (error) {
    console.error("Failed to fetch users:", error);
    showToast("Failed to load users. Please try again later.", true);
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

const openAddUserModal = () => {
  currentUser.value = null;
  newUser.value = {
    email: "",
    password: "",
    role: "user",
    verified: true,
  };
  showUserModal.value = true;
};

const openEditUserModal = (user) => {
  currentUser.value = user;
  newUser.value = {
    email: user.email,
    password: "",
    role: user.role,
    verified: user.verified !== false,
  };
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
};

const saveUser = async () => {
  if (isAddingUser.value) return;

  isAddingUser.value = true;
  errorMessage.value = "";

  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      showToast("No authentication token found. Please login again.", true);
      return;
    }

    const payload = {
      email: newUser.value.email,
      role: newUser.value.role,
      verified: newUser.value.verified,
    };

    if (!currentUser.value && newUser.value.password) {
      payload.password = newUser.value.password;
    }

    if (currentUser.value) {
      await $fetch(`/admin/users/${currentUser.value.id}`, {
        method: "PUT",
        baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      showToast("User updated successfully");
    } else {
      await $fetch("/admin/users", {
        method: "POST",
        baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      showToast("User created successfully");
    }

    await fetchUsers();
    closeUserModal();
  } catch (error) {
    console.error("Failed to save user:", error);

    let errorMsg = "Failed to save user. Please try again.";
    if (error.response) {
      try {
        const errorData = await error.response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        errorMsg = `Error: ${error.response.statusText || error.message}`;
      }
    }

    showToast(errorMsg, true);
  } finally {
    isAddingUser.value = false;
  }
};

const openDeleteConfirmModal = (user) => {
  userToDelete.value = user;
  showDeleteConfirmModal.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value || isDeleting.value) return;

  isDeleting.value = true;
  errorMessage.value = "";

  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      showToast("No authentication token found. Please login again.", true);
      return;
    }

    await $fetch(`/admin/users/${userToDelete.value.id}`, {
      method: "DELETE",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast(`User ${userToDelete.value.email} deleted successfully`);
    await fetchUsers();
  } catch (error) {
    console.error("Failed to delete user:", error);
    showToast("Failed to delete user. Please try again.", true);
  } finally {
    isDeleting.value = false;
    closeDeleteConfirmModal();
  }
};

const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false;
  userToDelete.value = null;
};

const promoteUser = async (user) => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      showToast("No authentication token found. Please login again.", true);
      return;
    }

    await $fetch(`/admin/users/${user.id}/promote`, {
      method: "PUT",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast(`${user.name || user.email} promoted to admin`);
    await fetchUsers();
  } catch (error) {
    console.error("Failed to promote user:", error);
    showToast("Failed to promote user. Please try again.", true);
  }
};

const demoteUser = async (user) => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      showToast("No authentication token found. Please login again.", true);
      return;
    }

    await $fetch(`/admin/users/${user.id}/demote`, {
      method: "PUT",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast(`${user.name || user.email} demoted to user`);
    await fetchUsers();
  } catch (error) {
    console.error("Failed to demote user:", error);
    showToast("Failed to demote user. Please try again.", true);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(() => {
  fetchUsers();
});

defineExpose({
  openAddUserModal,
});
</script>

<template>
  <div
    class="admin-dashboard-users"
    :class="{ 'admin-dashboard-users--loaded': animationComplete }"
  >
    <!-- Header section -->
    <div class="admin-dashboard-users__header">
      <h2 class="admin-dashboard-users__title">
        <Icon
          name="mdi:account-group"
          class="admin-dashboard-users__icon"
        />
        {{ $t("components.adminDashboardUsers.title") }}
      </h2>
      <button
        class="admin-dashboard-users__add-button"
        @click="openAddUserModal"
      >
        <Icon
          name="mdi:account-plus"
          class="admin-dashboard-users__add-icon"
        />
        {{ $t("components.adminDashboardUsers.addUser") }}
      </button>
    </div>

    <!-- Alert messages -->
    <div
      v-if="errorMessage"
      class="admin-dashboard-users__alert admin-dashboard-users__alert--error"
    >
      <Icon
        name="mdi:alert-circle"
        class="admin-dashboard-users__alert-icon"
      />
      {{ errorMessage }}
    </div>

    <div
      v-if="successMessage"
      class="admin-dashboard-users__alert admin-dashboard-users__alert--success"
    >
      <Icon
        name="mdi:check-circle"
        class="admin-dashboard-users__alert-icon"
      />
      {{ successMessage }}
    </div>

    <!-- Users data table -->
    <div class="admin-dashboard-users__card">
      <table class="admin-dashboard-users__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th class="admin-dashboard-users__actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading state -->
          <tr
            v-if="isLoading"
            class="admin-dashboard-users__loading-row"
          >
            <td
              colspan="6"
              class="admin-dashboard-users__loading-cell"
            >
              <div class="admin-dashboard-users__loading">
                <Icon
                  name="mdi:loading"
                  class="admin-dashboard-users__loading-icon"
                />
                Loading users...
              </div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr
            v-else-if="users.length === 0"
            class="admin-dashboard-users__empty-row"
          >
            <td
              colspan="6"
              class="admin-dashboard-users__empty-cell"
            >
              No users found. Click "Add User" to create one.
            </td>
          </tr>

          <!-- User rows -->
          <tr
            v-for="user in users"
            :key="user.id"
            class="admin-dashboard-users__table-row"
          >
            <td>{{ user.id.substring(0, 8) }}...</td>
            <td>{{ user.email }}</td>
            <td>
              <span
                class="admin-dashboard-users__role-badge"
                :class="{
                  'admin-dashboard-users__role-badge--admin': user.role === 'admin',
                }"
              >
                {{ user.role }}
              </span>
            </td>
            <td>
              <span
                class="admin-dashboard-users__status-badge"
                :class="`admin-dashboard-users__status-badge--${user.verified ? 'verified' : 'unverified'}`"
              >
                {{ user.verified ? "Verified" : "Unverified" }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td class="admin-dashboard-users__actions-cell">
              <div class="admin-dashboard-users__actions">
                <!-- Edit button -->
                <button
                  class="admin-dashboard-users__action-button"
                  @click="openEditUserModal(user)"
                  title="Edit user"
                >
                  <Icon
                    name="mdi:pencil"
                    class="admin-dashboard-users__action-icon"
                  />
                </button>

                <!-- Promote/Demote button -->
                <button
                  v-if="user.role === 'user'"
                  class="admin-dashboard-users__action-button admin-dashboard-users__action-button--promote"
                  @click="promoteUser(user)"
                  title="Promote to admin"
                >
                  <Icon
                    name="mdi:arrow-up-bold"
                    class="admin-dashboard-users__action-icon"
                  />
                </button>
                <button
                  v-else
                  class="admin-dashboard-users__action-button admin-dashboard-users__action-button--demote"
                  @click="demoteUser(user)"
                  title="Demote to user"
                >
                  <Icon
                    name="mdi:arrow-down-bold"
                    class="admin-dashboard-users__action-icon"
                  />
                </button>

                <!-- Delete button -->
                <button
                  class="admin-dashboard-users__action-button admin-dashboard-users__action-button--danger"
                  @click="openDeleteConfirmModal(user)"
                  :disabled="isDeleting"
                  title="Delete user"
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

    <!-- User add/edit modal -->
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
              {{ currentUser ? "Edit User" : "Add New User" }}
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
                <label class="admin-dashboard-users__form-label">Email</label>
                <input
                  v-model="newUser.email"
                  class="admin-dashboard-users__form-input"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div
                v-if="!currentUser"
                class="admin-dashboard-users__form-group"
              >
                <label class="admin-dashboard-users__form-label">Password</label>
                <input
                  v-model="newUser.password"
                  class="admin-dashboard-users__form-input"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div class="admin-dashboard-users__form-group">
                <label class="admin-dashboard-users__form-label">Role</label>
                <div class="admin-dashboard-users__select-wrapper">
                  <select
                    v-model="newUser.role"
                    class="admin-dashboard-users__form-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Icon
                    name="mdi:chevron-down"
                    class="admin-dashboard-users__select-icon"
                  />
                </div>
              </div>

              <div class="admin-dashboard-users__form-group">
                <label class="admin-dashboard-users__form-label">Verification Status</label>
                <div class="admin-dashboard-users__toggle-wrapper">
                  <label class="admin-dashboard-users__toggle">
                    <input
                      type="checkbox"
                      v-model="newUser.verified"
                    />
                    <span class="admin-dashboard-users__toggle-slider"></span>
                  </label>
                  <span class="admin-dashboard-users__toggle-label">
                    {{ newUser.verified ? "Verified" : "Unverified" }}
                  </span>
                </div>
              </div>

              <div class="admin-dashboard-users__form-actions">
                <button
                  type="button"
                  class="admin-dashboard-users__form-button admin-dashboard-users__form-button--secondary"
                  @click="closeUserModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="admin-dashboard-users__form-button"
                  :disabled="isAddingUser"
                >
                  <span v-if="!isAddingUser">
                    {{ currentUser ? "Save Changes" : "Add User" }}
                  </span>
                  <span
                    v-else
                    class="admin-dashboard-users__loading"
                  >
                    <Icon
                      name="mdi:loading"
                      class="admin-dashboard-users__loading-icon"
                    />
                    {{ currentUser ? "Saving..." : "Adding..." }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirmModal"
        class="admin-dashboard-users__modal-overlay"
        @click="closeDeleteConfirmModal"
      >
        <div
          class="admin-dashboard-users__modal admin-dashboard-users__modal--confirm"
          @click.stop
        >
          <div
            class="admin-dashboard-users__modal-header admin-dashboard-users__modal-header--warning"
          >
            <h2 class="admin-dashboard-users__modal-title">
              <Icon
                name="mdi:alert-circle"
                class="admin-dashboard-users__modal-icon"
              />
              Confirm Deletion
            </h2>
            <button
              class="admin-dashboard-users__modal-close"
              @click="closeDeleteConfirmModal"
            >
              <Icon
                name="mdi:close"
                class="admin-dashboard-users__modal-close-icon"
              />
            </button>
          </div>

          <div class="admin-dashboard-users__modal-body">
            <div class="admin-dashboard-users__warning-message">
              <p><strong>Warning:</strong> You are about to delete the following user:</p>
              <div class="admin-dashboard-users__user-info">
                <span class="admin-dashboard-users__user-email">{{ userToDelete?.email }}</span>
              </div>
              <p>
                This action cannot be undone. All data associated with this user account will be
                permanently removed.
              </p>
            </div>

            <div class="admin-dashboard-users__form-actions">
              <button
                type="button"
                class="admin-dashboard-users__form-button admin-dashboard-users__form-button--secondary"
                @click="closeDeleteConfirmModal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="admin-dashboard-users__form-button admin-dashboard-users__form-button--danger"
                :disabled="isDeleting"
                @click="confirmDelete"
              >
                <span v-if="!isDeleting">Delete User</span>
                <span
                  v-else
                  class="admin-dashboard-users__loading"
                >
                  <Icon
                    name="mdi:loading"
                    class="admin-dashboard-users__loading-icon"
                  />
                  Deleting...
                </span>
              </button>
            </div>
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

  &__alert {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 0.8rem;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    animation: fadeIn 0.3s ease-out;

    &--error {
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-left: 4px solid #ef4444;
    }

    &--success {
      background-color: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      border-left: 4px solid #22c55e;
    }
  }

  &__alert-icon {
    font-size: 2.2rem;
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

  &__status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 1.3rem;
    font-weight: 500;

    &--verified {
      background-color: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    &--unverified {
      background-color: rgba(234, 179, 8, 0.2);
      color: #eab308;
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

      &:hover:not(:disabled) {
        background-color: #0072f5;
        color: white;
      }

      &--danger {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover:not(:disabled) {
          background-color: #dc2626;
          color: white;
        }
      }

      &--promote {
        background-color: rgba(34, 197, 94, 0.1);
        color: #22c55e;

        &:hover:not(:disabled) {
          background-color: #22c55e;
          color: white;
        }
      }

      &--demote {
        background-color: rgba(234, 179, 8, 0.1);
        color: #eab308;

        &:hover:not(:disabled) {
          background-color: #eab308;
          color: white;
        }
      }
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;

      &:hover:not(:disabled) {
        background-color: #00c972;
        color: #0e131b;
      }

      &--danger {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover:not(:disabled) {
          background-color: #dc2626;
          color: white;
        }
      }

      &--promote {
        background-color: rgba(34, 197, 94, 0.1);
        color: #22c55e;

        &:hover:not(:disabled) {
          background-color: #22c55e;
          color: #0e131b;
        }
      }

      &--demote {
        background-color: rgba(234, 179, 8, 0.1);
        color: #eab308;

        &:hover:not(:disabled) {
          background-color: #eab308;
          color: #0e131b;
        }
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

  &__toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__toggle {
    position: relative;
    display: inline-block;
    width: 5rem;
    height: 2.6rem;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .admin-dashboard-users__toggle-slider {
        :root.light-theme & {
          background-color: #0072f5;
        }

        :root.dark-theme & {
          background-color: #00c972;
        }
      }

      &:checked + .admin-dashboard-users__toggle-slider:before {
        transform: translateX(2.4rem);
      }
    }
  }

  &__toggle-slider {
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
  }

  &__toggle-label {
    font-size: 1.4rem;
    color: $color_text_primary;
  }

  &__loading-row td {
    padding: 3rem 0;
  }

  &__loading-cell,
  &__empty-cell {
    text-align: center !important;
    padding: 4rem 2rem !important;
    color: $color_text_secondary;
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

    &--confirm {
      width: 460px;
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

    &--warning {
      :root.light-theme & {
        background-color: rgba(239, 68, 68, 0.1);
      }

      :root.dark-theme & {
        background-color: rgba(239, 68, 68, 0.15);
      }
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

  &__modal-icon {
    margin-right: 0.8rem;
    font-size: 2.2rem;

    :root.light-theme & {
      color: #dc2626;
    }

    :root.dark-theme & {
      color: #ef4444;
    }
  }

  &__modal-body {
    padding: 2rem;
  }

  &__warning-message {
    font-size: 1.5rem;
    line-height: 1.6;
    margin-bottom: 2rem;

    p {
      margin: 1rem 0;
    }
  }

  &__user-info {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    border-radius: 0.8rem;
    margin: 1.5rem 0;

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  &__user-email {
    font-weight: 600;
    word-break: break-all;

    :root.light-theme & {
      color: #dc2626;
    }

    :root.dark-theme & {
      color: #ef4444;
    }
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

      &--danger {
        background-color: #dc2626;

        &:hover:not(:disabled) {
          background-color: color.adjust(#dc2626, $lightness: -5%);
        }

        &:disabled {
          background-color: color.adjust(#dc2626, $lightness: 20%);
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

      &--danger {
        background-color: #ef4444;

        &:hover:not(:disabled) {
          background-color: color.adjust(#ef4444, $lightness: -5%);
        }

        &:disabled {
          background-color: color.adjust(#ef4444, $lightness: -20%);
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
