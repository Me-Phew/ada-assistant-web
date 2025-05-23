<script lang="ts" setup>
import { ref } from "vue";
import ForgotPasswordForm from "~/components/ForgotPasswordForm.vue";
import LoginContainer from "~/components/LoginContainer.vue";
import LoginPage from "~/components/LoginPage.vue";
import { useUrl } from "~/composables/register";

const email = ref("");
const isSubmitting = ref(false);
const error = ref("");
const isSuccess = ref(false);

definePageMeta({
  layout: "custom",
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  error.value = "";
  isSuccess.value = false;

  try {
    const baseURL = useUrl();

    await $fetch("/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
      baseURL,
    });

    isSuccess.value = true;
  } catch (err: any) {
    console.error("Password reset request error:", err);

    if (err?.data?.message) {
      error.value = err.data.message;
    } else {
      error.value = "Nie udało się wysłać linku resetującego hasło";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <LoginPage>
    <LoginContainer>
      <ForgotPasswordForm
        :email="email"
        @update:email="email = $event"
        :is-submitting="isSubmitting"
        :error="error"
        :is-success="isSuccess"
        @submit="handleSubmit"
      />
    </LoginContainer>
  </LoginPage>
</template>
