<template>
  <section class="home-hero">
    <aside class="home-hero__text-wrapper">
      <h1 class="home-hero__title">{{ $t("pages.home.hero.title") }}</h1>

      <p class="home-hero__subtitle">{{ $t("pages.home.hero.subtitle") }}</p>

      <BaseButton class="home-hero__cta-button">{{ $t("pages.home.hero.cta") }}</BaseButton>
    </aside>
  </section>
</template>

<style lang="scss" scoped>
.home-hero {
  @include base-grid;

  min-height: 100vh;
  background-color: $color_background_primary;

  &__text-wrapper {
    margin-top: 12rem;
    grid-column: 2/5;
    color: $color_text_primary;

    @include tablet-and-below {
      grid-column: 2/12;
      margin-top: 8rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__title {
    @include h1;

    @include mobile {
      font-size: 3.6rem;
      line-height: 1.3;
    }
  }

  &__subtitle {
    @include body-regular-1;

    margin-top: 1.6rem;
  }

  &__cta-button {
    margin-top: 3.2rem;

    @include mobile {
      width: 100%;
      max-width: none;
    }
  }
}
</style>
