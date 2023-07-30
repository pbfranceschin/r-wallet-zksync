import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { getActiveAccount } from '../../../Background/redux-slices/selectors/accountSelectors';
import AccountActivity from '../../components/account-activity';
import AccountBalanceInfo from '../../components/account-balance-info';
import AccountInfo from '../../components/account-info';
import Header from '../../components/header';
import TransferAssetButton from '../../components/transfer-asset-button';
import { useBackgroundSelector } from '../../hooks';
import { getContractData } from '../../../../utils'
import { useTokenCount, useTokenUri, useTokenImage, useTokenMetaData, useAccountTokens, useMktPlaceAssets } from '../../hooks/nfts'
import { ProfileDashboard } from '../../components/dashboard/profile-dashboard/profile-dashboard';

// const TempImage = ({tokenId}: {tokenId: number}) => {
//   const image: string = useTokenImage(tokenId);
//   return (
//     <img src={image} />
//   );
// }

const Home = () => {
  console.log('update 2')
  const activeAccount = useBackgroundSelector(getActiveAccount);
  console.log('activeAccount', activeAccount);
  const assets = useMktPlaceAssets();
  console.log('mktPlaceAssets', assets);
  // console.log("getContractData", getContractData())
  // const tokenCount = useTokenCount();
  // console.log("tokenCount", tokenCount)
  // const uri = useTokenUri(1)
  // console.log("uri", uri);
  // const tokenMetaData = useTokenMetaData(1);
  // console.log("tokenMetaData", tokenMetaData)
  // const tokenImage = useTokenImage(5);
  // console.log("useTokenImage", tokenImage)
  // let tokens = [];
  // for (let i = 5; i < tokenCount; i++) {
  //   tokens.push(i);
  // }

  // const accountTokens = useAccountTokens(activeAccount? activeAccount : '');
  // console.log('accountTokens', accountTokens);

  return (
    <Container sx={{ width: '62vw', height: '100vh' }}>
      <Header />
      <Card sx={{ ml: 4, mr: 4, mt: 2, mb: 2 }}>
        <CardContent>
          {activeAccount && <AccountInfo address={activeAccount}></AccountInfo>}
          <Box
            component="div"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ m: 2 }}
          >
            <AccountBalanceInfo address={activeAccount} />
          </Box>
          <Box
            component="div"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ m: 4 }}
          >
            <TransferAssetButton activeAccount={activeAccount || ''} />
          </Box>
        </CardContent>
      </Card>
    </Container>
    // <ProfileDashboard activeAccount={activeAccount}/>    
  );
};

export default Home;
