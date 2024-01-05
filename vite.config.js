import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    server: {
      host: 'localhost',
      port: 8080, // 端口
      // proxy: {
      //   '/api': { // 请求接口中要替换的标识
      //     target: '', // 代理地址
      //     changeOrigin: true, // 是否允许跨域
      //     secure: true,
      //     rewrite: (path) => path.replace(/^\/api/, '') // api标志替换为''
      //   }
      // }
    },
    // 项目插件
    plugins: [
      vue(),
    ],
    // 基础配置
    base: './',
    publicDir: 'public',
    resolve: {
      alias: {
        '~@': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './frontend/src'),
        '@@': path.resolve(__dirname, './serve'),
      },
    },

    pluginOptions: {
      electronBuilder: {
        nodeIntegration: true,
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            '@border-color-base': '#dce3e8',
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: 'electron/dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      brotliSize: false,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境去除console及debug
          drop_console: false,
          drop_debugger: true,
        },
      },
    },
  }
})


