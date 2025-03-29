<script lang="ts" setup>
import { ref } from "vue";
import LoginContainer from "~/components/LoginContainer.vue";
import LoginPage from "~/components/LoginPage.vue";
import ResetPasswordForm from "~/components/ResetPasswordForm.vue";

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
  token.value = route.params.token as string;
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  error.value = "";
  isSuccess.value = false;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isSuccess.value = true;
  } catch (err) {
    error.value = "Nie udało się zresetować hasła";
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
