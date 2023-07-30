import React, { useEffect, useState } from 'react';
import styles from './dialog-owned-description.module.scss';
import classNames from 'classnames';
import { Lend } from '../../mktPlace';
import { useSearchParams } from 'react-router-dom';
import { useNFTtitle, useNFTname } from '../../../hooks/nfts';

export interface DialogOwnedDescriptionProps {
    className?: string;
    contract?: string;
    id?: number;
}

let _title: string | undefined;
let _name: string | undefined;


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogOwnedDescription = ({ className, contract, id }: DialogOwnedDescriptionProps) => {
    // const [price, setPrice] = useState<number>();
    const [maxDuration, setMaxDuration] = useState<number>();
    const [title, setTitle] = useState<string>();
    const [name, setName] = useState<string>();    
    const [price, setPrice] = useState<number>();
    _title = useNFTtitle(contract, id);
    _name = useNFTname(contract, id);


    useEffect(() => {
        setTitle(_title);
        setName(_name);
    },[]);

    return (
        <div className={styles['description-container']}>
            <h1 className={styles.title}>{title}</h1>
            <h1 className={styles.description}>{name}</h1>
            <div className={styles['body-description-container']}>
                <div className={styles.divider}></div>
                <h2 className={styles['body-description']}>This NFT is owned by you.</h2>
                <h2 className={styles['body-description']}>Lend NFT</h2>
                <div>
                    <div className={styles['price-input-container']}>
                        <input 
                        className={styles['price-input']}
                        placeholder="0"
                        type='number'
                        // value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        />
                        <div>
                            <span className={styles.eth}>ETH</span>
                        </div>
                    </div>
                    <div className={styles['price-input-container']}>
                        <input 
                        className={styles['price-input']}
                        placeholder="0"
                        type='number'
                        // value={price}
                        onChange={(e) => setMaxDuration(e.target.value)}
                        />
                        <div>
                            <span className={styles.eth}>Days</span>
                        </div>
                    </div>
                </div>
                {/* <Lend
                address={address}
                id={id}
                price={price}
                maxDuration={maxDuration}
                /> */}
            </div>
        </div>
    );
};
