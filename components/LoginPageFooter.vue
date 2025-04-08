<script lang="ts" setup>
import { onMounted, ref } from "vue";

defineProps({
  variant: {
    type: String,
    default: "login",
  },
});

const footerLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    footerLoaded.value = true;
  }, 800);
});
</script>

<template>
  <footer
    class="base-footer"
    :class="{ 'base-footer--loaded': footerLoaded }"
  >
    <div class="base-footer__wrapper">
      <ul class="base-footer__ul">
        <li class="base-footer__li base-footer__li--resources">
          <BaseLink
            type="secondary"
            size="small"
            >{{ $t("components.baseFooter.resources") }}</BaseLink
          >
        </li>

        <li class="base-footer__li base-footer__li--logo">
          <BrandLogo />
        </li>

        <li class="base-footer__li base-footer__li--github">
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
          <NuxtLink class="base-footer__gh-link">
            <Icon
              class="base-footer__gh-link-icon"
              name="mdi:github"
            />
          </NuxtLink>
        </li>

        <li class="base-footer__gh-links-li">
          <NuxtLink class="base-footer__gh-link">
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
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

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

  &__li {
    opacity: 0;
    transform: translateY(15px);
    transition:
      opacity 0.5s ease-out,
      transform 0.5s ease-out;

    &--resources {
      transition-delay: 0.2s;
    }

    &--logo {
      transition-delay: 0.3s;
    }

    &--github {
      transition-delay: 0.4s;
    }

    .base-footer--loaded & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__separator {
    margin-top: 2rem;
    width: 100%;
    opacity: 0;
    transform: scaleX(0.8);
    transition:
      opacity 0.5s ease-out 0.5s,
      transform 0.5s ease-out 0.5s;

    .base-footer--loaded & {
      opacity: 0.3;
      transform: scaleX(1);
    }
  }

  &__designed-by {
    @include body-regular-3;
    margin-top: 2rem;
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.5s ease-out 0.6s,
      transform 0.5s ease-out 0.6s;

    .base-footer--loaded & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__gh-links-ul {
    margin-top: 0.8rem;
    display: flex;
    gap: 0.8rem;
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.5s ease-out 0.7s,
      transform 0.5s ease-out 0.7s;

    .base-footer--loaded & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__gh-link {
    display: block;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  &__gh-link-icon {
    height: 3.2rem;
    width: 3.2rem;
    transition: color 0.3s ease;

    &:hover {
      color: $color_primary;
    }
  }

  &__privacy-tos {
    @include body-regular-3;
    margin-top: 1.6rem;
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.5s ease-out 0.8s,
      transform 0.5s ease-out 0.8s;

    .base-footer--loaded & {
      opacity: 1;
      transform: translateY(0);
    }

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
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.5s ease-out 0.9s,
      transform 0.5s ease-out 0.9s;

    .base-footer--loaded & {
      opacity: 1;
      transform: translateY(0);
    }

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
