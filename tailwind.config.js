/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Space Galaxy Theme Colors
        'space-blue': '#0a0e27',      // Deep Space Blue (main background)
        'cosmic-purple': '#1a1535',   // Cosmic Purple (secondary background)
        'dark-void': '#0f0a1e',       // Dark Void (tertiary background)
        'violet-nebula': '#8b5cf6',   // Violet Nebula (primary accent)
        'light-purple': '#a78bfa',    // Light Purple (hover states, highlights)
        'cyan-star': '#06b6d4',       // Cyan Star (secondary accent, CTAs)
        'slate-text': '#94a3b8',      // Slate Text (secondary text)
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #1a1535 0%, #0a0e27 100%)',
        'text-gradient': 'linear-gradient(90deg, #a78bfa, #06b6d4)',
        'card-gradient': 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1))',
        'button-gradient': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.5)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.5)',
      },
    },
  },
  plugins: [],
}
