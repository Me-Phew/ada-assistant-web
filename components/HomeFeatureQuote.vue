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

  @include mobile {
    min-height: auto;
    padding-bottom: 5rem;
  }

  &--left-primary {
    background-color: $color_background_primary;
  }

  &--right-secondary {
    background-color: $color_background_variant;
  }

  &__media {
    margin-top: 12rem;
    grid-column: 2/7;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    #{$self}--right-secondary & {
      grid-column: 7/12;
    }

    @media (max-width: 1200px) {
      grid-column: 2/5;

      #{$self}--right-secondary & {
        grid-column: 8/12;
      }
    }

    @include tablet-and-below {
      grid-column: 3/11;
      margin-top: 5rem;
      height: auto;
      max-height: 40rem;
      display: flex;
      justify-content: center;
      margin-bottom: 4rem;

      #{$self}--right-secondary & {
        grid-column: 3/11;
        grid-row: 1;
      }
    }

    @include mobile {
      grid-column: 2/12;
      height: auto;
      max-height: 35rem;
      margin-top: 3rem;
      margin-bottom: 2rem;
    }
  }

  &__photo {
    width: 40rem;
    border-radius: $corner_radius_large;
    object-fit: cover;
    max-width: 100%;

    @media (max-width: 1200px) {
      width: 30rem;
    }

    @include tablet {
      width: 30rem;
    }

    @include mobile {
      width: 90%;
      max-width: 28rem;
    }

    &--back {
      @include tablet-and-below {
        display: none;
      }
    }

    &--front {
      position: absolute;
      top: 10%;
      left: 20%;
      z-index: 2;

      @media (max-width: 1200px) {
        top: 5%;
        left: 10%;
      }

      @include tablet-and-below {
        position: static;
        margin: 0 auto;
        display: block;
      }
    }
  }

  &__content {
    margin-top: 16rem;
    grid-column: 7/11;

    #{$self}--right-secondary & {
      grid-row: 1;
      grid-column: 2/6;
    }

    @media (max-width: 1200px) {
      grid-column: 6/12;
      margin-top: 14rem;

      #{$self}--right-secondary & {
        grid-column: 2/8;
      }
    }

    @include tablet-and-below {
      grid-column: 2/12;
      margin-top: 0;
      padding: 0 4rem 3rem;

      #{$self}--right-secondary & {
        grid-column: 2/12;
        grid-row: 2;
        margin-top: 0;
      }
    }

    @include mobile {
      grid-column: 2/12;
      padding: 0 2rem 3rem;
    }
  }

  &__title {
    @include h3;
    color: $color_text_primary;

    #{$self}--right-secondary & {
      color: $color_text_variant;
    }

    @include mobile {
      font-size: 2.4rem;
    }
  }

  &__description {
    @include body-regular-1;

    margin-top: 1.6rem;
    color: $color_text_primary;

    #{$self}--right-secondary & {
      color: $color_text_variant;
    }
  }

  &__quote {
    @include body-regular-2;

    margin-top: 1.6rem;
    color: $color_text_secondary;

    #{$self}--right-secondary & {
      color: $color_text_variant_tone_1;
    }
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

    #{$self}--right-secondary & {
      color: $color_text_variant_tone_1;
    }
  }
}
</style>
