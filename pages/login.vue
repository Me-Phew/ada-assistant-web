<script lang="ts" setup>
import { navigateTo } from "#app";
import { ref } from "vue";
import { useCustomer, useLogin, useUrl } from "~/composables/register";

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
    console.log("Logging in with:", email.value);
    const user = await useLogin({
      email: email.value,
      password: password.value,
    });

    console.log("Login response:", user ? "Success" : "Failed");

    if (user) {
      const customerState = useCustomer();
      customerState.value = user;

      localStorage.setItem("userRole", user.role || "user");
      localStorage.setItem("justLoggedIn", "true");

      if (user.role === "admin") {
        console.log("Admin user detected, navigating to /admin-dashboard via navigateTo()");
        return navigateTo("/admin-dashboard");
      } else {
        console.log("Regular user detected, navigating to /dashboard via navigateTo()");
        return navigateTo("/dashboard");
      }
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
  const baseURL = useUrl();
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
