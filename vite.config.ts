import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import vueJsx from '@vitejs/plugin-vue-jsx'
import userConfig from './config'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003,
    host: '0.0.0.0',
    hmr: true,
    proxy: {
       '/chat': {
        target: 'http://127.0.0.1:8888', // 后端服务器地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/chat/, '')
      },
      '/api': {
        target: 'http://127.0.0.1:8888', // 后端服务器地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/msg_gateway': {
        target: 'http://127.0.0.1:8888', // 后端服务器地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/msg_gateway/, '')
      }
    // '/chat': 'http://127.0.0.1:10005',
    // '/api': 'http://127.0.0.1:10002',
    // '/msg_gateway': 'http://127.0.0.1:10006',
  },
  },
  define: {
    'process.env':
      process.env.NODE_ENV === 'production' ? userConfig.buildEnv : userConfig.devEnv,
  },
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dts: 'src/auto-import.d.ts',
    }),
    // visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@components': resolve(__dirname, 'src/components'),
      '@layout': resolve(__dirname, 'src/layout'),
      '@api': resolve(__dirname, 'src/api'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@store': resolve(__dirname, 'src/store'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@type': resolve(__dirname, 'src/type'),
    },
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules') && !id.includes('vant')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['vant'],
  },
})
