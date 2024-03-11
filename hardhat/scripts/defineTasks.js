const { task } = require("hardhat/config");

task("hello", "Prints 'Hello, World!'").setAction(async (taskArgs, hre) => {
  console.log("Hello, World!");
});

task("getRawInput", "Gets the raw input data of a transaction")
  .addParam("tx", "The transaction hash")
  .setAction(async (taskArgs, hre) => {
    const transaction = await hre.ethers.provider.getTransaction(taskArgs.tx);
    if (transaction === null) {
      console.log(`No transaction found for hash: ${taskArgs.tx}`);
      return;
    }
    console.log(transaction.data);
  });

task("getBlockTransactions", "Prints all transactions in a given block")
  .addParam("block", "The block number to check")
  .setAction(async ({ block }, { ethers }) => {
    let blockNumber = block;

    if (!isNaN(block)) {
      blockNumber = block.toString();
    }

    if (block === "latest") {
      blockNumber = await ethers.provider.getBlockNumber();
    }

    const blockInfo = await ethers.provider.getBlock(blockNumber);

    if (!blockInfo || blockInfo.transactions.length === 0) {
      console.log(`No transactions found in block ${blockNumber}.`);
      return;
    }

    console.log(`Transactions in block ${blockNumber}:`);
    blockInfo.transactions.forEach((txHash, index) => {
      console.log(`Transaction #${index + 1}: ${txHash}`);
    });
  });
