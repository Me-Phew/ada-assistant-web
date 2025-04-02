<template>
  <div class="dashboard-layout">
    <div class="dashboard-layout__content">
      <main class="dashboard-layout__main">
        <div class="dashboard-layout__main-inner">
          <slot />
        </div>
      </main>
      <LoginPageFooter variant="dashboard" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/light_effects" as *;

.dashboard-layout {
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  :root.light-theme & {
    background-color: #f5f7fa;
    background-image:
      radial-gradient(circle at 20% 35%, rgba(0, 114, 245, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 44%, rgba(0, 114, 245, 0.03) 0%, transparent 50%);
  }

  :root.dark-theme & {
    background-color: #0e131b;
    background-image:
      radial-gradient(circle at 20% 35%, rgba(0, 201, 114, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 44%, rgba(0, 201, 114, 0.03) 0%, transparent 50%);
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    position: relative;
    padding: 0 1rem;

    @include mobile {
      padding: 0 0.5rem;
    }
  }

  &__main {
    padding: 0;
    flex: 1;
    overflow-y: auto;
    position: relative;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
  }

  &__main-inner {
    position: relative;
    z-index: 1;
    border-radius: 2rem;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);

    :root.dark-theme & {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
