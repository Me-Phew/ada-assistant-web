<template>
  <header class="base-header">
    <NuxtLink
      class="base-header__link-home"
      to="/"
      ><BrandLogo
    /></NuxtLink>

    <nav class="base-header__navigation">
      <ul class="base-header__ul">
        <li class="base-header__li">
          <BaseLink
            to="/login"
            type="secondary"
            >{{ $t("components.baseHeader.login") }}</BaseLink
          >
        </li>

        <li class="base-header__li">
          <BaseButton to="/register">{{ $t("components.baseHeader.register") }}</BaseButton>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss">
.base-header {
  background-color: $color_background_primary;
  padding: 1.6rem 4.8rem;
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include mobile {
    padding: 1.6rem 2rem;
    height: auto;
    flex-direction: column;
    gap: 2rem;
  }

  @include tablet {
    padding: 1.6rem 3.2rem;
  }

  &__link-home {
    text-decoration: none;
  }

  &__navigation {
    display: flex;
    align-items: center;
  }

  &__ul {
    display: flex;
    align-items: center;
    gap: 2.4rem;

    @include mobile {
      width: 100%;
      justify-content: center;
      gap: 1.6rem;
    }
  }
}
</style>
