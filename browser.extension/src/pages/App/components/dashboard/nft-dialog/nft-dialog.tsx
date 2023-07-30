import React, { useEffect, useLayoutEffect, useState } from 'react';
import { DialogBorrowedDescription } from '../dialog-borrowed-description/dialog-borrowed-description';
import { DialogExploreDescription } from '../dialog-explore-description/dialog-explore-description';
import { DialogOwnedDescription } from '../dialog-owned-description/dialog-owned-description';
import styles from './nft-dialog.module.scss';
import classNames from 'classnames';
import { getNFTobj, useNFTtitle, useNFTname, useTokenImage, useTokenMetaData } from '../../../hooks/nfts';
import { Context } from 'wagmi';

export interface NFTDialogProps {
    className?: string;
    activeAccount?: string
    context: string;
    isOwned: boolean;
    isBorrowed: boolean;
    setIsNFTOpen: any;
    contract?: string;
    id?: number;
    index?: number;
}

let image: string | undefined;
let imageOwn: string | undefined;
let imageBorrExp: string | undefined;
let _price: number;
let nft: any;
const propImage = "https://dl.openseauserdata.com/cache/originImage/files/9d6b9f6ef3d8b0b0f08481be0a0fd2f8.png";


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NFTDialog = ({
    className,
    activeAccount,
    context,
    isOwned,
    isBorrowed,
    setIsNFTOpen,
    index,
    contract,
    id
}: NFTDialogProps) => {
    const [error, setError] = useState<string>();
    // const [isOwned, setIsOwned] = useState<boolean>(true);
    // const [isBorrowed, setIsBorrowed] = useState<boolean>(false);
    // const [title, setTitle] = useState<string>();
    // const [image, setImage] = useState<string>();
    // const [price, setPrice] = useState<number>();
    const [lender, setLender] = useState<string>();
    // const [endTime, setEndTime] = useState<number>(-1);
    // const [name, setName] = useState<string>();
    console.log('isOwned', isOwned);
    console.log('isBorrowed', isBorrowed);
    
    const onCloseDialog = () => {
        setIsNFTOpen(false);
    };

    const stopPropagation = (e: any) => {
        e.stopPropagation();
    };

    
    imageOwn = useTokenImage(contract, id);
    console.log(
        'context in dialog', context,
        'activeAccount in dialog', activeAccount,
        'index in dialog', index
    );
    nft = getNFTobj(context, activeAccount, index);
    console.log('nft in dialog', nft);
    imageBorrExp = useTokenImage(
        nft ? nft.contract_ : "", nft ? nft.id : 0
    );
    console.log('imageBorrExp', imageBorrExp);
    if(context == 'owned') {
        image = imageOwn;
    } else if(context=='borrowed' || context=='explore') {
        image = imageBorrExp;
    } else {
        console.log('missing context');
        // setError('missing context');
    }
    
    
    
    // useLayoutEffect(() => {
    //     if(context == 'owned'){ 
    //         setIsOwned(true);
    //         // setImage(imageOwn);
    //     } else if(context == 'borrowed') {
    //             setIsBorrowed(true);
    //             // setImage(imageBorrExp);
    //     } else if(context == 'explore'){
    //             // setPrice(nft.price);
    //             // setImage(imageBorrExp);
    //     } else setError('missing context');
    // }, [context, image]);


    return (
        <div className={styles['nft-dialog-backdrop']} onClick={onCloseDialog}>
            <dialog className={styles['nft-dialog']} onClick={stopPropagation} open>
                <div className={styles['nft-dialog-content']}>
                    <div className={styles['nft-image-container']}>
                        <div className={styles['nft-image-preview']}>
                            <img
                                src={image? image : propImage}
                                className={styles['image']}
                            />
                        </div>
                    </div>
                    <div className={styles['nft-description-container']}>
                        {isOwned ? (
                          <DialogOwnedDescription 
                          contract={contract}
                          id={id}
                          />
                        ) : isBorrowed ? (
                          <DialogBorrowedDescription
                          activeAccount={activeAccount}
                          context={context}
                          index={index}
                          />
                        ) : (
                          <DialogExploreDescription
                          index={index}
                          activeAccount={activeAccount}
                          />
                        )}
                    </div>
                </div>
            </dialog>
            <div onClick={() => onCloseDialog()} className={styles['close-button']}>
                <div>
                    <svg
                        fill="none"
                        height="27"
                        overflow="visible"
                        viewBox="0 0 27 27"
                        width="27"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g>
                            <path
                                d="M13.5064 27C20.9094 27 27 20.9094 27 13.5064C27 6.09061 20.9094 0 13.4936 0C6.07787 0 0 6.09061 0 13.5064C0 20.9094 6.09061 27 13.5064 27ZM9.41623 19.0618C8.57527 19.0618 7.92544 18.412 7.92544 17.5583C7.92544 17.176 8.09108 16.8065 8.3714 16.5262L11.3785 13.5191L8.3714 10.512C8.09108 10.2317 7.92544 9.84946 7.92544 9.47994C7.92544 8.62624 8.57527 7.9764 9.41623 7.9764C9.87494 7.9764 10.219 8.11656 10.512 8.42237L13.4936 11.3912L16.5007 8.40963C16.8065 8.10382 17.1505 7.96366 17.5965 7.96366C18.4375 7.96366 19.0873 8.6135 19.0873 9.4672C19.0873 9.84946 18.9344 10.2062 18.6413 10.4993L15.647 13.5191L18.6286 16.5135C18.9217 16.8065 19.0873 17.176 19.0873 17.5583C19.0873 18.412 18.4247 19.0618 17.5838 19.0618C17.1378 19.0618 16.7683 18.9217 16.4752 18.6286L13.4936 15.6597L10.5375 18.6286C10.2317 18.9217 9.87494 19.0618 9.41623 19.0618Z"
                                fill="white"
                            ></path>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
};
