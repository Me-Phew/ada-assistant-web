<script lang="ts" setup>
withDefaults(
  defineProps<{
    variant?: "left-primary" | "right-secondary";
    photoFront: string;
    photoFrontAlt: string;
    photoBack: string;
    photoBackAlt: string;
    title: string;
    description: string;
    quote: string;
    authorPhoto: string;
    authorPhotoAlt: string;
    authorDescription: string;
  }>(),
  {
    variant: "left-primary",
  },
);
</script>

<template>
  <section :class="['home-feature-quote', `home-feature-quote--${variant}`]">
    <div class="home-feature-quote__media">
      <img
        class="home-feature-quote__photo home-feature-quote__photo--back"
        :src="photoBack"
        :alt="photoBackAlt"
      />
      <img
        class="home-feature-quote__photo home-feature-quote__photo--front"
        :src="photoFront"
        :alt="photoFrontAlt"
      />
    </div>

    <div class="home-feature-quote__content">
      <p class="home-feature-quote__title">{{ title }}</p>
      <p class="home-feature-quote__description">
        {{ description }}
      </p>

      <p class="home-feature-quote__quote">
        {{ quote }}
      </p>

      <div class="home-feature-quote__author-wrapper">
        <img
          class="home-feature-quote__author-photo"
          :src="authorPhoto"
          :alt="authorPhotoAlt"
        />
        <p class="home-feature-quote__author-description">
          {{ authorDescription }}
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-feature-quote {
  $self: &;

  @include base-grid;

  min-height: 60rem;

  &--left-primary {
    background-color: $color_background_primary;
  }

  &--right-secondary {
    background-color: $color_background_secondary;
  }

  &__media {
    margin-top: 12rem;
    grid-column: 2/7;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    #{$self}--right-secondary & {
      grid-column: 7/12;
    }
  }

  &__photo {
    width: 40rem;
    border-radius: $corner_radius_large;

    &--front {
      position: absolute;
      top: 10%;
      left: 20%;
    }
  }

  &__content {
    margin-top: 16rem;
    grid-column: 7/11;

    #{$self}--right-secondary & {
      grid-row: 1;
      grid-column: 2/6;
    }
  }

  &__title {
    @include h3;
    color: $color_text_primary;
  }

  &__description {
    @include body-regular-1;

    margin-top: 1.6rem;
    color: $color_text_primary;
  }

  &__quote {
    @include body-regular-2;

    margin-top: 1.6rem;
    color: $color_text_secondary;
  }

  &__author-wrapper {
    margin-top: 1.6rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  &__author-photo {
    height: 3.2rem;
    border-radius: 50%;
  }

  &__author-description {
    @include body-regular-2;

    color: $color_text_secondary;
  }
}
</style>
