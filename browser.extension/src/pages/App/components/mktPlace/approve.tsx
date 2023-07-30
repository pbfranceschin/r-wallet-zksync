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


export const Approve = ({
    contract, tokenId
} : {
    contract: string,
    tokenId: number
}) => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string>('');
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [mktPlaceAddress] = getMktPlaceData();
    // const mktAddress = mktPlaceAddress as string;
    // const [nftAddress] = getContractData();
    const abi = [
        'function approve(address to, uint256 tokenId)'
    ]
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("approve", [
        mktPlaceAddress,
        tokenId
    ]);
    const approve = useCallback(async () => {
        if (!ethers.utils.isAddress(contract)) {
          setError('Invalid to address');
          console.log(error)
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
                to: contract,
                data: calldata,
                // gas: "0x186A0",
                value: ethers.utils.parseEther('0')
              },
            ],
          });
          console.log(txHash);
          alert(`token successfully approved! tx ${txHash}`)
          navigate('/');
        }
        setLoader(false);
      }, [activeAccount, navigate]);
    
      return(
        <button onClick={approve}> approve </button>
      )
}