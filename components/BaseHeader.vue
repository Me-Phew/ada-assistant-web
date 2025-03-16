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
            >Zaloguj się</BaseLink
          >
        </li>

        <li class="base-header__li">
          <BaseButton to="/register">Utwórz konto</BaseButton>
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
  }
}
</style>
