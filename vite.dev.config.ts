import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { generateCertificate, HOST } from './config/certificate';

const {
  cert: { key, cert },
} = await generateCertificate();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key,
      cert,
    },
    port: 443,
    host: HOST,
  },
});
