require("@nomicfoundation/hardhat-toolbox");
require("./scripts/defineTasks");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;
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
  networks: {
    polygonZkEvmCardonaTestnet: {
      url: "https://rpc.cardona.zkevm-rpc.com",
      // url: "http://127.0.0.1:8545/",
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 2442,
      // chainId: 31337,
      gasPrice: 22300000000,
    },
  },
};
