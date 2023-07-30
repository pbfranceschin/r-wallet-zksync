import React from 'react';
import { CardGrid } from '../card-grid/card-grid';
import styles from './nft-gallery.module.scss';
import classNames from 'classnames';

export interface NFTGalleryProps {
    className?: string;
    setIsNFTOpen: any;
    setIndex:any;
    setContract: any;
    setTokenId: any;
    context: string;
}
//setIndex, setContract, setTokenId, contextts

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NFTGallery = ({
    className, setIsNFTOpen,
    setIndex, setContract,
    setTokenId, context
}: NFTGalleryProps) => {
    return (
        <div className={styles['gallery-section']}>
            <span className={styles['gallery-container']}>
                <div className={styles['gallery-header-wrapper']}>
                    <div className={styles['gallery-header']}>
                        <span className={styles['gallery-header-name']}></span>
                    </div>
                </div>
                <CardGrid 
                className={styles['card-grid']}
                setIsNFTOpen={setIsNFTOpen}
                setIndex={setIndex}
                setContract={setContract}
                setTokenId={setTokenId}
                context={context}
                />
            </span>
        </div>
    );
};
