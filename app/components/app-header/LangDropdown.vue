<script setup lang="ts">
import { Languages } from '@lucide/vue'

const { locale, locales, setLocale, t } = useI18n()
const { open, triggerProps, contentProps } = useHoverDropdown()

async function changeLocale(value: unknown) {
  const selected = locales.value.find(item => item.code === value)
  if (selected) await setLocale(selected.code)
}
</script>

<template>
  <UiDropdownMenu
    v-model:open="open"
    :modal="false"
  >
    <UiDropdownMenuTrigger as-child>
      <UiButton
        type="button"
        variant="ghost"
        class="flex items-center gap-2"
        :aria-label="t('common.language')"
        v-bind="triggerProps"
      >
        <Languages aria-hidden="true" />
        <span class="hidden sm:block">{{ t(`languages.${locale}`) }}</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent
      align="end"
      v-bind="contentProps"
    >
      <UiDropdownMenuLabel>{{ t('common.language') }}</UiDropdownMenuLabel>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuRadioGroup
        :model-value="locale"
        @update:model-value="changeLocale"
      >
        <UiDropdownMenuRadioItem
          v-for="item in locales"
          :key="item.code"
          :value="item.code"
        >
          {{ item.name }}
        </UiDropdownMenuRadioItem>
      </UiDropdownMenuRadioGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
