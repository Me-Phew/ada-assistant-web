<script lang="ts" setup>
import { ref } from "vue";
import LoginContainer from "~/components/LoginContainer.vue";
import LoginGoogleButton from "~/components/LoginGoogleButton.vue";
import LoginPage from "~/components/LoginPage.vue";
import LoginSeparator from "~/components/LoginSeparator.vue";
import RegisterForm from "~/components/RegisterForm.vue";
import RegisterHeader from "~/components/RegisterHeader.vue";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const acceptTerms = ref(false);
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
    // Logika rejestracji
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    error.value = "Błąd podczas rejestracji";
  } finally {
    isSubmitting.value = false;
  }
};

const handleGoogleRegister = () => {
  // Logika rejestracji przez Google
  console.log("Google register");
};
</script>

<template>
  <LoginPage>
    <template #before-content>
      <RegisterHeader />
    </template>

    <LoginContainer>
      <RegisterForm
        :email="email"
        @update:email="email = $event"
        :password="password"
        @update:password="password = $event"
        :confirm-password="confirmPassword"
        @update:confirm-password="confirmPassword = $event"
        :accept-terms="acceptTerms"
        @update:accept-terms="acceptTerms = $event"
        :is-submitting="isSubmitting"
        :error="error"
        @submit="handleSubmit"
      />
      <LoginSeparator />
      <LoginGoogleButton @click="handleGoogleRegister" />
    </LoginContainer>
  </LoginPage>
</template>
