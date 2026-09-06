let highestLayer = 50
let openDropdowns = 0
let resetLayerTimer: ReturnType<typeof setTimeout> | undefined

export function useHoverDropdown(delay = 120) {
  const isOpen = ref(false)
  const layer = ref(50)
  let interaction: 'hover' | 'explicit' = 'explicit'
  let suppressCloseAutoFocus = false
  let timer: ReturnType<typeof setTimeout> | undefined

  const cancelClose = () => {
    clearTimeout(timer)
    timer = undefined
  }

  const activateLayer = () => {
    clearTimeout(resetLayerTimer)
    openDropdowns += 1
    layer.value = ++highestLayer
  }

  const releaseLayer = () => {
    openDropdowns = Math.max(0, openDropdowns - 1)
    if (openDropdowns !== 0) return

    // Keep a closing animation above the base layer before resetting it.
    resetLayerTimer = setTimeout(() => {
      if (openDropdowns === 0) highestLayer = 50
    }, 200)
  }

  // All updates, including Reka's dismiss/select events, invalidate pending closes.
  const open = computed({
    get: () => isOpen.value,
    set: (value: boolean) => {
      const wasOpen = isOpen.value
      cancelClose()
      if (value && !wasOpen) suppressCloseAutoFocus = false
      if (!value) suppressCloseAutoFocus ||= interaction === 'hover'
      if (value && !wasOpen) activateLayer()
      if (!value && wasOpen) releaseLayer()
      isOpen.value = value
      if (!value) interaction = 'explicit'
    },
  })

  const enter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !import.meta.client
      || !window.matchMedia('(any-hover: hover)').matches) return

    cancelClose()
    if (!open.value) {
      interaction = 'hover'
      open.value = true
    }
  }

  const leave = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || interaction !== 'hover' || !open.value) return

    cancelClose()
    timer = setTimeout(() => {
      open.value = false
    }, delay)
  }

  const interact = () => {
    cancelClose()
    interaction = 'explicit'
  }

  const contentPointerDown = () => {
    // A pointer selection should not move focus back to the trigger on close.
    suppressCloseAutoFocus = true
    interact()
  }

  const focusContent = (event: Event) => {
    const id = (event.currentTarget as HTMLElement).getAttribute('aria-controls')
    if (id) document.getElementById(id)?.focus({ preventScroll: true })
  }

  const triggerClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.ctrlKey) return
    const wasHovered = open.value && interaction === 'hover'
    interact()
    if (wasHovered) {
      // Capture runs before Reka's toggle: the first click keeps a hovered menu open.
      event.preventDefault()
      event.stopImmediatePropagation()
      focusContent(event)
    }
  }

  const triggerKeydown = (event: KeyboardEvent) => {
    if (!['Enter', ' ', 'ArrowDown'].includes(event.key)) return
    const wasHovered = open.value && interaction === 'hover'
    interact()
    if (wasHovered) {
      event.preventDefault()
      event.stopImmediatePropagation()
      focusContent(event)
    }
  }

  const triggerProps = {
    onPointerenter: enter,
    onPointerleave: leave,
    onClickCapture: triggerClick,
    onKeydownCapture: triggerKeydown,
  }

  const contentProps = computed(() => ({
    onPointerenter: enter,
    onPointerleave: leave,
    onPointerdownCapture: contentPointerDown,
    onKeydownCapture: interact,
    style: { zIndex: layer.value },
    onOpenAutoFocus: (event: Event) => {
      if (interaction === 'hover') event.preventDefault()
    },
    onCloseAutoFocus: (event: Event) => {
      if (!suppressCloseAutoFocus) return
      suppressCloseAutoFocus = false
      event.preventDefault()
    },
  }))

  onScopeDispose(() => {
    cancelClose()
    if (isOpen.value) releaseLayer()
  })

  return { open, triggerProps, contentProps }
}
