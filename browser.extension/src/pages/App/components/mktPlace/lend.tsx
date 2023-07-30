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

export const Lend = ({
    address,
    id,
    price,
    maxDuration 
}: {
    address : string | undefined,
    id: number | undefined,
    price: number | undefined,
    maxDuration: number | undefined
}) => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string>('');
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [loader, setLoader] = React.useState<boolean>(false);
    const [mktPlaceAddress] = getMktPlaceData();
    console.log(mktPlaceAddress);
    // const [nftAddress] = getContractData();
    const abi = [
        'function lendNFT(address contract_, uint256 tokenId, uint256 price, uint256 maxDuration)'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("lendNFT", [
        address,
        id,
        price,
        maxDuration
    ]);
    const lend = useCallback(async () => {
        if (!ethers.utils.isAddress(activeAccount? activeAccount : '')) {
          setError('Invalid to address');
          console.log(error)
          return;
        }
        if(!address || !id) {
          setError('Missing prop: "address"');
          return;
        }
        if(!price || !maxDuration) {
          const msg = 'Price and Max Loan period have to be specified';
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
                to: mktPlaceAddress,
                data: calldata,
                value: ethers.utils.parseEther('0'),
                gas: "0x186A0"
              },
            ],
          });
          console.log(txHash);
          alert(`token successfully listed! tx ${txHash}`)
          navigate('/');
        }
        setLoader(false);
      }, [activeAccount, navigate]);
    
    return (
        <>
        <button onClick={lend}> lend</button>
        </>
    )
}

