<template>
  <footer class="base-footer">
    <div class="base-footer__wrapper">
      <ul class="base-footer__ul">
        <li class="base-footer__li">
          <BaseLink
            type="secondary"
            size="small"
            >{{ $t("components.baseFooter.resources") }}</BaseLink
          >
        </li>

        <li class="base-footer__li">
          <BrandLogo />
        </li>

        <li class="base-footer__li">
          <BaseLink
            type="secondary"
            size="small"
            >GitHub</BaseLink
          >
        </li>
      </ul>

      <BaseSeparator class="base-footer__separator" />

      <p class="base-footer__designed-by">{{ $t("components.baseFooter.madeBy") }}</p>

      <ul class="base-footer__gh-links-ul">
        <li class="base-footer__gh-links-li">
          <NuxtLink>
            <Icon
              class="base-footer__gh-link-icon"
              name="mdi:github"
            />
          </NuxtLink>
        </li>

        <li class="base-footer__gh-links-li">
          <NuxtLink>
            <Icon
              class="base-footer__gh-link-icon"
              name="mdi:github"
            />
          </NuxtLink>
        </li>
      </ul>

      <p class="base-footer__privacy-tos">{{ $t("components.baseFooter.privacyTos") }}</p>
      <p class="base-footer__copyright">
        © {{ new Date().getFullYear() }} {{ $t("components.baseFooter.allRightsReserved") }}
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.base-footer {
  @include base-grid;

  min-height: 30rem;
  padding-bottom: 3rem;
  background-color: $color_background_primary;

  &__wrapper {
    margin-top: 8rem;
    grid-column: 3 / 11;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $color_text_primary;

    @include mobile {
      grid-column: 2/12;
      margin-top: 3rem;
      padding: 0 1rem;
    }
  }

  &__ul {
    display: flex;
    align-items: center;
    gap: 11.2rem;

    @include mobile {
      flex-direction: column;
      gap: 3rem;
    }

    @include tablet {
      gap: 5rem;
    }
  }

  &__separator {
    margin-top: 2rem;
    width: 100%;
  }

  &__designed-by {
    @include body-regular-3;

    margin-top: 2rem;
  }

  &__gh-links-ul {
    margin-top: 0.8rem;
    display: flex;
    gap: 0.8rem;
  }

  &__gh-link-icon {
    height: 3.2rem;
    width: 3.2rem;
  }

  &__privacy-tos {
    @include body-regular-3;
    margin-top: 1.6rem;

    @include mobile {
      text-align: center;
      width: 100%;
      padding: 0;
      white-space: normal;
      word-wrap: break-word;
      font-size: 1.2rem;
    }
  }

  &__copyright {
    @include body-regular-3;
    margin-top: 1rem;

    @include mobile {
      text-align: center;
      width: 100%;
      padding: 0;
      white-space: normal;
      word-wrap: break-word;
      font-size: 1.2rem;
    }
  }
}
</style>
