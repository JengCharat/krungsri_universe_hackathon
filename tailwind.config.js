import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
     content: [
            "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
            "./vendor/laravel/jetstream/**/*.blade.php",
            "./storage/framework/views/*.php",
            "./resources/views/**/*.blade.php",
            "./resources/views/**/*.blade.php", // <-- **ต้องเปิดใช้งานบรรทัดนี้**
            "./resources/js/**/*.{js,jsx,ts,tsx}", // <-- ปรับปรุงให้ครอบคลุมและกระชับขึ้น
            "./resources/js/**/*.vue",
        ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms, typography],
};
