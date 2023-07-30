import { ethers } from "ethers";
import { Provider } from "zksync-web3";
import dotenv from 'dotenv';
dotenv.config();


const provider = new Provider('https://zksync2-testnet.zksync.dev');
const NFT_ADDRESS = process.env.NFT_ADDRESS;
const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;

const ownerCheck = async () => {
    if(!NFT_ADDRESS || !ACCOUNT_ADDRESS) throw new Error('missing env');
    const nftContract = new ethers.Contract(NFT_ADDRESS, [
        "function ownerOf(uint256 tokenId) view returns (address)"
    ], provider);
    const tokenId = 5;
    const expected_owner = ACCOUNT_ADDRESS;
    const owner = await nftContract.ownerOf(tokenId);
    console.log('expected owner?', expected_owner == owner);
}

ownerCheck();
