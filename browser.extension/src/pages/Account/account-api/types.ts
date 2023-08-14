import { UserOperationStruct } from '@account-abstraction/contracts';
import {
  BaseAccountAPI,
  BaseApiParams,
} from '@account-abstraction/sdk/dist/src/BaseAccountAPI';
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/dist/src/TransactionDetailsForUserOp';
import { MessageSigningRequest } from '../../Background/redux-slices/signing';
import { ethers } from 'ethers';
import { AccountApiCustomParamsType, BaseAccountCustom } from './base-account-custom';

export abstract class AccountApiType extends BaseAccountAPI {
  abstract serialize: () => Promise<object>;

  /** sign a message for the use */
  abstract signMessage: (
    request?: MessageSigningRequest,
    context?: any
  ) => Promise<string>;

  abstract signUserOpWithContext(
    userOp: ethers.PopulatedTransaction,
    context?: any
  ): Promise<ethers.PopulatedTransaction>;
}

export interface AccountApiParamsType<T, S> extends BaseApiParams {
  context?: T;
  deserializeState?: S;
}

// export type AccountImplementationType = new (
//   params: AccountApiParamsType<any, any>
// ) => AccountApiType;


export type AccountImplementationType = new (
  params: AccountApiCustomParamsType<any, any>
) => BaseAccountCustom