import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const BASE_NAME = env.VITE_APP_BASE_NAME || '/';
  const PORT = 3000;

  return {
    base: BASE_NAME,
    server: {
      open: true,
      port: PORT,
      host: true
    },
    preview: {
      open: true,
      host: true
    },
    plugins: [react()],
    resolve: {
      // imports absolutos a partir de `src` (ex.: `import config from 'config'`), definidos em `paths` no tsconfig.json
      tsconfigPaths: true
    },
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      cssCodeSplit: true,
      rolldownOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names[0] || '';
            const ext = name.split('.').pop();
            if (/\.css$/.test(name)) return `css/[name]-[hash].${ext}`;
            if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/.test(name)) return `images/[name]-[hash].${ext}`;
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) return `fonts/[name]-[hash].${ext}`;
            return `assets/[name]-[hash].${ext}`;
          },
          // remove console/debugger apenas no build de produção
          ...(mode === 'production' && { minify: { compress: { dropConsole: true, dropDebugger: true } } })
        }
      }
    }
  };
});
