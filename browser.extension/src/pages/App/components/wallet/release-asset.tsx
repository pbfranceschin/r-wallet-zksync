import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    FormControl,
    FormGroup,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
  } from '@mui/material';
import React, { useCallback } from 'react';
import Header from '../../components/header';
import { BigNumber, ethers } from 'ethers';
import { useBackgroundSelector } from '../../hooks';
import { getActiveAccount } from '../../../Background/redux-slices/selectors/accountSelectors';
import { useNavigate } from 'react-router-dom';
import { getEthersNftContract } from '../../../../utils';
import { useProvider } from 'wagmi';  
import { getContractData } from '../../../../utils';

const [fallbackContractAddress] = getContractData();

const ReleaseAsset = ({ index }: { index: number | undefined }) => {
    const navigate = useNavigate();
    const provider =  useProvider();
    const NFT = getEthersNftContract(fallbackContractAddress, provider) ;
    const [error, setError] = React.useState<string>('');
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [loader, setLoader] = React.useState<boolean>(false);
    // const [index, setIndex] = React.useState<Number>();
    const abi = [
        'function releaseSingleAsset(address contract_, uint256 index)'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("releaseSingleAsset", [
        NFT.address,
        index
    ]);
    const release = useCallback(async () => {
        if (!ethers.utils.isAddress(activeAccount? activeAccount : '')) {
          setError('Invalid to address');
          return;
        }
        if(!index) setError('Missing prop: index');
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
                to: activeAccount,
                data: calldata,
                value: ethers.utils.parseEther('0'),
              },
            ],
          });
          console.log(txHash);
          alert(`token successfully released! tx ${txHash}`)
          navigate('/');
        }
        setLoader(false);
      }, [activeAccount, navigate]);
    

    return (
        <Container sx={{ width: '62vw', height: '100vh' }}>
            <Header />
            <Card sx={{ ml: 4, mr: 4, mt: 2, mb: 2 }}>
                <CardContent>
                    <Box
                    component="div"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.20)',
                    position: 'relative',
                    }}
                    >
                        <Typography variant="h6">Release Assets</Typography>
                    </Box>
                    <Box
                    component="div"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 4 }}        
                    >
                        <Typography variant="body1" color="error">
                            {error}
                        </Typography>
                        <Button
                        disabled={loader}
                        onClick={release}
                        sx={{ mt: 4 }}
                        size="large"
                        variant="contained"
                        >
                            Release
                            {loader && (
                            <CircularProgress
                                size={24}
                                sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                                }}
                            />
                        )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )

}

export default ReleaseAsset;