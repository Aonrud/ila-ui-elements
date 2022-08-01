//import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import header from './src/js/license-header.js';

export default {
	input: 'src/js/ila-ui.js',
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
				format: { comments: `/^\/*!/` }
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
