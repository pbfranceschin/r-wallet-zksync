import { Wallet, Contract, Provider, EIP712Signer, types, utils } from "zksync-web3";
import { ethers, BigNumber } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import dotenv from "dotenv";
dotenv.config();

// ******
// to run script:   yarn nft-transfer
//
// network:         defaults to zkSyncTestnet
// ******

const pkey = process.env.PRIVATE_KEY;
// const pkey = "f02d097a4059c83f459856e8455f63ad8fc1b260ba35871ac03d60e94304712c";
// const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;
const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS_2;
// const ACCOUNT_ADDRESS_2 = process.env.ACCOUNT_ADDRESS_2;
const NFT_ADDRESS = process.env.NFT_ADDRESS;
const tokenUri = "https://ipfs.filebase.io/ipfs/QmZtGwzymqv9SzNvVBuxV2SnxX9SzsP2DBZWiA2Kq7rAgb";


// DEBUG
// - contract working ?? check 
//      - getCode = artifact.bytecode
//      - (view function) 
// - minter == owner ?? check

const mint = async (
    nft: Contract,
    minter: Wallet,
    to: string
): Promise<any> => {
    let tokenId: any;
    let err: any;
    
    try {        
        console.log('\nminting...');
        const mint = await nft.connect(minter).mint(to, tokenUri);
        const receipt = await mint.wait();
        // console.log(receipt);
        console.log(`\nmint tx: ${receipt.transactionHash}`);
        const mintEvent = receipt.events?.find((event: any) => event.event === 'Transfer');
        tokenId = mintEvent?.args?.tokenId;
    } catch (error) {
        console.log(error);
        err = error;
    }
    if(err) return;
    const owner = await nft.ownerOf(tokenId);
    if(owner == to) console.log(`\ntoken ${tokenId} successfully mintet to ${to}`);
    else {
        console.log(`\nreturned owner of token ${tokenId}: ${owner}`);
        return;
    } 
    return tokenId
}

async function ERC721Transfer (hre: HardhatRuntimeEnvironment) {
    if(!pkey || !ACCOUNT_ADDRESS || !NFT_ADDRESS) throw new Error("missing env");
    // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
    const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
    console.log('**************');
    const owner = new Wallet(pkey, provider);
    // const accountArtifact = await hre.artifacts.readArtifact("AAAccount");
    // const account = new Contract(ACCOUNT_ADDRESS, accountArtifact.abi, owner);
    const nftArtifact = await hre.artifacts.readArtifact("NFT");
    const nft = new Contract(NFT_ADDRESS, nftArtifact.abi, owner);

    // console.log('account',account.address == ACCOUNT_ADDRESS);
    // return

    // const tokenId = await mint(nft, owner, ACCOUNT_ADDRESS);
    // if(!tokenId) throw new Error('mint transaction failed');
    // return
    const tokenId = 5;
    const receiver = process.env.ACCOUNT_ADDRESS;
    if(!receiver) throw new Error("missing receiver");
    console.log('\n...');

    let ERC721transferTx = await nft.populateTransaction.transferFrom(
        ACCOUNT_ADDRESS, receiver, tokenId
    );
    ERC721transferTx = {
        ...ERC721transferTx,
        from: ACCOUNT_ADDRESS,
        chainId: (await provider.getNetwork()).chainId,
        nonce: await provider.getTransactionCount(ACCOUNT_ADDRESS),
        type: 113,
        customData: {
            gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
          } as types.Eip712Meta,
        value: ethers.BigNumber.from(0),
    };
    ERC721transferTx.gasPrice = await provider.getGasPrice();
    ERC721transferTx.gasLimit = await provider.estimateGas(ERC721transferTx);
    // ERC721transferTx.gasLimit = BigNumber.from(1000000);
    const signedTxHash = EIP712Signer.getSignedDigest(ERC721transferTx);
    const signature = ethers.utils.arrayify(
        ethers.utils.joinSignature(owner._signingKey().signDigest(signedTxHash))
    );

    ERC721transferTx.customData = {
        ...ERC721transferTx.customData,
        customSignature: signature,
    };
    console.log(`\ntransfering token ${tokenId} to ${receiver}...`);
    const transfer = await provider.sendTransaction(utils.serialize(ERC721transferTx));
    const receipt = await transfer.wait();
    console.log(`\ntransfer tx: ${receipt.transactionHash}`);
    console.log('\nchecking new owner...');
    const newOwner = await nft.ownerOf(tokenId);
    console.log(`\nnew owner == ${receiver}?` , newOwner==receiver);
}

export default ERC721Transfer;