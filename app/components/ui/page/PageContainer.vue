<script setup lang="ts">
import { computed } from 'vue'

type PageSize = 'sm' | 'md' | 'lg' | 'xl' | 'narrow' | 'default' | 'wide' | 'wider' | 'full'

type PageGap = 'none' | 'sm' | 'md' | 'lg' | 'xl'

const sizeClasses: Record<PageSize, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  narrow: 'max-w-xl',
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
  wider: 'max-w-screen-2xl',
  full: 'max-w-none',
}

const gapClasses: Record<PageGap, string> = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const props = withDefaults(
  defineProps<{
    size?: PageSize
    gap?: PageGap
    centered?: boolean
  }>(),
  {
    size: 'default',
    gap: 'md',
    centered: false,
  },
)

const sizeClass = computed(() => sizeClasses[props.size])
const gapClass = computed(() => gapClasses[props.gap])
</script>

<template>
  <div :class="['mx-auto flex w-full flex-1 flex-col px-4 pb-6 md:px-6 lg:px-8', sizeClass, gapClass, centered && 'items-center justify-center']">
    <slot />
  </div>
</template>
