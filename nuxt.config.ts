import fs from 'node:fs'
import path from 'node:path'

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
    },
    hooks: {
        'nitro:build:before': (nitro) => {
            // 源目录：你的 .proto 文件所在的位置
            const srcDir = path.resolve('server/assets/protos')
            // 目标目录：构建后的服务器输出目录下的 'protos' 文件夹
            const dstDir = path.resolve(nitro.options.output.serverDir, 'protos')

            // 确保目标目录存在
            if (!fs.existsSync(dstDir)) {
                fs.mkdirSync(dstDir, {recursive: true})
            }

            // 读取源目录中的所有文件并复制
            fs.readdirSync(srcDir).forEach(file => {
                const srcFile = path.join(srcDir, file)
                const dstFile = path.join(dstDir, file)
                fs.copyFileSync(srcFile, dstFile)
                console.log(`Copied proto file: ${file} to ${dstDir}`)
            })
        }
    }
})