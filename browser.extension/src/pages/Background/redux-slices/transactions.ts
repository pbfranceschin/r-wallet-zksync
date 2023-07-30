import { UserOperationStruct } from '@account-abstraction/contracts';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import KeyringService from '../services/keyring';
import ProviderBridgeService, {
  EthersTransactionRequest,
} from '../services/provider-bridge';
import { createBackgroundAsyncThunk } from './utils';
import { ethers } from 'ethers';

export type TransactionState = {
  transactionRequest?: EthersTransactionRequest;
  transactionsRequest?: EthersTransactionRequest[];
  modifiedTransactionsRequest?: EthersTransactionRequest[];

  requestOrigin?: string;
  userOperationRequest?: Partial<UserOperationStruct>;
  unsignedUserOperation?: ethers.PopulatedTransaction;
};

export const initialState: TransactionState = {
  transactionsRequest: undefined,
  transactionRequest: undefined,
  userOperationRequest: undefined,
  unsignedUserOperation: undefined,
};

type SigningReducers = {
  sendTransactionRequest: (
    state: TransactionState,
    {
      payload,
    }: {
      payload: {
        transactionRequest: EthersTransactionRequest;
        origin: string;
      };
    }
  ) => TransactionState;
  sendTransactionsRequest: (
    state: TransactionState,
    {
      payload,
    }: {
      payload: {
        transactionsRequest: EthersTransactionRequest[];
        origin: string;
      };
    }
  ) => TransactionState;
  setModifyTransactionsRequest: (
    state: TransactionState,
    {
      payload,
    }: {
      payload: EthersTransactionRequest[];
    }
  ) => TransactionState;
  sendUserOperationRquest: (
    state: TransactionState,
    { payload }: { payload: ethers.PopulatedTransaction }
  ) => TransactionState;
  setUnsignedUserOperation: (
    state: TransactionState,
    { payload }: { payload: ethers.PopulatedTransaction }
  ) => TransactionState;
  clearTransactionState: (state: TransactionState) => TransactionState;
};

const transactionsSlice = createSlice<
  TransactionState,
  SigningReducers,
  'signing'
>({
  name: 'signing',
  initialState,
  reducers: {
    sendTransactionRequest: (
      state,
      {
        payload: { transactionRequest, origin },
      }: {
        payload: {
          transactionRequest: EthersTransactionRequest;
          origin: string;
        };
      }
    ) => {
      return {
        ...state,
        transactionRequest: transactionRequest,
        requestOrigin: origin,
      };
    },
    sendTransactionsRequest: (
      state,
      {
        payload: { transactionsRequest, origin },
      }: {
        payload: {
          transactionsRequest: EthersTransactionRequest[];
          origin: string;
        };
      }
    ) => {
      return {
        ...state,
        transactionsRequest: transactionsRequest,
        requestOrigin: origin,
      };
    },
    setModifyTransactionsRequest: (
      state,
      {
        payload,
      }: {
        payload: EthersTransactionRequest[];
      }
    ) => ({
      ...state,
      modifiedTransactionsRequest: payload,
    }),
    sendUserOperationRquest: (
      state,
      { payload }: { payload: ethers.PopulatedTransaction }
    ) => ({
      ...state,
      userOperationRequest: payload,
    }),
    setUnsignedUserOperation: (
      state,
      { payload }: { payload: ethers.PopulatedTransaction }
    ) => ({
      ...state,
      unsignedUserOperation: payload,
    }),
    clearTransactionState: (state) => ({
      ...state,
      typedDataRequest: undefined,
      signDataRequest: undefined,
      transactionRequest: undefined,
      transactionsRequest: undefined,
      modifiedTransactionsRequest: undefined,
      requestOrigin: undefined,
      userOperationRequest: undefined,
      unsignedUserOperation: undefined,
    }),
  },
});

export const {
  sendTransactionRequest,
  sendTransactionsRequest,
  setModifyTransactionsRequest,
  sendUserOperationRquest,
  setUnsignedUserOperation,
  clearTransactionState,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

export const sendTransaction = createBackgroundAsyncThunk(
  'transactions/sendTransaction',
  async (
    { address, context }: { address: string; context?: any },
    { dispatch, extra: { mainServiceManager } }
  ) => {
    console.log('check 0');
    const keyringService = mainServiceManager.getService(
      KeyringService.name
    ) as KeyringService;
    console.log('check 1');
    const state = mainServiceManager.store.getState() as RootState;
    const unsignedUserOp = state.transactions.unsignedUserOperation;
    const origin = state.transactions.requestOrigin;
    console.log('check 2');
    if (unsignedUserOp) {
      const signedUserOp = await keyringService.signUserOpWithContext(
        address,
        unsignedUserOp,
        context
      );
      console.log('check 3');
      const txnHash = keyringService.sendUserOp(address, signedUserOp);
      console.log('check 4');
      dispatch(clearTransactionState());
      console.log('check 5');
      const providerBridgeService = mainServiceManager.getService(
        ProviderBridgeService.name
      ) as ProviderBridgeService;
      console.log('check 6');
      providerBridgeService.resolveRequest(origin || '', txnHash);
      console.log('check 7');
    }
  }
);

export const createUnsignedUserOp = createBackgroundAsyncThunk(
  'transactions/createUnsignedUserOp',
  async (address: string, { dispatch, extra: { mainServiceManager } }) => {
    console.log('outra coisa 1');
    const keyringService = mainServiceManager.getService(
      KeyringService.name
    ) as KeyringService;
    console.log('outra coisa 2');
    const state = mainServiceManager.store.getState() as RootState;
    const transactionRequest = state.transactions.transactionRequest;
    console.log( transactionRequest);
    if (transactionRequest) {
      const userOp = await keyringService.createUnsignedUserOp(
        address,
        transactionRequest
      );
      console.log('outra coisa 4');
      dispatch(setUnsignedUserOperation(userOp));
    }
    
  }
);

export const rejectTransaction = createBackgroundAsyncThunk(
  'transactions/rejectTransaction',
  async (address: string, { dispatch, extra: { mainServiceManager } }) => {
    dispatch(clearTransactionState());

    const requestOrigin = (mainServiceManager.store.getState() as RootState)
      .transactions.requestOrigin;

    const providerBridgeService = mainServiceManager.getService(
      ProviderBridgeService.name
    ) as ProviderBridgeService;

    providerBridgeService.rejectRequest(requestOrigin || '', '');
  }
);
