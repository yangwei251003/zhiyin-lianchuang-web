import type { Config } from "tailwindcss";

/**
 * 智印联创 Web 端主题配置 v2.0
 * 企业级视觉设计升级 · Industrial AI × CMYK Aesthetics × Cloud-Native
 * rpx → px 换算基线：1rpx ≈ 0.5px（375px 视口）
 */
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === 品牌主色（经济价值 / 蓝） ===
        primary: {
          DEFAULT: "#1E3A5F",
          light: "#274C77",
          lighter: "#DCE6F0",
          dark: "#16324F",
          deeper: "#102A43",
          bg: "#EEF3F8",
          "bg-subtle": "#F7F9FB",
        },
        // 深色蓝（辅助 / 强对比）
        deep: {
          DEFAULT: "#1E3A5F",
          darker: "#16324F",
        },
        // === 工业深色系（Industrial Dark System）===
        industrial: {
          bg:       "#061020",  // 深宇宙蓝黑 - Hero/Footer背景
          surface1: "#0D1A30",  // 一级面 - 暗色卡片
          surface2: "#152240",  // 二级面 - 悬浮层
          surface3: "#1D2E52",  // 三级面 - 弹出层
          border:   "#1E3A6B",  // 暗色边框
          glow:     "#2A6CDB",  // 发光色（品牌蓝）
          text:     "#CBD5E1",  // 暗色区文字
          muted:    "#64748B",  // 暗色区次要文字
        },
        // === CMYK 印刷行业美学色 ===
        cmyk: {
          cyan:    "#00B4D8",  // 品青 - 装饰用
          magenta: "#D62246",  // 品红 - 装饰用
          yellow:  "#F5C518",  // 品黄 - 装饰用
          key:     "#0D1117",  // 墨黑 - 深色背景
        },
        // === 数据可视化色（Data Colors）===
        data: {
          up:      "#10B981",  // 上涨绿
          down:    "#EF4444",  // 下跌红
          neutral: "#8B9CB6",  // 持平灰
          glow:    "rgba(42,108,219,0.2)", // 发光蓝
        },
        // === 三大价值色 ===
        economy: {
          DEFAULT: "#2A6CDB",
          light:   "#4A85E6",
          bg:      "#E8F1FB",
        },
        environment: {
          DEFAULT: "#047857",
          light:   "#059669",
          bg:      "#ECFDF5",
        },
        society: {
          DEFAULT: "#F08035",
          light:   "#F5A66B",
          bg:      "#FFF5ED",
        },
        // === 语义色 ===
        success: {
          DEFAULT: "#2BAE6E",
          light:   "#4ECB9E",
          bg:      "#EBF9F3",
        },
        warning: {
          DEFAULT: "#B45309",
          bg:      "#FFFBEB",
        },
        danger: {
          DEFAULT: "#E55541",
          bg:      "#FFF0EE",
        },
        accent: {
          DEFAULT:   "#D97706",
          light:     "#F59E0B",
          bg:        "#FFF7ED",
          "bg-subtle": "#FFFBEB",
        },
        // === 中性色（slate 风格，对齐 wxss）===
        ink: {
          primary:   "#1F2937",
          secondary: "#4B5563",
          tertiary:  "#6B7280",
          disabled:  "#CBD5E1",
        },
        canvas: {
          DEFAULT: "#FAFAF8",
          white:   "#FFFFFF",
          card:    "#FFFFFF",
        },
        line: {
          DEFAULT: "#E5E7EB",
          light:   "#F3F4F6",
          divider: "#E5E7EB",
        },
        // 山峦渐变色
        mountain: {
          1: "#7BCB9C",
          2: "#4ECB9E",
          3: "#2BAE6E",
        },
      },

      fontSize: {
        "2xs": ["11px", { lineHeight: "1.5" }],
        xs:    ["12px", { lineHeight: "1.5" }],
        sm:    ["13px", { lineHeight: "1.5" }],
        base:  ["14px", { lineHeight: "1.6" }],
        lg:    ["16px", { lineHeight: "1.6" }],
        xl:    ["18px", { lineHeight: "1.5" }],
        "2xl": ["22px", { lineHeight: "1.4" }],
        "3xl": ["28px", { lineHeight: "1.3" }],
        "4xl": ["36px", { lineHeight: "1.2" }],
        "5xl": ["48px", { lineHeight: "1.1" }],
        "6xl": ["60px", { lineHeight: "1.05" }],
        "7xl": ["72px", { lineHeight: "1.0" }],
        "8xl": ["96px", { lineHeight: "0.95" }],
      },

      spacing: {
        0.5:  "2px",
        1.5:  "6px",
        2.5:  "10px",
        3.5:  "14px",
        4.5:  "18px",
        18:   "18px",
        22:   "88px",
        26:   "104px",
        30:   "120px",
        88:   "352px",
        96:   "384px",
        120:  "480px",
        144:  "576px",
      },

      borderRadius: {
        "xs":    "3px",
        "sm":    "5px",
        "sm-md": "6px",
        "md":    "8px",
        "lg":    "12px",
        "xl":    "16px",
        "2xl":   "20px",
        "3xl":   "24px",
        "4xl":   "32px",
      },

      boxShadow: {
        // 基础阴影
        "xs":     "0 1px 2px rgba(15, 41, 92, 0.04)",
        "sm":     "0 1px 4px rgba(15, 41, 92, 0.06)",
        "md":     "0 2px 8px rgba(15, 41, 92, 0.08)",
        "lg":     "0 4px 16px rgba(15, 41, 92, 0.10)",
        "xl":     "0 6px 24px rgba(15, 41, 92, 0.12)",
        "2xl":    "0 12px 40px rgba(15, 41, 92, 0.16)",
        // 品牌色发光阴影
        "blue":   "0 4px 12px rgba(42, 108, 219, 0.25)",
        "blue-lg":"0 8px 32px rgba(42, 108, 219, 0.30)",
        "green":  "0 4px 12px rgba(43, 174, 110, 0.25)",
        "orange": "0 4px 12px rgba(240, 128, 53, 0.25)",
        // CMYK发光阴影
        "cyan":   "0 4px 20px rgba(0, 180, 216, 0.35)",
        "magenta":"0 4px 20px rgba(214, 34, 70, 0.30)",
        // 工业暗色阴影
        "industrial": "0 8px 32px rgba(6, 16, 32, 0.60)",
        "glow-blue":  "0 0 30px rgba(42, 108, 219, 0.40), 0 0 60px rgba(42, 108, 219, 0.20)",
        "glow-sm":    "0 0 12px rgba(42, 108, 219, 0.30)",
        // 玻璃拟态阴影
        "glass":  "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-sm":"0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
      },

      transitionTimingFunction: {
        "out-expo":  "cubic-bezier(0.19, 1, 0.22, 1)",
        "spring":    "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "in-back":   "cubic-bezier(0.36, 0, 0.66, -0.56)",
        "out-back":  "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "in-quart":  "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
        "out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
      },

      transitionDuration: {
        "fast":   "150ms",
        "base":   "250ms",
        "slow":   "400ms",
        "slower": "600ms",
        "slowest":"1000ms",
      },

      backgroundImage: {
        // 品牌渐变
        "primary-gradient":    "linear-gradient(135deg, #1A5CC8 0%, #2A6CDB 50%, #4A85E6 100%)",
        "economy-gradient":    "linear-gradient(135deg, #2A6CDB 0%, #4A85E6 100%)",
        "environment-gradient":"linear-gradient(135deg, #2BAE6E 0%, #4ECB9E 100%)",
        "society-gradient":    "linear-gradient(135deg, #F08035 0%, #F5A66B 100%)",
        // 工业深色渐变
        "industrial-gradient": "linear-gradient(135deg, #061020 0%, #0D1A30 50%, #152240 100%)",
        "hero-gradient":       "radial-gradient(ellipse at 50% 0%, #152240 0%, #0D1A30 40%, #061020 100%)",
        "hero-radial":         "radial-gradient(120% 100% at 50% 0%, #1A4A9C 0%, #0F172A 60%, #061020 100%)",
        // CMYK色谱条
        "cmyk-bar":            "linear-gradient(90deg, #00B4D8 0%, #D62246 33%, #F5C518 66%, #0D1117 100%)",
        "cmyk-bar-soft":       "linear-gradient(90deg, rgba(0,180,216,0.7) 0%, rgba(214,34,70,0.7) 33%, rgba(245,197,24,0.7) 66%, rgba(13,17,23,0.7) 100%)",
        // 天空渐变
        "sky":        "linear-gradient(180deg, #5A92E8 0%, #7BA6F0 35%, #A8C5F5 70%, #D6E5F8 100%)",
        "sky-light":  "linear-gradient(180deg, #B8D2F5 0%, #D6E5F8 40%, #ECF2FA 75%, #F5F9FE 100%)",
        "page":       "linear-gradient(180deg, #E8F1FB 0%, #F0F6FD 30%, #F5F9FE 60%, #F1F5F9 100%)",
        // 玻璃拟态渐变
        "glass-surface": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
        "glass-border":  "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
        // 网格纹理（通过 CSS 实现，此处为fallback）
        "grid-dark":  "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },

      fontFamily: {
        sans: [
          "Inter",
          "var(--font-inter)",
          "Noto Sans SC",
          "var(--font-noto-sc)",
          "-apple-system",
          "SF Pro Text",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "var(--font-jetbrains)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        display: [
          "Inter",
          "var(--font-inter)",
          "Noto Sans SC",
          "var(--font-noto-sc)",
          "sans-serif",
        ],
      },

      letterSpacing: {
        tightest: "-0.04em",
        tighter:  "-0.02em",
        tight:    "-0.01em",
        normal:   "0em",
        wide:     "0.01em",
        wider:    "0.05em",
        widest:   "0.1em",
      },

      lineHeight: {
        "display": "1.05",
        "heading": "1.2",
        "relaxed": "1.75",
      },

      animation: {
        "fade-in":      "fadeIn 0.6s ease-out forwards",
        "fade-in-up":   "fadeInUp 0.6s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "slide-in-left":"slideInLeft 0.5s ease-out forwards",
        "slide-in-right":"slideInRight 0.5s ease-out forwards",
        "float":        "float 6s ease-in-out infinite",
        "float-slow":   "float 10s ease-in-out infinite",
        "pulse-glow":   "pulseGlow 3s ease-in-out infinite",
        "spin-slow":    "spin 8s linear infinite",
        "shimmer":      "shimmer 2s linear infinite",
        "count-up":     "countUp 2s ease-out forwards",
        "grid-flow":    "gridFlow 20s linear infinite",
        "cmyk-slide":   "cmykSlide 8s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%":   { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-16px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":      { opacity: "0.8", transform: "scale(1.08)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gridFlow: {
          "0%":   { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
        cmykSlide: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
      },

      zIndex: {
        1:  "1",
        2:  "2",
        5:  "5",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [],
};

export default config;
