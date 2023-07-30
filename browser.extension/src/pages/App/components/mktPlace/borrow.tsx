import React, { useCallback } from 'react';
import Header from '../header';
import { BigNumber, ethers } from 'ethers';
import { useBackgroundSelector } from '../../hooks';
import { getActiveAccount } from '../../../Background/redux-slices/selectors/accountSelectors';
import { useNavigate } from 'react-router-dom';
import { getEthersNftContract } from '../../../../utils';
import { useProvider } from 'wagmi';
import { useMktPlaceAssets } from '../../hooks/nfts';
import { getMktPlaceData, getContractData } from '../../../../utils';
import styles from '../dashboard/dialog-explore-description/dialog-explore-description.module.scss';


export const Borrow = ({
    lender, index, duration, price
} : {
    lender: string,
    index?: number,
    duration?: number,
    price: number
}) => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string>('');
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [mktPlaceAddress] = getMktPlaceData();
    const mktAddress = mktPlaceAddress as string;
    const feeBase = 1000;
    const feeMul = 3;
    // console.log('mktplaceAddress', mktPlaceAddress);
    const loanValue = duration? (price*duration) : null;
    console.log('loanValue', loanValue);
    const value = loanValue? loanValue + (loanValue * feeMul) / feeBase : null;
    console.log('value', value);
    // const value = value_? ethers.BigNumber.from(value_) : null;
    const _duration = duration? duration : 0;
    const abi = [
        'function borrowNFT(address lender, uint256 index, uint256 duration)'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("borrowNFT", [
        lender,
        index,
        _duration
    ]);
    const borrow = useCallback(async () => {
        if (!ethers.utils.isAddress(mktAddress)){
          setError('Invalid to address');
          console.log(error)
          return;
        }
        if(!value){
          setError('missing arg: value');
          return;
        }
        if(!index){
          const msg = 'missing arg: index';
          setError(msg);
          return;
        }
        if(lender == ethers.constants.AddressZero){
          setError('missing arg: lender');
          return;
        }
        if(!duration) {
          const msg = 'No duration specified';
          // setError(msg);
          alert(msg);
          return;
        }
        setLoader(true);
        setError('');
    
        if (window.ethereum) {
          await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: activeAccount,
                to: mktAddress,
                data: calldata,
                // gas: "0x186A0",
                value: value
              },
            ],
          });
          console.log(txHash);
          alert(`token successfully borrowed! tx ${txHash}`)
          navigate('/');
        }
        setLoader(false);
      }, [activeAccount, value,navigate]);
    
    return (
        <>
        <div className={styles['rent-button-container']}>
          <div>{error && (<h1>Error: {error}</h1>)}</div>  
          <div className={styles['rent-button-wrapper']}>
            {!error && (<div className={styles['rent-button']} onClick={borrow}>
              {loader? "Borrowing..." : "Give it to me!"}
            </div>)}
          </div> 
        </div>
        
        
        </>
    )

}