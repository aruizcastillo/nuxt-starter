<script setup lang="ts">
import 'vue-sonner/style.css'

const { locale } = useI18n()

useHead(() => ({
  htmlAttrs: {
    'lang': locale.value,
    'data-theme': 'light',
    'style': { 'color-scheme': 'light' },
  },
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UiToaster position="top-center" />
</template>
