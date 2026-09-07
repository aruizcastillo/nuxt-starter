<template>
  <div class="flex flex-col">
    <AppHeader class="pt-6 pb-[clamp(2rem,calc(13vw-5rem),4rem)]" />

    <main>
      <slot />
    </main>

    <AppFooter class="py-6 self-center" />
  </div>
</template>
