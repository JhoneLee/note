const {
  TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD,
} = require('hardhat/builtin-tasks/task-names');
const path = require('path');
require('@nomicfoundation/hardhat-toolbox');
// require('@nomiclabs/hardhat-etherscan');
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args, hre, runSuper) => {
  if (args.solcVersion === '0.8.27') {
    const compilerPath = path.join(
      __dirname,
      'soljson-v0.8.27+commit.40a35a09.js'
    );

    return {
      compilerPath,
      isSolcJs: true, // if you are using a native compiler, set this to false
      version: args.solcVersion,
      // this is used as extra information in the build-info files, but other than
      // that is not important
      longVersion: '0.8.27+commit.40a35a09', // 这里必须得和solc支持的版本一样
    };
  }

  // we just use the default subtask if the version is not 0.8.5
  return runSuper();
});

module.exports = {
  solidity: '0.8.27',
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/{infura API key}',
      accounts: [
        'MetaMask钱包地址',
      ],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: 'ehterScan Api Key',
    },
  },
  sourcify: {
    enabled: true,
  },
};
