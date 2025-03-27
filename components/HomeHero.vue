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
  }

  &__title {
    @include h1;
  }

  &__subtitle {
    @include body-regular-1;

    margin-top: 1.6rem;
  }

  &__cta-button {
    margin-top: 3.2rem;
  }
}
</style>
