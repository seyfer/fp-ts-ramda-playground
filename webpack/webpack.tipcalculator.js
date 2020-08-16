const webpackCommonConfig = require('./webpack.common');

const configFn = (env, argv) => {
    return {
        ...webpackCommonConfig(env, argv, 'tipcalculator'),
    };
}

module.exports = configFn;
