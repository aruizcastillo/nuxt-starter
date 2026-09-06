<script setup lang="ts">
import type { Theme } from '~/composables/useTheme'
import { Eclipse, Sun, Moon } from '@lucide/vue'

const { t } = useI18n()
const { theme } = useTheme()
const themeIcons = { system: Eclipse, light: Sun, dark: Moon } satisfies Record<Theme, typeof Eclipse>
const themeIcon = computed(() => themeIcons[theme.value])
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
        :aria-label="t('common.theme')"
        v-bind="triggerProps"
      >
        <component
          :is="themeIcon"
          aria-hidden="true"
        />
        <span class="hidden sm:block">{{ t(`theme.${theme}`) }}</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent
      align="end"
      v-bind="contentProps"
    >
      <UiDropdownMenuLabel>{{ t('common.theme') }}</UiDropdownMenuLabel>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuRadioGroup v-model="theme">
        <UiDropdownMenuRadioItem
          v-for="item in themes"
          :key="item"
          :value="item"
        >
          <component
            :is="themeIcons[item]"
            aria-hidden="true"
          />
          {{ t(`theme.${item}`) }}
        </UiDropdownMenuRadioItem>
      </UiDropdownMenuRadioGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
