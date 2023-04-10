//* config-overrides.js */

const path = require("path");
const fs = require("fs");
const CryptoJS = require('crypto-js');
const WebpackObfuscator = require('webpack-obfuscator');

const encryptionKey = 'testesttest$testtest'; // Letakkan kunci enkripsi Anda di environment variable

const rewireBabelLoader = require("react-app-rewire-babel-loader");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = function override(config, env) {
  // eslint-disable-next-line no-param-reassign
  config = rewireBabelLoader.include(config, resolveApp("node_modules/@celo-tools"));
  config = rewireBabelLoader.include(config, resolveApp("node_modules/celo-tools"));

  config.plugins.push(
    new WebpackObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['base64', 'rc4'],
      stringArrayThreshold: 0.75,
      obfuscationSeed: CryptoJS.enc.Utf8.parse(encryptionKey + Math.random().toString(36).substring(2, 15)),
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: 1000, // misalnya, setiap 1 detik
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      renameGlobals: true,
      reservedNames: [],
      selfDefending: true,
      shuffleStringArray: true,
      simplify: true,
      splitStrings: false,
      splitStringsChunkLength: 10,
      stringArrayIndexShift: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersType: 'function',
      target: 'browser',
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
    })
  );

  return config;
};
