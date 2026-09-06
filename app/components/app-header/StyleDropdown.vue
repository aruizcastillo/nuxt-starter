<script setup lang="ts">
import { SwatchBook } from '@lucide/vue'

const { t } = useI18n()
const { style } = useStyle()
const { open, triggerProps, contentProps } = useHoverDropdown()
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
        :aria-label="t('common.style')"
        v-bind="triggerProps"
      >
        <SwatchBook aria-hidden="true" />
        <span class="hidden sm:block">{{ t(`style.${style}`) }}</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent
      align="end"
      v-bind="contentProps"
    >
      <UiDropdownMenuLabel>{{ t('common.style') }}</UiDropdownMenuLabel>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuRadioGroup v-model="style">
        <UiDropdownMenuRadioItem
          v-for="item in styles"
          :key="item"
          :value="item"
        >
          {{ t(`style.${item}`) }}
        </UiDropdownMenuRadioItem>
      </UiDropdownMenuRadioGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
