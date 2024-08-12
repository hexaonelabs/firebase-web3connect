import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
// import eslint from 'vite-plugin-eslint';
// import browserslistToEsbuild from 'browserslist-to-esbuild';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import {
	// extname,
	// relative,
	resolve
} from 'path';
// import { fileURLToPath } from 'node:url';
// import { glob } from 'glob';
// import copy from "rollup-plugin-copy";
import pkg from './package.json';

export default defineConfig({
	server: {
		port: 3000 // To run the app on port 3000
		// open: true, // If we want to open the app once its started
	},
	plugins: [
		nodePolyfills(),
		wasm(),
		topLevelAwait(),
		libInjectCss(),
		dts({ include: ['lib'] })
		// copy({
		//   targets: [
		//       { src: "cli/index.js", dest: "dist" }
		//   ],
		// }),
		// eslint()
	],
	build: {
		manifest: false,
		minify: true,
		lib: {
			// formats: ['es'],
			entry: resolve(__dirname, 'lib/index.ts'),
			// formats: ['es'],
			name: 'firebase-web3connect',
			fileName: (format, name) => {
				if (format === 'es') {
					return `${name}.js`;
				}
				return `${name}.${format}`;
			}
		},
		copyPublicDir: false,
		rollupOptions: {
			external: Object.keys(pkg.peerDependencies || {})
			// 	input: {
			// 		...Object.fromEntries(
			// 			glob.sync('lib/**/*.{ts,tsx}').map(file => [
			// 				// The name of the entry point
			// 				// lib/nested/foo.ts becomes nested/foo
			// 				relative('lib', file.slice(0, file.length - extname(file).length)),
			// 				// The absolute path to the entry file
			// 				// lib/nested/foo.ts becomes /project/lib/nested/foo.ts
			// 				fileURLToPath(new URL(file, import.meta.url))
			// 			])
			// 		)
			// 	},
			// 	output: {
			// 		inlineDynamicImports: false,
			// 		assetFileNames: 'assets/[name][extname]',
			// 		entryFileNames: '[name].js'
			// 	}
		}
		// target: browserslistToEsbuild()
	},
	optimizeDeps: {
		exclude: ['@syntect/wasm']
	}
});
