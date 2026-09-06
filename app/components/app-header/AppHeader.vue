<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UiPageContainer size="wide">
    <header
      class="flex flex-row items-center gap-6"
      :aria-label="t('navigation.main')"
    >
      <div class="flex w-full flex-row items-center justify-between gap-2">
        <NuxtLink
          class="font-bold text-inherit no-underline"
          to="/"
          :aria-label="t('app.name')"
        >
          <AppLogo aria-hidden="true" />
        </NuxtLink>
        <div class="flex items-center gap-1">
          <AppHeaderStyleDropdown />
          <AppHeaderThemeDropdown />
          <AppHeaderLangDropdown />
        </div>
      </div>
    </header>
  </UiPageContainer>
</template>
