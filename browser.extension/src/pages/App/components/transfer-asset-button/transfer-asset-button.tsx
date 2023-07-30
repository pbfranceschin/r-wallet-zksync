import React, { useCallback, useMemo } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import StoreIcon from '@mui/icons-material/Store';
import { Avatar, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { WavingHandRounded } from '@mui/icons-material';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { Borrow, Lend, Approve } from '../mktPlace';
import { getContractData } from '../../../../utils';
import {
  AccountData,
  getAccountData,
} from '../../../Background/redux-slices/account';
import { useBackgroundSelector } from '../../hooks';
import { getActiveNetwork } from '../../../Background/redux-slices/selectors/networkSelectors';
import { getAccountEVMData } from '../../../Background/redux-slices/selectors/accountSelectors';


const TransferAssetButton = ({ activeAccount }: { activeAccount: string }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const activeNetwork = useBackgroundSelector(getActiveNetwork);
  const address = activeAccount? activeAccount as string : "";
  const accountData: AccountData | 'loading' = useBackgroundSelector((state) =>
    getAccountEVMData(state, { address, chainId: activeNetwork.chainID })
  );
  
  const walletDeployed: boolean = useMemo(
    () => (accountData === 'loading' ? false : accountData.accountDeployed),
    [accountData]
  );
  
  const [nftAddress] = getContractData();
  const tokenId = 11;
  const price = ethers.utils.parseEther('0.0000001');
  const maxDuration = ethers.BigNumber.from('10000');
  const tokenIndex = 0;
  const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
  const duration = 10;
  const value = (180000000000000*10)+((180000000000000*10)*3)/1000;
  console.log('value', ethers.utils.formatEther(value.toString()))



  const sendMoney = useCallback(async () => {
    // if (window.ethereum) {
    //   const accounts = await window.ethereum.request({
    //     method: 'eth_requestAccounts',
    //   });
    //   const txHash = await window.ethereum.request({
    //     method: 'eth_sendTransaction',
    //     params: [
    //       {
    //         from: activeAccount,
    //         to: ethers.constants.AddressZero,
    //         data: '0x',
    //       },
    //     ],
    //   });
    //   console.log(txHash);
    // }
  }, [activeAccount]);

  return (
    <Stack direction={'row'} spacing={4}>
      {/* <Tooltip title="Coming soon"> */}
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={'4px'}
          sx={walletDeployed? { cursor: 'pointer' } : { cursor: 'not-allowed', opacity: 0.5 }}
        >
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <StoreIcon
            onClick={() => navigate('/dashboard')}
            />
          </Avatar>
          <Typography variant="button">NFT market</Typography>
        </Stack>
      {/* </Tooltip> */}
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={'4px'}
        sx={{ cursor: 'pointer' }}
      >
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          <SendRoundedIcon
            onClick={() => navigate('/transfer-assets')}
            sx={{ transform: 'rotate(-45deg)', ml: '4px', mb: '6px' }}
          />
        </Avatar>
        <Typography variant="button">Send</Typography>
      </Stack>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={'4px'}
        sx={{ cursor: 'pointer' }}
      >
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          <WavingHandRounded
            onClick={() => navigate('/release-asset')}
          />
        </Avatar>
        <Typography variant="button">Release</Typography>
      </Stack>
      <Tooltip title="Coming soon">
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={'4px'}
          sx={{ cursor: 'not-allowed', opacity: 0.5 }}
        >
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <SwapHorizIcon />
          </Avatar>
          <Typography variant="button">Swap</Typography>
        </Stack>
      </Tooltip>
      {/* <Borrow
      lender={dummy1}
      index={tokenIndex}
      duration={duration}
      value={value}
      />
      <Lend
      address={nftAddress}
      id={tokenId}
      price={price}
      maxDuration={maxDuration}
      />
      <Approve
      contract={nftAddress}
      tokenId={tokenId}
      /> */}
    </Stack>
  );
};

export default TransferAssetButton;
