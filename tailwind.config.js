/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        verde: {
          DEFAULT: '#1a4a2e',
          medio: '#2d6e47',
          claro: '#e8f3ed',
          borde: '#b8d9c4',
        },
        dorado: {
          DEFAULT: '#c9952a',
          claro: '#fdf6e8',
        },
        gris: {
          fondo: '#f5f5f2',
          borde: '#e0deda',
          texto: '#6b6860',
        },
        negro: '#1c1c1a',
        rojo: '#c0392b',
        azul: {
          DEFAULT: '#1a5276',
          claro: '#e8f4fd',
        },
        cedula: {
          DEFAULT: '#f4ecf7',
          borde: '#d2b4de',
          texto: '#6c3483',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
