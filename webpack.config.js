const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

let isDev = process.env.NODE_ENV === 'development'
let siteName = path.basename(__dirname)

module.exports = {
    entry: {
        main: './src/js/main.js',
        vendor: ['highlight.js'],

    },


    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].js',

    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader', options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    'postcss-loader',
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[hash].[ext]'
                }
            },
            {
                test: /\.html$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial'
                }
            }
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            // filename: isDev ? 'css/[name].css' : 'css/[name].[hash].css',
            filename: isDev ? 'css/[name].css' : 'css/[name].css',
            chunkFilename: isDev ? 'css/[id].css' : 'css/[id].[hash].css',
        }),

        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        }),

        new CleanWebpackPlugin(
            ['dist/js', 'dist/css/'],
            {
                exclude:  [],
                verbose: true,
                dry: false
            }
        ),

        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            https: true,
            server: {baseDir: ['dist']},
            tunnel : siteName,
            injectChanges: true
        })
    ],
}
