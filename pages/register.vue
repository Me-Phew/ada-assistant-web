<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
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
const router = useRouter();

definePageMeta({
  layout: "custom",
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  if (password.value !== confirmPassword.value) {
    error.value = "Hasła nie są identyczne";
    return;
  }

  if (!acceptTerms.value) {
    error.value = "Musisz zaakceptować warunki korzystania z serwisu";
    return;
  }

  isSubmitting.value = true;
  error.value = "";

  try {
    const user = await useRegister({
      email: email.value,
      password: password.value,
      name: email.value.split("@")[0],
    });

    if (user) {
      router.push("/dashboard");
    } else {
      error.value = "Nie udało się utworzyć konta";
    }
  } catch (err: any) {
    console.error("Registration error:", err);
    error.value = err?.data?.message || "Błąd podczas rejestracji";

    if (err?.data?.code === "EMAIL_EXISTS") {
      error.value = "Ten adres email jest już używany";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleGoogleRegister = () => {
  // Get base URL for API
  const baseURL = useUrl();
  // Redirect to Google OAuth endpoint
  window.location.href = `${baseURL}/auth/google`;
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
