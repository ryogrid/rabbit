import tailwindForms from '@tailwindcss/forms';
import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // a color for primary actions like a submit button.
        primary: colors.purple['300'],
        'primary-disabled': colors.purple['200'],
        'sidebar-bg': colors.purple['100'],
      },
    },
  },
  plugins: [tailwindForms],
} satisfies Config;
