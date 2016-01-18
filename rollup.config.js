import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

export default {
	entry: 'src/htmldown.js',
	dest: 'index.js',
	plugins: [
		json(),
		babel({
			presets: ['es2015-rollup'],
			exclude: 'node_modules/**'
		})
	],
	format: 'cjs'
}