const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

// Delete deprecated color names to suppress warning
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/templates/**/*.jinja"],
  theme: {
    colors: {
      ...colors,
      primary: colors.amber,
      transparent: 'transparent'
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      spacing: {
        header: '76px',
        footer: '236px',
        headerApp: '76px'
      },
      animation: {
        'spin-fast': 'spin 0.5s linear infinite'
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}

