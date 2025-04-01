<template>
  <section class="home-integrations">
    <p class="home-integrations__title">{{ $t("pages.home.integrations.title") }}</p>

    <ul class="home-integrations__ul">
      <li class="home-integrations__li">
        <NuxtLink
          external
          to="https://www.spotify.com"
          target="_blank"
        >
          <Icon
            class="home-integrations__icon home-integrations__icon--spotify"
            name="mdi:spotify"
          />
        </NuxtLink>
      </li>

      <li class="home-integrations__li">
        <NuxtLink
          external
          to="https://calendar.google.com"
          target="_blank"
        >
          <GoogleCalendarIcon
            class="home-integrations__icon home-integrations__icon--google-calendar"
          />
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.home-integrations {
  @include base-grid;

  $spotify-green: #1ed760;

  min-height: 20rem;
  background-color: $color_background_variant;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5rem;

  &__title {
    @include h3;

    margin-top: 5rem;
    grid-column: 4/10;
    color: $color_text_variant;
    text-align: center;

    @include mobile {
      grid-column: 2/12;
      font-size: 2.4rem;
      padding: 0 2rem;
    }
  }

  &__ul {
    display: flex;
    align-items: center;
    gap: 1.6rem;

    @include mobile {
      gap: 3rem;
    }
  }

  &__icon {
    height: 9.6rem;
    width: 9.6rem;

    @include mobile {
      height: 5.6rem;
      width: 5.6rem;
    }

    @media (max-width: 480px) {
      height: 4.8rem;
      width: 4.8rem;
    }

    &--spotify {
      color: $spotify-green;
    }

    &--google-calendar {
      height: 7.6rem;

      @include mobile {
        height: 4.6rem;
      }

      @media (max-width: 480px) {
        height: 4rem;
      }
    }
  }
}
</style>
