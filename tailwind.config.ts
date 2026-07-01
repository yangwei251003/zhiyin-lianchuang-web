import type { Config } from "tailwindcss";

/**
 * 智印联创 Web 端主题配置
 * 设计 Token 对齐 miniprogram/app.wxss v3.0
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
          DEFAULT: "#2A6CDB",
          light: "#4A85E6",
          lighter: "#7BA6F0",
          bg: "#E8F1FB",
          "bg-subtle": "#F5F9FE",
        },
        // 深色蓝（辅助 / 强对比）
        deep: {
          DEFAULT: "#1A4A9C",
          darker: "#0D2F6E",
        },
        // === 三大价值色 ===
        economy: {
          DEFAULT: "#2A6CDB",
          light: "#4A85E6",
          bg: "#E8F1FB",
        },
        environment: {
          DEFAULT: "#2BAE6E",
          light: "#4ECB9E",
          bg: "#EBF9F3",
        },
        society: {
          DEFAULT: "#F08035",
          light: "#F5A66B",
          bg: "#FFF5ED",
        },
        // === 语义色 ===
        success: {
          DEFAULT: "#2BAE6E",
          light: "#4ECB9E",
          bg: "#EBF9F3",
        },
        warning: {
          DEFAULT: "#F0A040",
          bg: "#FFF8ED",
        },
        danger: {
          DEFAULT: "#E55541",
          bg: "#FFF0EE",
        },
        accent: {
          DEFAULT: "#F08035",
          light: "#F5A66B",
          bg: "#FFF5ED",
          "bg-subtle": "#FEF9F5",
        },
        // === 中性色（slate 风格，对齐 wxss） ===
        ink: {
          primary: "#1E293B",
          secondary: "#64748B",
          tertiary: "#94A3B8",
          disabled: "#CBD5E1",
        },
        canvas: {
          DEFAULT: "#F1F5F9",
          white: "#FFFFFF",
          card: "#FFFFFF",
        },
        line: {
          DEFAULT: "#E2E8F0",
          light: "#F1F5F9",
          divider: "#E8EDF2",
        },
        // 山峦渐变色
        mountain: {
          1: "#7BCB9C",
          2: "#4ECB9E",
          3: "#2BAE6E",
        },
      },
      fontSize: {
        // 对齐 wxss --font-* (rpx/2 → px)
        "2xs": ["11px", { lineHeight: "1.5" }],
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["13px", { lineHeight: "1.5" }],
        base: ["14px", { lineHeight: "1.6" }],
        lg: ["16px", { lineHeight: "1.6" }],
        xl: ["18px", { lineHeight: "1.5" }],
        "2xl": ["22px", { lineHeight: "1.4" }],
        "3xl": ["28px", { lineHeight: "1.3" }],
        "4xl": ["36px", { lineHeight: "1.2" }],
      },
      spacing: {
        // 对齐 wxss --space-* (rpx/2 → px)
        0.5: "2px",
        1.5: "6px",
        2.5: "10px",
        3.5: "14px",
        4.5: "18px",
        18: "18px",
      },
      borderRadius: {
        // 对齐 wxss --radius-* (rpx/2 → px)
        "xs": "3px",
        "sm": "5px",
        "sm-md": "6px",
        "md": "8px",
        "lg": "12px",
        "xl": "16px",
      },
      boxShadow: {
        // 对齐 wxss --shadow-* (rpx/2 → px)
        "xs": "0 1px 2px rgba(15, 41, 92, 0.04)",
        "sm": "0 1px 4px rgba(15, 41, 92, 0.06)",
        "md": "0 2px 8px rgba(15, 41, 92, 0.08)",
        "lg": "0 4px 16px rgba(15, 41, 92, 0.10)",
        "xl": "0 6px 24px rgba(15, 41, 92, 0.12)",
        "blue": "0 4px 12px rgba(42, 108, 219, 0.20)",
        "green": "0 4px 12px rgba(43, 174, 110, 0.20)",
        "orange": "0 4px 12px rgba(240, 128, 53, 0.20)",
      },
      transitionTimingFunction: {
        // 对齐 wxss 动效曲线
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        // 对齐 wxss --transition-*
        "fast": "150ms",
        "base": "250ms",
        "slow": "400ms",
      },
      backgroundImage: {
        // 对齐 wxss 渐变
        "primary-gradient": "linear-gradient(135deg, #2A6CDB 0%, #4A85E6 100%)",
        "economy-gradient": "linear-gradient(135deg, #2A6CDB 0%, #4A85E6 100%)",
        "environment-gradient": "linear-gradient(135deg, #2BAE6E 0%, #4ECB9E 100%)",
        "society-gradient": "linear-gradient(135deg, #F08035 0%, #F5A66B 100%)",
        "sky": "linear-gradient(180deg, #5A92E8 0%, #7BA6F0 35%, #A8C5F5 70%, #D6E5F8 100%)",
        "sky-light": "linear-gradient(180deg, #B8D2F5 0%, #D6E5F8 40%, #ECF2FA 75%, #F5F9FE 100%)",
        "page": "linear-gradient(180deg, #E8F1FB 0%, #F0F6FD 30%, #F5F9FE 60%, #F1F5F9 100%)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "SF Pro Text",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
