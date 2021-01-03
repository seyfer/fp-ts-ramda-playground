const path = require('path');
const webpackCommonConfig = require('./webpack.common');

const rootDir = path.resolve(__dirname, '../');
const srcDir = path.resolve(rootDir, 'src');

const configName = 'counter';
const configFn = (env, argv) => {
    return {
        ...webpackCommonConfig(env, argv, configName),
    };
}

module.exports = configFn;
