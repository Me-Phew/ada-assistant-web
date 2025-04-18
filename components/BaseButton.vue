<script lang="ts" setup>
import { resolveComponent } from "vue";
import type { RouteLocationRaw } from "vue-router";

const props = withDefaults(
  defineProps<{
    type?: "primary" | "secondary";
    size?: "normal" | "medium" | "small";
    icon?: string;
    to?: RouteLocationRaw;
  }>(),
  {
    type: "primary",
    size: "normal",
    icon: undefined,
    to: undefined,
  },
);

const NuxtLink = resolveComponent("NuxtLink");
const component = computed(() => (props.to ? NuxtLink : "button"));
</script>

<template>
  <component
    :is="component"
    :to="to"
    :class="[
      'base-button',
      `base-button--${type}`,
      `base-button--${size}`,
      {
        'base-button--icon': icon,
      },
    ]"
  >
    <component
      :is="icon"
      class="base-button__icon"
    />

    <slot v-if="!icon" />
  </component>
</template>

<style lang="scss">
.base-button {
  $self: &;

  @include button-normal;

  cursor: pointer;
  border: none;
  outline: none;
  height: 5.6rem;
  min-width: 19.2rem;
  max-width: fit-content;
  padding: 1.6rem 2.4rem;
  border-radius: 0.6rem;
  color: $color_text_variant;
  text-decoration: none;
  transition: background-color 0.3s;

  @include mobile {
    min-width: auto;
    height: 4.8rem;
    padding: 1.2rem 1.8rem;
    font-size: 1.6rem;
  }

  &:focus {
    outline: 0.2rem solid $color_primary;
  }

  &:hover {
    background-color: $color_background_variant_tone_1;

    &#{$self}--secondary {
      background-color: $color_background_variant_tone_2;
    }
  }

  &--primary {
    background-color: $color_background_variant;
  }

  &--secondary {
    border: 1px solid $color_background_variant;

    background-color: $color_background_primary;
    color: $color_text_primary;
  }

  &--medium {
    min-width: 16rem;
    height: 4.8rem;

    @include mobile {
      min-width: auto;
    }
  }

  &--small {
    min-width: 12.8rem;
    height: 4rem;
    padding: 0.8rem 2.1rem;

    @include mobile {
      min-width: auto;
      padding: 0.8rem 1.6rem;
    }
  }

  &--icon {
    width: auto;
    padding: 0.7rem 1.6rem;

    &#{$self}--round {
      padding: 0.4rem;
      border-radius: 9999px;

      #{$self}__icon {
        flex: 0 0 2rem;
        width: 2rem;
        height: 2rem;
      }
    }
  }

  &__icon {
    flex: 0 0 2.6rem;
    width: 2.6rem;
    height: 2.6rem;
  }
}
</style>
