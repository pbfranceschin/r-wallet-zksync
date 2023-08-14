import { ethers, BigNumber } from "ethers";
import { TransactionDetailsForUserOp } from "@account-abstraction/sdk/dist/src/TransactionDetailsForUserOp"; 
import { Provider, utils, types, Wallet, EIP712Signer } from "zksync-web3";
import config from "../../../exconfig";
import rWallet from "../../../rWallet.json";
import { create2Address } from "zksync-web3/build/src/utils";
import { AbiCoder } from "ethers/lib/utils.js";

export interface BaseCustomApiParams {
    provider: Provider
    accountAddress?: string
    // overheads?: Partial<GasOverheads>
    // paymasterAPI?: PaymasterAPI
}

export interface AccountApiCustomParamsType<T, S> extends BaseCustomApiParams {
  context?: T;
  deserializeState?: S;
}


const zksyncEraRPC = "https://zksync2-testnet.zksync.dev";
const FACTORY_ADDRESS = config.factory_address;

export class BaseAccountCustom {
    private senderAddress!: string
    private isPhantom = true

    // name: string;
    factoryAddress: string;
    owner: Wallet;
    provider: Provider;
    accountAddress?: string;
    // overheads?: Partial<GasOverheads>
    // paymasterAPI?: PaymasterAPI

    /**
   * base constructor.
   * subclass SHOULD add parameters that define the owner (signer) of this wallet
   */
    constructor (params: AccountApiCustomParamsType<{}, { privateKey: string }>) {
        this.provider = params.provider;
        this.accountAddress = params.accountAddress;
        this.factoryAddress = FACTORY_ADDRESS;
        // this.overheads = params.overheads
        // this.paymasterAPI = params.paymasterAPI
        this.owner = params.deserializeState?.privateKey
          ? new Wallet(params.deserializeState?.privateKey, this.provider)
          : Wallet.createRandom();
    }

    serialize = async (): Promise<{ privateKey: string }> => {
      return {
        privateKey: this.owner.privateKey,
      };
    };

    async checkAccountPhantom (): Promise<boolean> {
        if (!this.isPhantom) {
          // already deployed. no need to check anymore.
          return this.isPhantom
        }
        const senderAddressCode = await this.provider.getCode(this.getAccountAddress())
        if (senderAddressCode.length > 2) {
          console.log(`SimpleAccount Contract already deployed at ${this.senderAddress}`)
          this.isPhantom = false
        } else {
          console.log(`SimpleAccount Contract is NOT YET deployed at ${this.senderAddress} - working in "phantom account" mode.`)
        }
        return this.isPhantom
    }


    getAccountInitCode(): any {
      return {
        bytecode: rWallet.bytecode,
        bytecodeHash: utils.hashBytecode(rWallet.bytecode),
        salt: ethers.constants.HashZero,
        ownerAddress: this.owner.address
      }
    }
    
    getCounterFactualAddress(): string {
      const initCode = this.getAccountInitCode();
      const abiCoder = new ethers.utils.AbiCoder();
      const address =  create2Address(
        this.factoryAddress,
        initCode.bytecodeHash,
        initCode.salt,
        abiCoder.encode(["address"], [this.owner.address]),
      );
      return address;
    }

    async getAccountAddress (): Promise<string> {
      if (this.senderAddress == null) {
        if (this.accountAddress != null) {
          this.senderAddress = this.accountAddress
        } else {
          this.senderAddress = await this.getCounterFactualAddress()
        }
      }
      return this.senderAddress
    }



    async createUnsignedUserOp(info: TransactionDetailsForUserOp): Promise<ethers.PopulatedTransaction> {
        const provider = new Provider(zksyncEraRPC);
        const address = await this.getAccountAddress();
        const chainId = (await provider.getNetwork()).chainId;
        let tx = {
            from: address,
            to: info.target,
            chainId: chainId,
            nonce: await this.getNonce(),
            type: 113,
            customData: {
              ergsPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
            } as types.Eip712Meta,
            value: info.value
              ? ethers.BigNumber.from(info.value)
              : undefined,
            gasPrice: await provider.getGasPrice(),
            data: info.data,
            gasLimit: ethers.BigNumber.from(20000000),
        }
        return tx;
    }

    // signUserOp(userOp: ethers.PopulatedTransaction): Promise<ethers.PopulatedTransaction>;

    async signUserOpWithContext (
      userOp: ethers.PopulatedTransaction,
      context: any
    ): Promise<ethers.PopulatedTransaction> {
      const signedTxHash = EIP712Signer.getSignedDigest(userOp);
      const signature = ethers.utils.arrayify(ethers.utils.joinSignature(this.owner._signingKey().signDigest(signedTxHash)));
      userOp.customData = {
        ...userOp.customData,
        customSignature: signature,
      }
      return userOp;
    }


    
    async getNonce(): Promise<number> {
        const provider = new Provider(zksyncEraRPC);
        const address = this.getAccountAddress();
        return await provider.getTransactionCount(address);
    }

}

/**
 * VER AONDE USA BUNDLER
 * VER AONDE USA ENTRYPOINT
 * VER AONDE USA FACTORY
 * VER AONDE USA ABI DA ACCOUNT
 */