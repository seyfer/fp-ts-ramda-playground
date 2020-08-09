const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootDir = path.resolve(__dirname, '../');
const srcDir = path.resolve(rootDir, 'src');

const configFn = (env, argv) => {
    const isProd = (argv.mode === 'production');

    return {
        context: rootDir,
        devtool: isProd ? false : 'inline-source-map',
        mode: argv.mode,
        watch: !isProd,
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
        plugins: [
            new CleanWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin(),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
    };
}

module.exports = configFn;
