require('dotenv').load();
var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var stylelint = require('stylelint');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
	entry: PATHS.app,
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loaders: ['eslint'],
				include: PATHS.app,
			},
			{
				test: /\.css$/,
				loaders: ['postcss'],
				include: PATHS.app
			},
		],
		postcss: function () {
			return [stylelint({
				rules: {
					'color-hex-case': 'lower'
				}
			})];
		},
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel'],
				include: PATHS.app,
			},
			{
				test: /\.css$/,
				loaders: ['style','css'],
				include: PATHS.app,
			},
		],
	},
	plugins: [
		new HtmlwebpackPlugin({
  			title: 'Kanban app',
			template: 'node_modules/html-webpack-template/index.html',
			appMountId: 'app',
		})
	]
};

if(TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,
			stats: 'errors-only',
			host: process.env.DEV_SERVER_HOST,
			port: process.env.DEV_SERVER_PORT,
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
		]
	});
}

if(TARGET === 'build') {
	module.exports = merge(common, {});
}