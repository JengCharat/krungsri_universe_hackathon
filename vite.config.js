import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0',     // ให้ฟังทุก IP
        port: 5173,          // หรือพอร์ตที่ต้องการ
        cors: true,          // อนุญาตให้ cross-origin
        https: false,
        hmr: {
            host: '192.168.10.116', // ใส่ IP เครื่องคุณ เช่น 192.168.1.10
        }
    },
});
