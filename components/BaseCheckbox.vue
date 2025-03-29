<script lang="ts" setup>
const _props = withDefaults(
  defineProps<{
    modelValue: boolean;
    label?: string;
    id?: string;
  }>(),
  {
    label: undefined,
    id: undefined,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>

<template>
  <div class="base-checkbox">
    <label class="base-checkbox__container">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        class="base-checkbox__input"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="base-checkbox__checkmark"></span>
      <span
        v-if="label"
        class="base-checkbox__label"
        >{{ label }}</span
      >
    </label>
  </div>
</template>

<style lang="scss" scoped>
.base-checkbox {
  margin-bottom: 1.6rem;

  &__container {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  &__input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;

    &:checked ~ .base-checkbox__checkmark:after {
      display: block;
    }

    &:focus ~ .base-checkbox__checkmark {
      box-shadow: 0 0 0 0.2rem $color_primary_tone_1;
    }
  }

  &__checkmark {
    height: 2rem;
    width: 2rem;
    border: 1px solid $color_background_secondary;
    border-radius: $corner_radius_small;
    background-color: transparent;
    flex-shrink: 0;

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 0.7rem;
      top: 0.4rem;
      width: 0.6rem;
      height: 1rem;
      border: solid $color_primary;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &__label {
    @include body-regular-2;
    margin-left: 0.8rem;
    color: $color_text_primary;
  }
}
</style>
