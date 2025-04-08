<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    type?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    autofocus?: boolean;
    error?: string;
  }>(),
  {
    label: undefined,
    type: "text",
    id: undefined,
    placeholder: "",
    required: false,
    autofocus: false,
    error: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isPasswordVisible = ref(false);

const inputType = computed(() => {
  if (props.type === "password") {
    return isPasswordVisible.value ? "text" : "password";
  }
  return props.type;
});

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
  <div class="base-input">
    <label
      v-if="label"
      :for="id"
      class="base-input__label"
      >{{ label }}</label
    >

    <div class="base-input__field-wrapper">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :autofocus="autofocus"
        class="base-input__field"
        :class="{ 'base-input__field--error': error }"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <Icon
        v-if="type === 'password'"
        :name="isPasswordVisible ? 'mdi:eye-off' : 'mdi:eye'"
        class="base-input__eye-icon"
        @click="togglePasswordVisibility"
      />
    </div>

    <p
      v-if="error"
      class="base-input__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.base-input {
  width: 100%;
  margin-bottom: 2rem;

  &__label {
    font-family: "Roboto", sans-serif;
    font-size: 1.6rem;
    line-height: 1.5;
    font-weight: 500;
    display: block;
    margin-bottom: 0.8rem;

    :root.light-theme & {
      color: #000000;
    }

    :root.dark-theme & {
      color: #ffffff;
    }
  }

  &__field-wrapper {
    position: relative;
    width: 100%;
  }

  &__field {
    width: 100%;
    height: 5.6rem;
    padding: 0 1.6rem;
    border-radius: 0.4rem;
    font-size: 1.6rem;
    transition: all 0.3s ease;

    :root.light-theme & {
      border: 1px solid rgba(0, 0, 0, 0.2);
      background-color: rgba(255, 255, 255, 0.8);
      color: #000000;

      &::placeholder {
        color: rgba(0, 0, 0, 0.4);
      }

      &:focus {
        outline: none;
        border-color: #0072f5;
        box-shadow: 0 0 0 3px rgba(0, 114, 245, 0.2);
        background-color: #ffffff;
      }

      &--error {
        border-color: #dc2626;
      }
    }

    :root.dark-theme & {
      border: 1px solid rgba(255, 255, 255, 0.12);
      background-color: rgba(255, 255, 255, 0.05);
      color: #ffffff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      &:focus {
        outline: none;
        border-color: #00c972;
        box-shadow: 0 0 0 3px rgba(0, 201, 114, 0.2);
        background-color: rgba(255, 255, 255, 0.07);
      }

      &--error {
        border-color: #dc2626;
      }
    }
  }

  &__eye-icon {
    position: absolute;
    top: 50%;
    right: 1.6rem;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    transition: color 0.3s;

    :root.light-theme & {
      color: rgba(0, 0, 0, 0.6);

      &:hover {
        color: #000000;
      }
    }

    :root.dark-theme & {
      color: rgba(255, 255, 255, 0.6);

      &:hover {
        color: #ffffff;
      }
    }
  }

  &__error {
    font-family: "Roboto", sans-serif;
    font-size: 1.4rem;
    line-height: 1.43;
    font-weight: 400;
    margin-top: 0.4rem;
    color: #dc2626;
  }
}
</style>
