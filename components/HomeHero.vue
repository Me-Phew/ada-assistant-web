<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import ShapeChangingBall from "~/components/ShapeChangingBall.vue";

const { t } = useI18n();

const displayedText = ref("");
const typingInterval = ref<number | null>(null);
const typingSpeed = 50;
const cursorVisible = ref(true);

const fullText = computed(() => t("pages.home.hero.subtitle"));

const startCursorBlink = () => {
  setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 530);
};

const startTypingEffect = () => {
  let currentIndex = 0;

  const runTypingEffect = () => {
    if (currentIndex < fullText.value.length) {
      displayedText.value = fullText.value.substring(0, currentIndex + 1);
      currentIndex++;
    } else {
      if (typingInterval.value !== null) {
        clearInterval(typingInterval.value);
        typingInterval.value = null;
      }
    }
  };

  typingInterval.value = window.setInterval(runTypingEffect, typingSpeed);
};

onMounted(() => {
  startTypingEffect();
  startCursorBlink();
});

onUnmounted(() => {
  if (typingInterval.value !== null) {
    clearInterval(typingInterval.value);
  }
});
</script>

<template>
  <section class="home-hero">
    <aside class="home-hero__text-wrapper">
      <h1 class="home-hero__title">{{ $t("pages.home.hero.title") }}</h1>

      <div class="home-hero__subtitle-container">
        <p class="home-hero__subtitle">
          {{ displayedText
          }}<span
            class="typing-cursor"
            :class="{ 'cursor-visible': cursorVisible }"
            >|</span
          >
        </p>
      </div>

      <BaseButton class="home-hero__cta-button">{{ $t("pages.home.hero.cta") }}</BaseButton>
    </aside>

    <div class="home-hero__ball-wrapper">
      <ShapeChangingBall
        :size="260"
        :enableBounce="true"
        :bounceHeight="18"
        :bounceDuration="1800"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-hero {
  @include base-grid;

  min-height: 70vh;
  background-color: $color_background_primary;
  position: relative;

  &__text-wrapper {
    margin-top: 12rem;
    grid-column: 2/5;
    color: $color_text_primary;
    position: relative;

    @include tablet-and-below {
      grid-column: 2/12;
      margin-top: 8rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__ball-wrapper {
    grid-column: 6/10;
    margin-top: 16rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    @include tablet-and-below {
      display: none;
    }

    @include mobile {
      display: none;
    }
  }

  &__title {
    @include h1;

    @include mobile {
      font-size: 3.6rem;
      line-height: 1.3;
    }
  }

  &__subtitle-container {
    margin-top: 1.6rem;
    width: 100%;
    display: block;
    position: relative;
    height: auto;
    min-height: 4.2rem;
    overflow: visible;
    margin-bottom: 3rem;

    @include mobile {
      min-height: 6rem;
      margin-bottom: 6rem;
    }
  }

  &__subtitle {
    @include body-regular-1;
    max-width: 100%;
    display: block;
    word-wrap: break-word;
    position: relative;
  }

  &__cta-button {
    margin-top: 0;

    @include mobile {
      width: 100%;
      max-width: none;
    }
  }
}

.typing-cursor {
  display: inline;
  color: currentColor;
  font-weight: normal;
  opacity: 0;

  &.cursor-visible {
    opacity: 1;
  }
}
</style>
