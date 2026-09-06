export const styles = ['soft', 'bold', 'sharp'] as const

export type Style = (typeof styles)[number]
export type ResolvedStyle = Style

function isStyle(value: unknown): value is Style {
  return styles.includes(value as Style)
}

export function useStyle() {
  const preference = useCookie<Style>('style', {
    default: () => 'soft',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })
  const state = useState<Style>('style', () => isStyle(preference.value) ? preference.value : 'soft')

  const style = computed({
    get: () => state.value,
    set: (value: string) => {
      if (isStyle(value)) {
        state.value = value
        preference.value = value
      }
    },
  })
  const resolvedStyle = computed<ResolvedStyle>(() => style.value)

  return { style, resolvedStyle }
}
