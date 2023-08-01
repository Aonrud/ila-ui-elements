import terser from '@rollup/plugin-terser';
import eslint from '@rollup/plugin-eslint';
import header from './src/js/license-header.js';

export default {
	input: 'src/js/ila-ui.js',
	plugins: [
		eslint()
	],
	output: [
		{
			name: 'ila',
			file: 'dist/ila-ui.js',
			format: 'umd',
			banner: header
		},
		{
			name: 'ila',
			file: 'dist/ila-ui.min.js',
			format: 'umd',
			plugins: [terser( { 
				mangle: { properties: { regex: /^_/ } },
			} )],
			banner: header
		},
		{
			name: 'ila',
			file: 'dist/ila-ui.esm.js',
			format: 'esm',
			banner: header
		}
	]
}
