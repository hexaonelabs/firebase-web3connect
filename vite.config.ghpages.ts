import { defineConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import inject from '@rollup/plugin-inject';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [nodePolyfills(), wasm(), topLevelAwait(), libInjectCss()],
	base: '/firebase-web3connect/',
	build: {
		target: 'esnext',
		rollupOptions: {
			plugins: [inject({ Buffer: ['buffer', 'Buffer'] })]
		}
	},
	optimizeDeps: {
		exclude: ['@syntect/wasm']
	}
});
