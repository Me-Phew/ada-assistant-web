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
        class="base-input__eye-icon"
        :name="isPasswordVisible ? 'mdi:eye-off' : 'mdi:eye'"
        @click="togglePasswordVisibility"
        :title="
          isPasswordVisible
            ? $t('common.inputs.password.hidePassword')
            : $t('common.inputs.password.showPassword')
        "
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
    @include body-medium-2;
    display: block;
    margin-bottom: 0.8rem;
    color: $color_text_primary;
  }

  &__field-wrapper {
    position: relative;
    width: 100%;
  }

  &__field {
    width: 100%;
    height: 5.6rem;
    padding: 0 1.6rem;
    border: 1px solid $color_background_secondary;
    border-radius: $corner_radius_small;
    background-color: transparent;
    color: $color_text_primary;
    font-size: 1.6rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: $color_primary;
    }

    &--error {
      border-color: $color_error;
    }

    &::placeholder {
      color: $color_text_secondary_tone_1;
    }
  }

  &__eye-icon {
    position: absolute;
    top: 50%;
    right: 1.6rem;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    color: $color_text_secondary;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: $color_text_primary;
    }
  }

  &__error {
    @include body-regular-3;
    margin-top: 0.4rem;
    color: $color_error;
  }
}
</style>
