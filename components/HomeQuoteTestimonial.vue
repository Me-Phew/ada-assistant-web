<template>
  <section class="home-quote-testimonial">
    <div class="home-quote-testimonial__content">
      <p class="home-quote-testimonial__quote">
        {{ $t("pages.home.quoteTestimonial.quote") }}
      </p>

      <img
        class="home-quote-testimonial__author-image"
        src="@/assets/img/ada_lovelace.png"
        alt=""
      />

      <p class="home-quote-testimonial__author-name">
        {{ $t("pages.home.quoteTestimonial.authorName") }}
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-quote-testimonial {
  @include base-grid;

  background-color: $color_background_variant;
  min-height: 33rem;

  &__content {
    margin-top: 10rem;
    grid-column: 3/11;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__quote {
    @include h3;

    text-align: center;
  }

  &__author-image {
    margin-top: 1.6rem;
    height: 6rem;
    border-radius: $corner_radius_small;
  }

  &__author-name {
    @include body-medium-3;

    margin-top: 2.4rem;
    color: $color_text_variant;
  }
}
</style>
