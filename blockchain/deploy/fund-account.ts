import { ethers } from 'ethers';
import { Wallet, Provider } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import dotenv from 'dotenv';
dotenv.config();

const pkey = process.env.PRIVATE_KEY;
const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS_2;

export default async function (hre: HardhatRuntimeEnvironment) {
    if(!pkey || !ACCOUNT_ADDRESS) throw new Error("missing env");
    // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
    const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
    const dummy1 = new Wallet(pkey, provider);
    let bal: any;
    bal = await provider.getBalance(dummy1.address);
    console.log(`\nowner's balance: ${ethers.utils.formatEther(bal)}`);
    bal = await provider.getBalance(ACCOUNT_ADDRESS);
    console.log(`\naccount's balance: ${ethers.utils.formatEther(bal)}`);
    const money = '0.001';
    console.log(`\nsending ${money} to ${ACCOUNT_ADDRESS}...`)
    await (
        await dummy1.sendTransaction({
          to: ACCOUNT_ADDRESS,
          value: ethers.utils.parseEther(money),
        })
    ).wait();
    const newBal = await provider.getBalance(ACCOUNT_ADDRESS);
    console.log(`\nnew balance ${ethers.utils.formatEther(newBal)}`);
}