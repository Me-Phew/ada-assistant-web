<template>
  <div class="flying-lights-background">
    <div class="light light-1"></div>
    <div class="light light-2"></div>
    <div class="light light-3"></div>
    <div class="light light-4"></div>
    <div class="light light-5"></div>
    <div class="light light-6"></div>
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/light_effects" as *;

.flying-lights-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.light {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0;
  animation-name: float, pulse;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-duration: $light_float_duration, $light_pulse_duration;
  transform-origin: center center;

  // Light theme: blue lights
  :root.light-theme & {
    background: $light_theme_glow_color;
    box-shadow: 0 0 30px $light_theme_glow_shadow;
  }

  // Dark theme: green lights
  :root.dark-theme & {
    background: $dark_theme_glow_color;
    box-shadow: 0 0 30px $dark_theme_glow_shadow;
  }

  &-1 {
    width: 100px;
    height: 100px;
    top: 10%;
    left: 10%;
    animation-delay: 0s, 1s;
  }

  &-2 {
    width: 60px;
    height: 60px;
    top: 30%;
    left: 80%;
    animation-delay: 2s, 0s;
  }

  &-3 {
    width: 120px;
    height: 120px;
    top: 70%;
    left: 20%;
    animation-delay: 5s, 2s;
  }

  &-4 {
    width: 80px;
    height: 80px;
    top: 60%;
    left: 70%;
    animation-delay: 7s, 3s;
  }

  &-5 {
    width: 50px;
    height: 50px;
    top: 20%;
    left: 50%;
    animation-delay: 9s, 1.5s;
  }

  &-6 {
    width: 90px;
    height: 90px;
    top: 80%;
    left: 50%;
    animation-delay: 4s, 2.5s;
  }
}

.glow {
  position: absolute;
  border-radius: 50%;
  animation: pulse $glow_pulse_duration ease-in-out infinite alternate;

  // Light theme: blue glows
  :root.light-theme & {
    background: radial-gradient(
      circle,
      $light_theme_radial_inner 0%,
      $light_theme_radial_outer 70%
    );
  }

  // Dark theme: green glows
  :root.dark-theme & {
    background: radial-gradient(circle, $dark_theme_radial_inner 0%, $dark_theme_radial_outer 70%);
  }

  &-1 {
    width: 600px;
    height: 600px;
    top: -100px;
    left: -100px;
  }

  &-2 {
    width: 800px;
    height: 800px;
    bottom: -200px;
    right: -200px;
    animation-delay: 4s;
  }
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  25% {
    opacity: 0.8;
  }
  75% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-200px) translateX(100px);
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}
</style>
