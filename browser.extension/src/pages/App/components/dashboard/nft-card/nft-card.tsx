import React, { useEffect, useState, useRef } from 'react';
import styles from './nft-card.module.scss';
import classNames from 'classnames';
import { useNFTtitle, useTokenImage, useLoans, useTokenMetaData, useMktPlaceAssets } from '../../../hooks/nfts';


export interface NFTCardProps {
    className?: string;
    contract?: string;
    id?: number;
    index: number;
    propImage?: string;
    acctiveAccount: string | undefined;
    setIsNFTOpen: any;
    setIndex: any;
    setContract: any;
    setTokenId: any;
    context: string;
}

const onNFTCardClick = (
    contract: string | undefined,
    id: number | undefined,
    index: number | undefined,
    setIsNFTOpen: any,
    setIndex: any,
    setContract: any,
    setTokenId: any,
    context: string    
) => {
  setIsNFTOpen(true);
  if(context == 'owned') {
    if(!contract || !id) 
        console.log(
            'missing props'
        );
    setContract(contract);
    setTokenId(id);
  } else if(context == 'borrowed' || context == 'explore') {
    setIndex(index)
  } else throw new Error('missing context'); 
}

let image: string | undefined;
let title: string | undefined;
let price: number | undefined;
let imageOwn: string | undefined;
let imageBorr: string | undefined;
let imageExp: string | undefined;
let titleOwn: string | undefined;
let titleBorr: string | undefined;
let titleExp: string | undefined;
let _price: number | undefined;
let assetsBorr: any;
let assetsMkt: any;
let _contract: string;
let _id: number;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NFTCard = ({
    className,
    contract,
    id, index,
    propImage,
    acctiveAccount,
    setIsNFTOpen,
    setIndex,
    setContract,
    setTokenId,
    context
}: NFTCardProps) => {
    // const [image, setImage] = useState<string>();
    // const [title, setTitle] = useState<string>();
    // const [price, setPrice] = useState<number>();
    // const initializer = useRef<Boolean>();
    
    imageOwn = useTokenImage(contract, id);
    // console.log('imageOwn', imageOwn);
    titleOwn = useNFTtitle(contract, id);
    assetsBorr = useLoans(acctiveAccount);
    console.log('index card', index);
    const contract_ = assetsBorr ? assetsBorr[index]?.contract_ : "";
    imageBorr = useTokenImage(
        contract_,
        assetsBorr ? assetsBorr[index]?.id : 0
    );
    
    titleBorr = useNFTtitle(
        assetsBorr ? assetsBorr[index]?.contract_ : "",
        assetsBorr ? assetsBorr[index]?.id : 0
    );
    assetsMkt = useMktPlaceAssets();
    imageExp = useTokenImage(
        assetsMkt ? assetsMkt[index].contract_ : "",
        assetsMkt ? assetsMkt[index].id : 0
    );
    // console.log('imageExp', imageExp);
    titleExp = useNFTtitle(
        assetsMkt ? assetsMkt[index].contract_ : "",
        assetsMkt ? assetsMkt[index].id : 0
    );
    console.log(titleExp);
    _price = assetsMkt ? assetsMkt[index].price : 0;

    if(context=='owned') {
        image = imageOwn;
        title = titleOwn;
    } else if(context=='borrowed') {
        image = imageBorr;
        title = titleBorr;
    } else if(context=='explore') {
        image = imageExp;
        title = titleExp;
        price = _price;
    }
        
    // useEffect(() => {   
    //     console.log('card render', index)
    //     if(context == 'owned') {
    //         setImage(imageOwn);
    //         setTitle(titleOwn)
    //     } else if(context == 'borrowed') {
    //         setImage(imageBorr);
    //         setTitle(titleBorr);
    //     } else if(context=='explore') {
    //         console.log('imageExp', imageExp)
    //         setImage(imageExp);
    //         setTitle(titleExp);
    //         setPrice(_price);
    //     }
        
    // },[
    //     context,
    //     imageOwn, titleOwn,
    //     imageBorr, titleBorr,
    //     imageExp, titleExp,
    //     _price
    // ]);
    
    // console.log('image', _image);
    // console.log('_title', _title);
    
    
    
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.card} 
            onClick={() => onNFTCardClick(
                contract,
                id, index,
                setIsNFTOpen,
                setIndex,
                setContract,
                setTokenId,
                context
            )}
            >
                <div className={styles['container-card-image']}>
                    <div className={classNames(styles['card-image'], styles['image-cover-full'])}>
                        <img
                            height="100%"
                            width="100%"
                            src={image? image : propImage}
                            className={styles['image-cover']}
                        />
                    </div>
                </div>
                <div className={styles['card-description']}>
                    <h3 className={styles['card-title']}>{title}</h3>
                    {price && (
                      <div className={styles['card-price']}>
                        <p>{price.toString()} ETH </p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};
