<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

withDefaults(
  defineProps<{
    type?: "primary" | "secondary";
    size?: "normal" | "medium" | "small";
    to?: RouteLocationRaw;
    hoverBg?: boolean;
  }>(),
  {
    type: "primary",
    size: "normal",
    to: undefined,
    hoverBg: false,
  },
);
</script>

<template>
  <NuxtLink
    :to="to"
    :class="[
      'base-link',
      `base-link--${type}`,
      `base-link--${size}`,
      { 'base-link--hover-bg': hoverBg },
    ]"
  >
    <slot />
  </NuxtLink>
</template>

<style lang="scss">
.base-link {
  $self: &;

  @include link-normal;

  cursor: pointer;
  color: $color_primary_tone_1;
  transition:
    background-color 0.3s,
    color 0.2s;
  text-decoration: none;

  &:focus {
    outline: 0.2rem solid $color_primary;
  }

  &--hover-bg:hover {
    background-color: $color_background_variant_tone_1;
  }

  &:hover {
    color: $color_primary;
  }

  &--secondary {
    color: $color_text_primary_tone_1;

    &:hover {
      color: $color_text_primary;
    }
  }

  &--medium {
    @include link-medium;
  }

  &--small {
    @include link-small;
  }
}
</style>
