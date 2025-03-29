<script lang="ts" setup>
import { ref } from "vue";
import LoginContainer from "~/components/LoginContainer.vue";
import LoginForm from "~/components/LoginForm.vue";
import LoginGoogleButton from "~/components/LoginGoogleButton.vue";
import LoginPage from "~/components/LoginPage.vue";
import LoginSeparator from "~/components/LoginSeparator.vue";

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
    // Tu w przyszłości dodam logikę logowania
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    error.value = "Nieprawidłowy email lub hasło";
  } finally {
    isSubmitting.value = false;
  }
};

const handleGoogleLogin = () => {
  // Tutaj logika logowania przez Google
  console.log("Google login");
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
