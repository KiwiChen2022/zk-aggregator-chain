require("@nomicfoundation/hardhat-toolbox");
require("./scripts/defineTasks");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      evmVersion: "shanghai",
    },
  },
};
