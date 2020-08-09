const path = require('path');
const webpackCommonConfig = require('./webpack.common');

const configName = 'counter';
const rootDir = path.resolve(__dirname, '../');
const srcDir = path.resolve(rootDir, 'src');

const configFn = (env, argv) => {
    return {
        ...webpackCommonConfig(env, argv),
        entry: { [configName]: srcDir + '/' + configName + '/index.ts' },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(rootDir, 'dist/' + configName),
        },
    };
}

module.exports = configFn;
