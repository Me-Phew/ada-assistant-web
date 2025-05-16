<script lang="ts" setup>
import { ref } from "vue";
import LoginContainer from "~/components/LoginContainer.vue";
import LoginForm from "~/components/LoginForm.vue";
import LoginGoogleButton from "~/components/LoginGoogleButton.vue";
import LoginPage from "~/components/LoginPage.vue";
import LoginSeparator from "~/components/LoginSeparator.vue";
import { useLogin, useUrl } from "~/composables/register";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isSubmitting = ref(false);
const error = ref("");

definePageMeta({
  layout: "custom",
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  error.value = "";

  try {
    const user = await useLogin({
      email: email.value,
      password: password.value,
    });

    if (user) {
      navigateTo("/dashboard");
    } else {
      error.value = "Nieprawidłowy email lub hasło";
    }
  } catch (err: any) {
    console.error("Login error:", err);
    if (err?.data?.message) {
      error.value = err.data.message;
    } else if (err?.data?.error) {
      error.value = err.data.error;
    } else {
      error.value = "Nieprawidłowy email lub hasło";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleGoogleLogin = () => {
  // Get base URL for API
  const baseURL = useUrl();
  // Redirect to Google OAuth endpoint
  window.location.href = `${baseURL}/auth/google`;
};
</script>

<template>
  <LoginPage withHeader>
    <LoginContainer>
      <LoginForm
        :email="email"
        @update:email="email = $event"
        :password="password"
        @update:password="password = $event"
        :remember-me="rememberMe"
        @update:remember-me="rememberMe = $event"
        :is-submitting="isSubmitting"
        :error="error"
        @submit="handleSubmit"
      />
      <LoginSeparator />
      <LoginGoogleButton @click="handleGoogleLogin" />
    </LoginContainer>
  </LoginPage>
</template>
