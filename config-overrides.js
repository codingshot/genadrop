//* config-overrides.js */

const path = require("path");
const fs = require("fs");
const WebpackObfuscator = require('webpack-obfuscator');
const crypto = require('crypto');

const rewireBabelLoader = require("react-app-rewire-babel-loader");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = function override(config, env) {
  // eslint-disable-next-line no-param-reassign
  config = rewireBabelLoader.include(config, resolveApp("node_modules/@celo-tools"));
  config = rewireBabelLoader.include(config, resolveApp("node_modules/celo-tools"));

  config.plugins.push(new HardSourceWebpackPlugin());

  config.plugins.push(
    new WebpackObfuscator({
      rcompact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1
    })
  );

  return config;
};
