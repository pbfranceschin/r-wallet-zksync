// eslint-disable-next-line import/no-anonymous-default-export
import dotenv from 'dotenv';
dotenv.config();
// import contracts from "../contracts/hardhat_contracts.json";
// const networkID = 11155111 // sepolia
const networkID = 280 //zkSyncEra testnet
// const factory_address = contracts[networkID][0].contracts.RWalletFactory.address;
const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' // sepolia
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS;


export default {
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: FACTORY_ADDRESS || "0x00",
  stateVersion: '0.1',
  network: {
    chainID: String(networkID),
    family: 'EVM',
    name: 'ZksyncEra Testnet',
    provider: `https://zksync2-testnet.zksync.dev`,
    entryPointAddress: entryPointAddress,
    bundler: 'https://sepolia.voltaire.candidewallet.com/rpc',
    baseAsset: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      image:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
  },
};
