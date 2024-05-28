import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/admin/dashboard', // Đặt đường dẫn mặc định khi mở trên server
  },
});
