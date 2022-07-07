//* config-overrides.js */

const path = require("path");
const fs = require("fs");
const rewireBabelLoader = require("react-app-rewire-babel-loader");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = function override(config, env) {
  // eslint-disable-next-line no-param-reassign
  config = rewireBabelLoader.include(config, resolveApp("node_modules/@celo-tools"));
  config = rewireBabelLoader.include(config, resolveApp("node_modules/celo-tools"));

  return config;
};
