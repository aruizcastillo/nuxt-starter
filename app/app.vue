<script setup lang="ts">
import 'vue-sonner/style.css'

const { locale } = useI18n()
const { theme, resolvedTheme } = useTheme()
const { resolvedStyle } = useStyle()

useHead(() => ({
  htmlAttrs: {
    'lang': locale.value,
    'data-theme-preference': theme.value,
    'data-theme': resolvedTheme.value,
    'data-style': resolvedStyle.value,
    'style': { 'color-scheme': resolvedTheme.value },
  },
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UiToaster position="top-center" />
</template>
