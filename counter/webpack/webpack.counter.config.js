const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const rootDir = path.resolve(__dirname, '../');
const srcDir = path.resolve(rootDir, 'src');

console.log([rootDir, srcDir]);

const config = {
    entry: { counter: './src/index.ts' },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(rootDir, 'dist/counter'),
    },
    context: rootDir,
    devtool: 'inline-source-map',
    watch: true,
    devServer: {
        contentBase: srcDir,
        compress: true,
        port: 9000,
        progress: true,
        stats: 'minimal',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: srcDir,
                use: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // disable type checker - we will use it in fork plugin
                        transpileOnly: true,
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
};

module.exports = config;
