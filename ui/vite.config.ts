import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import federation from '@originjs/vite-plugin-federation';

import dns from 'dns';
import tsconfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim')
// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const imsBaseUrl = `${process.env.VITE_IMS_URL}`;
  const snomioBaseUrl = `${process.env.VITE_SNOMIO_URL}`;
  const apUrl = `${process.env.VITE_AP_URL}`;
  const snowstormUrl = `${process.env.VITE_SNOWSTORM_URL}`;
  const sergio = `${process.env.VITE_SERGIO_UI_URL}`;

  return defineConfig({
    plugins: [
      react(),
      basicSsl(),
      federation({
        name: 'snomio',
        remotes: [
          {
            sergio: {
              external: `${sergio}`,
              from: 'vite',
              externalType: 'url'
            },
          },

        ],
        shared: ['react', 'react-dom', 'react-router-dom']
      }),
      tsconfigPaths(),
    ],
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      reporters: 'junit',
      outputFile: 'reports/junit.xml',
      // testMatch: ['./tests/**/*.test.tsx'],
      globals: true,
    },
    build: {
      outDir: '../api/src/main/resources/static',
    },
    // preview: {
    //   // host: 'snomio.ihtsdotools.org',
    //   port: 5174,
    //   strictPort: true,
    // },
    server: {
      port:5174,
      host: true,
      proxy: {
        '/api': {
          target: snomioBaseUrl,
          changeOrigin: false,
          secure: false,
          rewrite: path => path.replace(/^\/api\/branch/, '/api/'),
        },
        '/authoring-services': {
          target: apUrl,
          changeOrigin: true,
          secure: true,
          rewrite: path =>
            path.replace(/^\/authoring-services/, '/authoring-services'),
          ws: true,
        },
        '/snowstorm': {
          target: snowstormUrl,
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/snowstorm/, ''),
          // ws: true,
        },
        '/$defs': {
          target: snomioBaseUrl,
          changeOrigin: false,
          secure: false,
        },
        '/config': {
          target: snomioBaseUrl,
          changeOrigin: false,
          secure: false,
        },
      },
    },
    // needed for SockJs
    define: {
      global: 'window',
    },
  });
};
