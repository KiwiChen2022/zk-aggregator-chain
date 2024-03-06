// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // This example demonstrates how to polyfill Node.js core modules.
      // You might need to adjust it based on the specific polyfills you need.
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback, // Merge with existing fallbacks
        // Define your polyfills here. For example:
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        vm: require.resolve("vm-browserify"),
      };

      // Provide plugin to inject process and Buffer
      const ProvidePlugin = require("webpack").ProvidePlugin;
      webpackConfig.plugins.push(
        new ProvidePlugin({
          process: "process/browser", // Polyfill for process
          Buffer: ["buffer", "Buffer"], // Polyfill for Buffer
        })
      );

      return webpackConfig;
    },
  },
};
