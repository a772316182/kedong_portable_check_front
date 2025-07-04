import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: {enabled: false},
    modules: [
        '@nuxt/content',
        '@nuxt/eslint',
        '@nuxt/icon',
        'nuxt-quasar-ui'
    ],
    quasar: {
        plugins: ["Notify", "Dialog"],
        lang: "zh-CN",
        extras: {
            animations: "all"
        },
        config: {
            brand: {
                primary: '#006a6a',
                secondary: '#1c6b43',
                accent: '#9C27B0',
                dark: '#1d1d1d',
                'dark-page': '#121212',
                positive: '#21BA45',
                negative: '#C10015',
                info: '#f1f1f1',
                warning: '#F2C037'
            }
        }
    }
})