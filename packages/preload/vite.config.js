import {chrome} from '../../.electron-vendors.cache.json';
import {preload} from 'unplugin-auto-expose';
import {join} from 'node:path';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';
import nodeBuiltins from 'builtin-modules/static';
import electronBuiltins from 'electron-builtins';
import {viteStaticCopy} from 'vite-plugin-static-copy';

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
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'packages/preload/src',
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
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  ssr: {
    noExternal: true,
  },
  plugins: [
    preload.vite(),
    injectAppVersion(),
    viteStaticCopy({
      flatten: false,
      targets: [
        {
          src: ['../../node_modules/usb/prebuilds/**'],
          dest: 'dist',
        },
      ],
    }),
  ],
};

export default config;
