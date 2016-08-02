var path = require('path');
var webpack = require('webpack');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    var config = {};

    config.entry = isTest ? {} : {
        'polyfills': './client/polyfills.ts',
        'vendor': './client/vendor.ts',
        'app': './client/main.ts'
    };

    config.output = isTest ? {} : {
        path: root('public'),
        publicPath: '/',
        filename: 'js/[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    };

    config.resolve = {
        cache: !isTest,
        root: root(),
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
        alias: {
            'app': 'client/app'
        }
    };

    config.module = {
        preLoaders: isTest ? [] : [{test: /\.ts$/, loader: 'tslint'}],
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['ts', 'angular2-template-loader'],
                exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
            },

            {test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=fonts/[name].[hash].[ext]?'},

            {test: /\.json$/, loader: 'json'},

            {
                test: /\.css$/,
                exclude: root('client', 'app'),
                loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
            },
            {test: /\.css$/, include: root('client', 'app'), loader: 'raw!postcss'},

            {
                test: /\.scss$/,
                exclude: root('client', 'app'),
                loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
            },
            {test: /\.scss$/, exclude: root('client', 'style'), loader: 'raw!postcss!sass'},

            {test: /\.html$/, loader: 'raw'}
        ],
        postLoaders: [],
        noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/]
    };

    config.plugins = [
        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        })
    ];

    if (!isTest) {
        config.plugins.push(
            new CommonsChunkPlugin({
                name: ['vendor', 'polyfills']
            }),
            new ExtractTextPlugin('css/[name].[hash].css', {disable: !isProd})
        );
    }

    if (isProd) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin(),
            // Copy assets from the public folder
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([{
                from: root('client/public')
            }])
        );
    }

    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    config.tslint = {
        emitErrors: false,
        failOnHint: false
    };

    return config;
}();

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}
