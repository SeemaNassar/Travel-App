const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',  
        libraryTarget: 'var',
        library: 'Client'
    },
    optimization: {
        minimizer: [new TerserPlugin(), new CssMinimizerWebpackPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({ filename: "[name].css" }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: ({ request }) => request.destination === 'document',
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'html-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 7 * 24 * 60 * 60, // one week
                        },
                    },
                },
                {
                    urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'static-resources',
                        expiration: {
                            maxEntries: 20,
                        },
                    },
                },
                {
                    urlPattern: ({ request }) => request.destination === 'image',
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'image-cache',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 30 * 24 * 60 * 60, // one month
                        },
                    },
                },
            ],
        }),
    ],
    devServer: {
        port: 3000,
        allowedHosts: 'all'
    }
};
