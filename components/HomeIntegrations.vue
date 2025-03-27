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

  min-height: 33rem;
  background-color: $color_background_variant;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    @include h3;

    margin-top: 10rem;
    grid-column: 4/10;
    color: $color_text_variant;
  }

  &__ul {
    display: flex;
    align-items: center;
    gap: 1.6rem;
  }

  &__icon {
    height: 9.6rem;
    width: 9.6rem;

    &--spotify {
      color: $spotify-green;
    }

    &--google-calendar {
      height: 7.6rem;
    }
  }
}
</style>
