import plugin from "tailwindcss/plugin";

export default {
  darkMode: "class", // activa el mode fosc via classe .dark
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--background': '210 60% 95%',
          '--foreground': '215 30% 10%',
          '--primary': '220 85% 50%',
          '--primary-foreground': '0 0% 100%',
          '--card': '0 0% 100%',
          '--card-foreground': '215 20% 15%',
          '--muted': '0 0% 96.1%',
          '--muted-foreground': '0 0% 45.1%',
          '--border': '0 0% 89.8%',
          '--input': '0 0% 89.8%',
          '--ring': '0 0% 3.9%',
          '--radius': '0.5rem',
        },
        '.dark': {
          '--background': '0 0% 10%', /* aquest serà substituït pel gradient en CSS */
          '--foreground': '220 20% 95%',
          '--primary': '210 20% 75%',
          '--primary-foreground': '210 50% 10%',
          '--card': '220 40% 16%',
          '--card-foreground': '220 20% 98%',
          '--muted': '220 50% 20%',
          '--muted-foreground': '220 30% 70%',
          '--border': '0 0% 20%',
          '--input': '0 0% 25%',
          '--ring': '220 20% 50%',
        }
      });
    }),
  ],
};
