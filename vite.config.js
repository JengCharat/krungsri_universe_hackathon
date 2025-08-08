import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css',
                'resource/js/app.jsx',
            ],
            refresh: true,
        }),
    ],
});
