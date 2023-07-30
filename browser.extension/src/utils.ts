import { ethers } from "ethers";
import { Provider } from '@ethersproject/providers';
import axios, { AxiosInstance } from 'axios';
// import MarketPlace from "./MarketPlace.json";
// import BaseMarketPlace from "./BaseMarketPlace.json";
import contracts from "../contracts/hardhat_contracts.json";
import { ContractInterface, Contract } from '@ethersproject/contracts';
import { erc721ABI } from "wagmi";
import wallet from "./RWallet.json";

interface NFT {
  address: string;
  abi: ContractInterface;
}

const networkId = 11155111; // sepolia
// const contractAddress: string = NFT.address;
// const contractABI: ContractInterface = NFT.abi;
const nftAddress: string = contracts[networkId][0].contracts.NFT.address;
const nftAbi: ContractInterface = contracts[networkId][0].contracts.NFT.abi;
const mktPlaceAddress: string = contracts[networkId][0].contracts.BaseMarketPlace.address;
const mktPlaceAbi: ContractInterface = contracts[networkId][0].contracts.BaseMarketPlace.abi; 
const walletAbi: ContractInterface = wallet.abi;

export const getMktPlaceData = () => {
  return [mktPlaceAddress, mktPlaceAbi];
}

export const getContractData = (): [string, ContractInterface] => {
  return [nftAddress, nftAbi];
};

export const getWalletContractAbi = () : ContractInterface => {
  return walletAbi;
}

// receives an ethers provider and returns a contract instance
export const getEthersNftContract = (address: string, provider: Provider) => {
  const contract = new ethers.Contract(
    address,
    erc721ABI,
    provider
  );
  return contract
}

export const ipfsToHTTP = (ipfsName: string) => {
  if (ipfsName.includes("ipfs://"))
    return ipfsName.replace("ipfs://", "https://ipfs.io/ipfs/")
  return ipfsName
}

export const getTokenMetadata = async (provider: Provider, address: string, tokenId: number) => {
  const nftContract = getEthersNftContract(address, provider)
  const tokenUri = await nftContract.tokenURI(tokenId)
  return axios.get(ipfsToHTTP(tokenUri))
}

export const stringShortener = (str: string, limit: number) => {
  if (str && str.length > limit) {
    const sliceSize = 15
    return `${str.slice(0, sliceSize)}...${str.slice(
      str.length - sliceSize,
      str.length
    )}`;
  }
  return str;
};

export const stringTrim = (str: string, limit: number) => {
  if (str && str.length > limit) {
    return `${str.slice(0, limit)}...`;
  }
  return str;
};