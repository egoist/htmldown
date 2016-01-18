const webpack = require('webpack')

module.exports = {
	entry: './index',
	output: {
		path: __dirname,
		filename: 'htmldown.browser.js',
		library: 'htmldown',
		libraryTarget: 'var'
	},
	module: {
		loaders: [
			{
				test: /\.json$/,
				loaders: ['json']
			}
		]
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		/*eslint-disable */
		new webpack.DefinePlugin({
			'__DEV__': false,
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		/*eslint-enable */
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			},
			comments: false
		})
	]
}
