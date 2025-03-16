<template>
  <section class="home-hero">
    <aside class="home-hero__text-wrapper">
      <h1 class="home-hero__title">Asystent AI XXI wieku</h1>

      <p class="home-hero__subtitle">
        Asystent głosowy, który działa dla Ciebie, a nie na Ciebie. Bez śledzenia, bez zbędnego
        gromadzenia danych – pełna kontrola w Twoich rękach.
      </p>

      <BaseButton class="home-hero__buy-button">Kup teraz</BaseButton>
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

  &__buy-button {
    margin-top: 3.2rem;
  }
}
</style>
