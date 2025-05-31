<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUrl } from "~/composables/register";

definePageMeta({
  layout: "custom",
});

const status = ref<"loading" | "success" | "error">("loading");
const message = ref("Processing Spotify authentication...");

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error) {
      status.value = "error";
      message.value = `Authorization failed: ${error}`;
      return;
    }

    if (!code || !state) {
      status.value = "error";
      message.value = "Missing authorization parameters";
      return;
    }

    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    console.log("Sending callback data to backend", { code, state });

    await $fetch("/spotify/callback", {
      method: "POST",
      baseURL,
      body: { code, state },
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem("spotifyConnected", "true");

    status.value = "success";
    message.value = "Spotify connected successfully!";

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  } catch (err) {
    console.error("Spotify callback error:", err);
    status.value = "error";
    message.value = "Failed to complete Spotify authorization";
  }
});
</script>

<template>
  <div class="spotify-callback">
    <div class="spotify-callback__container">
      <div class="spotify-callback__logo">
        <Icon
          v-if="status === 'loading'"
          name="mdi:loading"
          class="spotify-callback__loading-icon"
        />
        <Icon
          v-else-if="status === 'success'"
          name="mdi:check-circle"
          class="spotify-callback__success-icon"
        />
        <Icon
          v-else
          name="mdi:alert-circle"
          class="spotify-callback__error-icon"
        />
      </div>
      <h1 class="spotify-callback__title">
        {{
          status === "loading"
            ? "Connecting to Spotify"
            : status === "success"
              ? "Connection Successful"
              : "Connection Failed"
        }}
      </h1>
      <p class="spotify-callback__message">{{ message }}</p>
      <NuxtLink
        to="/dashboard"
        class="spotify-callback__back-link"
      >
        Return to Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.spotify-callback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: $color_background_primary;

  &__container {
    text-align: center;
    padding: 3rem;
    border-radius: $corner_radius_large;
    max-width: 48rem;
    width: 90%;

    :root.light-theme & {
      background-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    :root.dark-theme & {
      background-color: black;
      box-shadow: 0 8px 30px black;
      backdrop-filter: blur(10px);
    }
  }

  &__logo {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    font-size: 6rem;
  }

  &__loading-icon {
    animation: spin 1.5s linear infinite;
    color: #1db954;
  }

  &__success-icon {
    color: #1db954;
  }

  &__error-icon {
    color: $color_error;
  }

  &__title {
    @include h3;
    margin-bottom: 1.5rem;
    color: $color_text_primary;
  }

  &__message {
    @include body-regular-1;
    color: $color_text_secondary;
    margin-bottom: 3rem;
  }

  &__back-link {
    @include button-medium;
    display: inline-block;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: $corner_radius_small;
    transition: all 0.3s ease;

    :root.light-theme & {
      background-color: #1db954;
      color: white;

      &:hover {
        background-color: darken(#1db954, 10%);
      }
    }

    :root.dark-theme & {
      background-color: #1db954;
      color: #0e131b;

      &:hover {
        background-color: darken(#1db954, 5%);
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
