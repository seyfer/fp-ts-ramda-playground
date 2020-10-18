const path = require('path');
const webpackCommonConfig = require('./webpack.common');

const rootDir = path.resolve(__dirname, '../');
const srcDir = path.resolve(rootDir, 'src');

const configName = 'tempunitconvert';
const configFn = (env, argv) => {
    return {
        ...webpackCommonConfig(env, argv, configName),
        entry: { [configName]: srcDir + '/' + configName + '/index.ts' },
    };
}

module.exports = configFn;
