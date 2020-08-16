const webpackCommonConfig = require('./webpack.common');

const configFn = (env, argv) => {
    return {
        ...webpackCommonConfig(env, argv, 'tempunitconvert'),
    };
}

module.exports = configFn;
