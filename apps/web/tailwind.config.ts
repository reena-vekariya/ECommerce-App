import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: {
    preflight: false, // Disable Tailwind's reset to avoid conflicts with MUI
  },
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          navy: '#232F3E',
          light: '#FEBD69',
        },
      },
    },
  },
  plugins: [],
};

export default config;
