import axios, { Axios } from 'axios'
import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
// import { useRouter } from 'next/router'
import {
  useContractRead,
  useContract,
  useProvider,
} from "wagmi";

import {
  getContractData,
  getMktPlaceData,
  getEthersNftContract,
  ipfsToHTTP,
  getTokenMetadata,
  getWalletContractAbi,
} from '../../../utils'
import { isAddress } from 'ethers/lib/utils.js';

const [fallbackContractAddress] = getContractData();
// const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
// export const useTokenUri = (tokenId) => {
//   const [tokenUri, setTokenUri] = useState()
//   const [tokenUriError, setTokenUriError] = useState()
//   if (!tokenUri && !tokenUriError) {
//       const { data, isError, isLoading } = useContractRead({
//       address: contractAddress,
//       abi: contractABI,
//       functionName: 'tokenURI',
//       args: [tokenId],
//     })
//     console.log(data, isError, isLoading)
//     if (!isLoading && !isError) {
//       console.log("data",data)
//       setTokenUri(data);
//     }
//     else if (isError) {
//       console.log("isError")
//       console.log(isError)
//       setTokenUriError(isError)
//     }
//   }
//   return tokenUri
// }

// export const useTokenUri = (contract?: string, tokenId?: number) : any => {
//   // if(!contract) return;
//   const [tokenUri, setTokenUri] = useState()
//   const provider = useProvider()
//   useEffect(() => {
//     if (provider && contract) {
//       const nftContract = getEthersNftContract(contract, provider)
//       try {
//         nftContract.tokenURI(tokenId).
//         then ( (uri: any) =>{
//           setTokenUri(uri)
//         })
//       } catch (error) {
//         console.log(error)
//         return
//       }
//     }
//   },[provider, tokenId, contract])
//   return tokenUri
// }


export const useTokenUri = (contract?: string, tokenId?: number) => {
  const [loading, setLoading] = useState(false);
  const [tokenUri, setTokenUri] = useState(null);
  const [error, setError] = useState(null);
  const provider = useProvider();

  useEffect(() => {
    const fetchTokenUri = async () => {
      if (!provider || !contract || tokenId === undefined) {
        return;
      }

      setLoading(true);

      try {
        const nftContract = getEthersNftContract(contract, provider);
        const uri = await nftContract.tokenURI(tokenId);
        setTokenUri(uri);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenUri();
  }, [provider, contract, tokenId]);

  return { tokenUri, loading, error };
};


export const useTokenCount = () : number => {
  const provider = useProvider()
  const [contractAddress, contractABI] = getContractData();
  const { data, isError, isLoading } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'totalSupply',
    watch: true,
  })
  if (isError || isLoading)
    return 0;
  return ethers.BigNumber.from(data).toNumber();
}
    

export const useTokenMetaData = (contractAddress?: string, tokenId?: number) : any => {
  // if(!contractAddress) return;
  const [tokenMetadata, setTokenMetadata] = useState()
  const { tokenUri , loading , error } = useTokenUri(contractAddress, tokenId)
  useEffect(() => {
    if (tokenUri) {
      axios.get(ipfsToHTTP(tokenUri)).
      then(request => {
        console.log('data', request.data)
        // transform data from string to object
        // const data = JSON.parse(request.data)
        const data = request.data;
        setTokenMetadata(data)
      })
    }
  },[tokenUri])
  return tokenMetadata
}

// export const useAllMetadata = () => {
//   const [allMetadata, setAllMetadata] = useState([])
//   const requests = useRef({})
//   const provider = useProvider()
//   const [contractAddress, contractABI] = getContractData();
//   const { data: tokenCount, isError, isLoading } = useContractRead({
//     address: contractAddress as `0x${string}`,
//     abi: contractABI as any,
//     functionName: 'numberOfTokens',
//     watch: true,
//   })

//   useEffect(() => {
//     if (!tokenCount) {
//       return
//     }
//     const count = tokenCount as number;
//     if (count > allMetadata.length) {
//       for (let i=allMetadata.length; i<count; i++) {
//         if (!requests.current[i]) {
//           requests.current[i] = getTokenMetadata(provider, i).then(
//             response => {
//               console.log(i, response)
//               // allMetadata.push()
//               setAllMetadata(arr => {
//                 const ret = [...arr, {tokenId: i.toString(), metadata: response.data}]
//                 ret.sort((e1, e2) => e2.tokenId - e1.tokenId)
//                 return ret
//               })
//             }
//           ) 
//         }
        
//       }
//     }
//   },[tokenCount])

//   return allMetadata
// }

export const useTokenImage = (contractAddress?: string, tokenId?: number) : string => {
  const metadata = useTokenMetaData(contractAddress, tokenId)
  console.log('metadata', metadata)
  // if (metadata)
  //   console.log("image ",typeof metadata)
  // console.log("---------------------")
  return metadata? ipfsToHTTP(metadata.image as string) : "";
}

export const useNFTtitle = (
  contractAddress?: string,
  tokenId?: number,
) : string | undefined => {
  // if(!contractAddress || !tokenId) return;
  const [title, setTitle] = useState<string>("");
  const metadata = useTokenMetaData(contractAddress, tokenId);
  // console.log('metadata (title hook)', metadata);
  useEffect(() => {
    if(metadata) setTitle(metadata.description);
  },[contractAddress, tokenId, metadata]);
  // console.log('title (hook)', title);
  return title;
}

export const useNFTname = (
  contractAddress?: string,
  tokenId?: number,
) : string | undefined => {
  if(!contractAddress || !tokenId) return;
  const [name, setName] = useState<string>("");
  const metadata = useTokenMetaData(contractAddress, tokenId);
  // console.log('metadata (title hook)', metadata);
  useEffect(() => {
    if(metadata) setName(metadata.name);
  },[contractAddress, tokenId, metadata]);
  // console.log('title (hook)', title);
  return name;
}


const isAccountToken = async (
  provider: any,
  accountAddress: string,
  contractAddress:string,
  tokenId: number
) => {
  const nftContract = getEthersNftContract(contractAddress, provider)
  const owner = await nftContract.ownerOf(tokenId);
  return owner === accountAddress;
}

const buidAccountTokens = async (provider: any, accountAddress: string, setAccountTokens: any) => {
  const nftContract = getEthersNftContract(fallbackContractAddress, provider)
  const tokenCount = await nftContract.totalSupply();
  let promises = [];
  // const init = 5;
  for (let i = 0; i < tokenCount; i++) {
    promises.push(isAccountToken(provider, accountAddress, fallbackContractAddress ,i));
  }
  const tokensBools = await Promise.all(promises);
  const tokens = tokensBools.map((p, i) =>  p ? i : -1);
  const tokensFiltered = tokens.filter(t => t > 0);
  setAccountTokens(tokensFiltered);
}

export const useAccountTokens = (accountAdress: string | undefined) : number[] | undefined => {
  if(!accountAdress) return;
  const [accountTokens, setAccountTokens] = useState<number[]>([])
  const provider = useProvider();
  const [contractAddress, contractABI] = getContractData();
  const { data: accountBalance, isError, isLoading } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'balanceOf',
    args: [accountAdress],
    watch: true,
  });

  useEffect(() => {
    if (!provider) {
      return
    }
    buidAccountTokens(provider, accountAdress, setAccountTokens);
  },[accountBalance])
  return accountTokens
}

export const useMktPlaceAssets = () : any => {
  // const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
  // const [assets, setAssets] = useState<any[]>([]);
  const [contractAddress, contractABI] = getMktPlaceData();
  console.log('mktplaceAddress',contractAddress);
  const { data: _assets, isError, isLoading } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractABI as any,
    functionName: 'getAssets',
    args: [],
    watch: true,
  });
  // useEffect(() => {
  //   if(!_assets) return
  //   setAssets(_assets);
  // },[_assets]);
  return _assets;
}

export const useLoans = (accountAddress: string | undefined) : any[] | undefined => {
  if(!accountAddress) return;
  // const [loans, setLoans] = useState<any[]>([]);
  const abi = getWalletContractAbi();
  const { data: loans, isError, isLoading } = useContractRead({
    address: accountAddress as `0x${string}`,
    abi: abi as any,
    functionName: 'getLoansByContract',
    args: [fallbackContractAddress],
    watch: true,
  });
  // useEffect(() => {
  //   if(!loans) return
  //   setLoans(loans);
  // },[loans]);
  return loans;
}

export const getNFTobj = (
  context: string,
  accountAddress?: string,
  index?: number
) : any | undefined=> {
  if(index == undefined) return
  let assets: any;
  const assetsLoan = useLoans(accountAddress);
  console.log('loans in hook', assetsLoan);
  const assetsMkt = useMktPlaceAssets();
  if(context=='borrowed') assets = assetsLoan; 
  else if(context=='explore') assets = assetsMkt;
  else {
    console.log('error: missing context')
    return
  }
  return assets[index];
}

// export const useContractAndId(context: sring, )

// export const getTokenContractAddress = (
//   accountAddress: string,
//   context: string,
//   index?: number
// ) : string | undefined=> {
//   if(!index) return
//   let assets: any;
//   if(context=='borrowed') assets = useLoans(accountAddress);
//   else if(context=='explore') assets = useMktPlaceAssets();
//   else {
//     console.log('error: missing context')
//     return
//   }
//   return assets[index].contract_;
// }

// export const getTokenId = (accountAddress: string,
//   context: string,
//   index?: number
// ) : number | undefined=> {
//   if(!index) return
//   let assets: any;
//   if(context=='borrowed') assets = useLoans(accountAddress);
//   else if(context=='explore') assets = useMktPlaceAssets();
//   else {
//     console.log('error: missing context')
//     return
//   }
//   return assets[index].id;
// }

// export const getTokenLender = (accountAddress: string,
//   context: string,
//   index?: number
// ) : string | undefined=> {
//   if(!index) return
//   let assets: any;
//   if(context=='borrowed') assets = useLoans(accountAddress);
//   else if(context=='explore') assets = useMktPlaceAssets();
//   else {
//     console.log('error: missing context')
//     return
//   }
//   return assets[index].lender;
// }


// export function useTokenId () {
//   const router = useRouter()
//   const {tokenId} = router.query
//   return tokenId
// }