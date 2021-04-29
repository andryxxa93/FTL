const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TersetWebpackPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TersetWebpackPlugin()
        ]
    }

    return config
}

const fileName = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {},
    }, 
    'css-loader'
    ]

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
}

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist')},            
        //     ]
        // }),
        new MiniCssExtractPlugin({
            filename: fileName('css')
        })
    ]
    if (isProd) {
        base.push(new BundleAnalyzerPlugin)
    }

    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
       main: './assets/js/main.js',
    },
    mode: 'development',
    output: {
        filename: fileName('js'),
        path: path.resolve(__dirname, 'dist')
    },
    optimization: optimization(),
    devServer: {
        port:8080,
        hot: isDev,
        overlay: true,
        open: true,
    },
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            }
        ]
    }
}