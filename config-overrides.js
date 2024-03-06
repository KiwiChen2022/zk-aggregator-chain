const webpack = require("webpack");

module.exports = function override(config, env) {
  // Setup fallbacks for Node.js modules that are not natively supported by the browser
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"), // Add this line
  };

  return config;
};
