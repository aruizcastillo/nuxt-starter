import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', 'shadcn-nuxt', '@nuxtjs/i18n'],

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Nuxt Starter',
      meta: [
        { name: 'description', content: 'An opinionated Nuxt starter.' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
      script: [
        {
          key: 'theme-init',
          tagPosition: 'head',
          tagPriority: 'critical',
          // The server exposes the validated cookie preference on <html>.
          innerHTML: `(() => {
            const root = document.documentElement
            if (root.dataset.themePreference !== 'system') return
            const dark = typeof window.matchMedia === 'function'
              && window.matchMedia('(prefers-color-scheme: dark)').matches
            const resolved = dark ? 'dark' : 'light'
            root.dataset.theme = resolved
            root.style.colorScheme = resolved
          })()`,
        },
      ],
    },
  },

  css: [
    '~/assets/styles/main.css',
  ],
  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es', name: 'Español', file: 'es.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
})
