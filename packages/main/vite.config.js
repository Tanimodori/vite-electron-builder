import {node} from '../../.electron-vendors.cache.json';
import {join} from 'node:path';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';
import nodeBuiltins from 'builtin-modules/static';
import electronBuiltins from 'electron-builtins';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      /**
       * https://github.com/vitejs/vite/issues/12012
       */
      preserveEntrySignatures: 'strict',
      output: {
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: join(PACKAGE_ROOT, 'src'),
        entryFileNames: info => `${info.name}.cjs`,
      },
      external: src => {
        const [name] = src.split('/');
        const externalNames = [
          ...nodeBuiltins,
          ...nodeBuiltins.map(name => `node:${name}`),
          ...electronBuiltins,
        ];
        return externalNames.includes(name);
      },
    },
    commonjsOptions: {
      ignoreDynamicRequires: true,
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  ssr: {
    noExternal: true,
  },
  plugins: [injectAppVersion()],
};

export default config;
