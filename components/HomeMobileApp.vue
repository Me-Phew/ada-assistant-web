<template>
  <section class="home-mobile-app">
    <img
      class="home-mobile-app__photo"
      src="@/assets/img/mobile_app.png"
      alt="Aplikacja mobilna Ada"
    />

    <div class="home-mobile-app__content">
      <p class="home-mobile-app__title">{{ $t("pages.home.mobileApp.title") }}</p>
      <p class="home-mobile-app__description">
        {{ $t("pages.home.mobileApp.description") }}
      </p>
      <BaseButton
        class="home-mobile-app__cta-button"
        type="secondary"
        >{{ $t("pages.home.mobileApp.cta") }}</BaseButton
      >
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-mobile-app {
  @include base-grid;

  min-height: 40rem;
  background-color: $color_background_primary;
  padding-bottom: 5.6rem;

  &__photo {
    margin-top: 5.6rem;
    grid-column: 3/6;
  }

  &__content {
    margin-top: 17.6rem;
    display: flex;
    flex-direction: column;
    grid-column: 7/11;
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

  &__cta-button {
    margin-top: 1.6rem;
  }
}
</style>
