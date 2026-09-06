export const themes = ['system', 'light', 'dark'] as const

export type Theme = (typeof themes)[number]
export type ResolvedTheme = Exclude<Theme, 'system'>

function isTheme(value: unknown): value is Theme {
  return themes.includes(value as Theme)
}

export function useTheme() {
  const preference = useCookie<Theme>('theme', {
    default: () => 'system',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })
  const state = useState<Theme>('theme', () => isTheme(preference.value) ? preference.value : 'system')
  const systemTheme = useState<ResolvedTheme>('system-theme', () => 'light')

  const theme = computed({
    get: () => state.value,
    set: (value: string) => {
      if (isTheme(value)) {
        state.value = value
        preference.value = value
      }
    },
  })
  const resolvedTheme = computed<ResolvedTheme>(() => theme.value === 'system' ? systemTheme.value : theme.value)

  let mediaQuery: MediaQueryList | undefined
  const updateSystemTheme = () => {
    systemTheme.value = mediaQuery?.matches ? 'dark' : 'light'
  }

  // Match the early head script before useHead registers client attributes.
  if (import.meta.client && typeof window.matchMedia === 'function') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    updateSystemTheme()
  }

  onMounted(() => {
    mediaQuery?.addEventListener('change', updateSystemTheme)
  })

  onScopeDispose(() => {
    mediaQuery?.removeEventListener('change', updateSystemTheme)
  })

  return { theme, resolvedTheme }
}
