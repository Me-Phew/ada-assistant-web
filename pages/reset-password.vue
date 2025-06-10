<script lang="ts" setup>
import { ref } from "vue";
import LoginContainer from "~/components/LoginContainer.vue";
import LoginPage from "~/components/LoginPage.vue";
import ResetPasswordForm from "~/components/ResetPasswordForm.vue";
import { useUrl } from "~/composables/register";

const password = ref("");
const confirmPassword = ref("");
const isSubmitting = ref(false);
const error = ref("");
const isSuccess = ref(false);
const token = ref("");

definePageMeta({
  layout: "custom",
});

const route = useRoute();
onMounted(() => {
  token.value = (route.query.token as string) || (route.params.token as string);

  if (!token.value) {
    error.value =
      "Brak tokenu resetowania hasła. Upewnij się, że używasz poprawnego linku z emaila.";
  }
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  if (!token.value) {
    error.value =
      "Brak tokenu resetowania hasła. Upewnij się, że używasz poprawnego linku z emaila.";
    return;
  }

  isSubmitting.value = true;
  error.value = "";
  isSuccess.value = false;

  try {
    const baseURL = useUrl();

    await $fetch("/auth/reset-password", {
      method: "POST",
      body: {
        token: token.value,
        password: password.value,
      },
      baseURL,
    });

    isSuccess.value = true;
  } catch (err: any) {
    console.error("Password reset error:", err);

    if (err?.data?.message) {
      error.value = err.data.message;
    } else if (err?.message) {
      error.value = err.message;
    } else {
      error.value = "Nie udało się zresetować hasła. Spróbuj ponownie później.";
    }

    if (err?.status === 400) {
      error.value =
        "Nieprawidłowy token lub token wygasł. Poproś o nowy link do resetowania hasła.";
    } else if (err?.status === 404) {
      error.value = "Nie znaleziono użytkownika dla tego tokenu.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <LoginPage>
    <LoginContainer>
      <ResetPasswordForm
        :password="password"
        @update:password="password = $event"
        :confirm-password="confirmPassword"
        @update:confirm-password="confirmPassword = $event"
        :is-submitting="isSubmitting"
        :error="error"
        :is-success="isSuccess"
        @submit="handleSubmit"
      />
    </LoginContainer>
  </LoginPage>
</template>
