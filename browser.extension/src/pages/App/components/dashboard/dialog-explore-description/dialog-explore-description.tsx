import React, { useEffect } from 'react';
import styles from './dialog-explore-description.module.scss';
import classNames from 'classnames';
// import { Borrow } from '../../mktPlace';
import { useState } from 'react';
import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';
import { Borrow } from '../../mktPlace';
import { ethers } from 'ethers';

export interface DialogExploreDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
}

let nft: any;
let _title: string | undefined;
let _name: string | undefined;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogExploreDescription = ({ className, index, activeAccount }: DialogExploreDescriptionProps) => {
    const [duration, setDuration] = useState<number | undefined>();
    // const [title, setTitle] = useState<string>();
    // const [name, setName] = useState<string>();
    // const [price, setPrice] = useState<string>();
    
    nft = getNFTobj("explore", activeAccount, index);
    _title = useNFTtitle(
        nft ? nft.contract_ : "" ,
        nft ? nft.id : 0
    );
    _name = useNFTname(
        nft ? nft.contract_ : "" , 
        nft ? nft.id : 0
    );
    
    // useEffect(() => {
    //     setTitle(_title);
    //     setName(_name);

    // });
    return (
        <div className={styles['description-container']}>
            <h1 className={styles.title}>{_title}</h1>
            <h1 className={styles.description}>{_name}</h1>
            <h1 className={styles.description}>Max Loan Period:{nft ? nft.maxDuration.toString() : ""} min</h1>
            <div className={styles['body-description-container']}>
                <div className={styles.divider}></div>
                <h2 className={styles['body-description']}>Borrow this NFT!</h2>
                <h3 className={styles['price-description']}>
                    Price: <span className={styles['price-currency']}>{nft ? nft.price.toString() : ""} wei/day</span>
                </h3>
                <div>
                    <div className={styles['price-input-container']}>
                        <input 
                        className={styles['price-input']}
                        placeholder="min"
                        type="number"
                        // value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        />
                        <div>
                            <span className={styles.eth}>Days</span>
                        </div>
                    </div>
                </div>
                <Borrow
                lender={nft? nft.lender : ethers.constants.AddressZero}
                index={index}
                duration={duration}
                price={nft? nft.price : 0}
                />
                
            </div>
        </div>
    );
};
