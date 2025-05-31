<script lang="ts" setup>
import { navigateTo } from "nuxt/app";
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
const registrationSuccess = ref(false);
const registeredEmail = ref("");
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

    registeredEmail.value = email.value;
    registrationSuccess.value = true;
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

const handleGotoLogin = () => {
  navigateTo("/login");
};

const handleGoogleRegister = () => {
  const baseURL = useUrl();
  window.location.href = `${baseURL}/auth/google`;
};
</script>

<template>
  <LoginPage>
    <template #before-content>
      <RegisterHeader />
    </template>

    <LoginContainer>
      <template v-if="!registrationSuccess">
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
      </template>

      <div
        v-else
        class="register-success"
      >
        <div class="register-success__icon">
          <Icon name="mdi:email-check" />
        </div>
        <h2 class="register-success__title">Rejestracja zakończona pomyślnie!</h2>
        <p class="register-success__message">
          Wysłaliśmy email z linkiem aktywacyjnym na adres <strong>{{ registeredEmail }}</strong
          >. Sprawdź swoją skrzynkę odbiorczą i kliknij w link, aby aktywować konto.
        </p>
        <p class="register-success__submessage">
          Jeśli email nie dotarł w ciągu kilku minut, sprawdź folder spam lub kosz.
        </p>
        <BaseButton
          class="register-success__button"
          @click="handleGotoLogin"
        >
          Przejdź do logowania
        </BaseButton>
      </div>
    </LoginContainer>
  </LoginPage>
</template>

<style lang="scss" scoped>
.register-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;

  &__icon {
    font-size: 6rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    animation: scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;

    :root.light-theme & {
      color: #0072f5;
      background-color: rgba(0, 114, 245, 0.1);
    }

    :root.dark-theme & {
      color: #00c972;
      background-color: rgba(0, 201, 114, 0.1);
    }
  }

  &__title {
    font-size: 2.4rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: $color_text_primary;
    animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.1s;
    opacity: 0;
  }

  &__message {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    color: $color_text_primary;
    line-height: 1.5;
    animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.2s;
    opacity: 0;

    strong {
      font-weight: 600;
    }
  }

  &__submessage {
    font-size: 1.4rem;
    color: $color_text_secondary;
    margin-bottom: 2.5rem;
    animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.3s;
    opacity: 0;
  }

  &__button {
    width: 100%;
    height: 5.6rem;
    min-width: 100% !important;
    max-width: 100% !important;
    margin-top: 1rem;
    animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.4s;
    opacity: 0;
    transition: all 0.3s ease;

    :root.light-theme & {
      background-color: #0072f5;
      color: #ffffff;

      &:hover {
        background-color: #0066df;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 114, 245, 0.3);
      }
    }

    :root.dark-theme & {
      background-color: #00c972;
      color: #0e131b;

      &:hover {
        background-color: #00d67b;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 201, 114, 0.3);
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
