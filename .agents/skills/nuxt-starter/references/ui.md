# UI, Tailwind, Forms Reference

## shadcn-vue

Inspect `components.json` before changing generated UI conventions.

Preserve configured aliases and generated paths.

Expected project conventions include:

```text
app/components/ui/
app/lib/utils.ts
```

Do not move `app/lib/utils.ts` to `app/utils/` merely because Nuxt offers an `utils/` directory.

## Reka UI

Use Reka documentation/skill when behavior depends on primitives, especially:

- `as-child`
- controlled/uncontrolled state
- portals
- focus management
- keyboard interaction
- dismissable layers
- dropdown/menu semantics
- dialogs/popovers/tooltips
- accessibility behavior

Do not approximate primitive accessibility manually.

Keep HTML semantics valid. Avoid nested interactive elements when `as-child` or an equivalent documented composition pattern exists.

## Tailwind CSS 4

The project uses Tailwind CSS 4 and `@tailwindcss/vite`.

Use current Tailwind 4 CSS-first patterns.

Do not introduce Tailwind 3-era defaults such as unnecessary `tailwind.config.js`, legacy PostCSS configuration, `autoprefixer`, or obsolete plugin patterns unless current docs explicitly require them.

## Forms

Forms use vee-validate + Zod 4.

Before implementing forms:

1. verify exact installed versions;
2. use current vee-validate docs;
3. use Zod 4 docs;
4. avoid Zod 3 examples unless confirmed compatible.

Client-side validation is for UX. Server-side validation is required for untrusted input.

Prefer reusable schemas when they genuinely improve correctness, but do not build a generic schema framework.
