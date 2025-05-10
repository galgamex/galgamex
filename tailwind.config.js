// tailwind.config.js
import { nextui } from '@nextui-org/react'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // 添加常用宽高比设置
      aspectRatio: {
        '1/1': '1 / 1',
        '4/3': '4 / 3',
        '16/9': '16 / 9',
        '2/3': '2 / 3',
        '3/4': '3 / 4',
      },
    }
  },
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    purgeLayersByDefault: true,
  },
  // 减少未使用的CSS
  safelist: [
    // 为动态类名添加安全列表
    'text-primary',
    'text-success',
    'text-warning',
    'text-secondary',
    'bg-primary',
    'bg-success',
    'bg-warning',
    'bg-secondary',
  ],
  // 启用JIT模式
  mode: 'jit',
  // 配置插件
  plugins: [
    nextui({
      // 优化NextUI配置
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      layout: {
        spacingUnit: 4, // 4px
        disableAutoReset: true,
      },
      prefix: 'nextui', // 添加前缀避免冲突
    }),
    typography
  ]
}

export default config
