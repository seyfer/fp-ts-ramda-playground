const webpackCommonConfig = require('./webpack.common');

const configFn = (env, argv) => {
    return {
        ...webpackCommonConfig(env, argv, 'caloriecounter'),
    };
}

module.exports = configFn;
