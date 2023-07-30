import React, { useEffect, useState } from 'react';
import styles from './card-grid.module.scss';
import classNames from 'classnames';
import { NFTCard } from '../nft-card/nft-card';
import { useAccountTokens, useLoans, useMktPlaceAssets, useTokenImage } from '../../../hooks/nfts';
import { useBackgroundSelector } from '../../../hooks';
import { getActiveAccount } from '../../../../Background/redux-slices/selectors/accountSelectors';
import { useLoaderData } from 'react-router-dom';
import { getContractData } from '../../../../../utils';

const [fallbackContractAddress] = getContractData();

export interface CardGridProps {
    className?: string;
    setIsNFTOpen: any;
    setIndex: any;
    setContract: any;
    setTokenId: any;
    context: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CardGrid = ({
    className, setIsNFTOpen,
    setIndex, setContract,
    setTokenId, context
}: CardGridProps) => {
    console.log('context', context);
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const [tokens, setTokens] = useState<any[]>();
    const [error, setError] = useState<string>();
    const _owned = useAccountTokens(activeAccount);
    const _borrowed = useLoans(activeAccount);
    console.log('_borrowed', _borrowed, 'activeAccount', activeAccount);
    const _mktPlace = useMktPlaceAssets();
    useEffect(() => {
        console.log('render')
        if(context=='owned') 
            setTokens(_owned);
        else if(context=='borrowed') 
            setTokens(_borrowed)
        else if(context=='explore')
            setTokens(_mktPlace);
        else setError('error: missing context')
        console.log('tokens', tokens);
    }, [context, _owned, _borrowed, _mktPlace]);
    if(tokens){
        return (
            tokens.map((t: any, i: number) => {
                console.log('index', i)
                return ( 
                    <div className={styles['card-grid-container']} key={i}>
                        {context=='owned' && 
                        <NFTCard
                        propImage="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                        acctiveAccount={activeAccount}
                        contract={fallbackContractAddress}
                        id={t}
                        index={i}
                        setIsNFTOpen={setIsNFTOpen}
                        setIndex={setIndex}
                        setContract={setContract}
                        setTokenId={setTokenId}
                        context={context}
                        />
                        }
                        {context=='borrowed' && 
                        <NFTCard
                        propImage="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                        acctiveAccount={activeAccount}
                        index={i}
                        setIsNFTOpen={setIsNFTOpen}
                        setIndex={setIndex}
                        setContract={setContract}
                        setTokenId={setTokenId}
                        context={context}
                        />
                        }
                        {context=='explore' && 
                        <NFTCard
                        propImage="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                        acctiveAccount={activeAccount}
                        index={i}
                        setIsNFTOpen={setIsNFTOpen}
                        setIndex={setIndex}
                        setContract={setContract}
                        setTokenId={setTokenId}
                        context={context}
                        />
                        }
                    </div>     
                )

            })
        )}
        
        
            // <div className={styles['card-grid-container']}>
            //     <NFTCard
            //         propImage="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
            //         acctiveAccount={activeAccount}
            //         id={0}
            //         setIsNFTOpen={setIsNFTOpen}
            //         setIndex={setIndex}
            //         setContract={setContract}
            //         setTokenId={setTokenId}
            //         context={context}
            //     />
            //     <NFTCard
            //         image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
            //         id={1}
            //         title="NFT Title2"
            //         // price={0.001}
            //         setIsNFTOpen={setIsNFTOpen}
            //     />
            //     <NFTCard
            //         image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
            //         id={2}
            //         title="NFT Title3"
            //         // price={0.003}
            //         setIsNFTOpen={setIsNFTOpen}
            //     />
            //     <NFTCard
            //         image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
            //         id={3}
            //         title="NFT Title4"
            //         // price={0.004}
            //         setIsNFTOpen={setIsNFTOpen}
            //     />
            //     <NFTCard
            //         image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
            //         title="NFT Title5"
            //         // price={0.005}
            //         setIsNFTOpen={setIsNFTOpen}
            //     />
            // </div>
    
};
