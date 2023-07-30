import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { NFTGallery } from '../nft-gallery/nft-gallery';
import { ProfileSectionContainer } from '../profile-section-container/profile-section-container';
import styles from './profile-dashboard.module.scss';
import classNames from 'classnames';
import { log } from 'console';
import { NFTDialog } from '../nft-dialog/nft-dialog';
import { useBackgroundSelector } from '../../../hooks';
import { getActiveNetwork } from '../../../../Background/redux-slices/selectors/networkSelectors';
import { AccountData } from '../../../../Background/redux-slices/account';
import { getAccountEVMData } from '../../../../Background/redux-slices/selectors/accountSelectors';

export interface ProfileDashboardProps {
    className?: string;
    activeAccount?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ProfileDashboard = ({ className, activeAccount }: ProfileDashboardProps) => {
  const [isNFTOpen, setIsNFTOpen] = useState(false);
  const [index, setIndex] = useState<number>();
  const [contract, setContract] = useState<string>();
  const [tokenId, setTokenId] = useState<number>();
  const initialContext = 'owned';
  const [context, setContext] = useState<string>(initialContext);
  const [isOwned, setIsOwned] = useState<boolean>(true);
  const [isBorrowed, setIsBorrowed] = useState<boolean>(false);
  const activeNetwork = useBackgroundSelector(getActiveNetwork);
  const address = activeAccount? activeAccount as string : '';
  const accountData: AccountData | 'loading' = useBackgroundSelector((state) =>
    getAccountEVMData(state, { address, chainId: activeNetwork.chainID })
  );

  console.log('isNFTOpen is ', isNFTOpen);
  

  useEffect(() => {
    if(context=='owned'){
      setIsOwned(true);
      setIsBorrowed(false);
    } else if(context=='borrowed'){
      setIsBorrowed(true);
      setIsOwned(false);
    } else {
      setIsOwned(false);
      setIsBorrowed(false);
    }
  }, [context]);

  return (
    <div>
      {isNFTOpen && 
      <NFTDialog
      contract={contract}
      id={tokenId}
      index={index}
      setIsNFTOpen={setIsNFTOpen} 
      context={context}
      activeAccount={activeAccount}
      isOwned={isOwned}
      isBorrowed={isBorrowed}
      />}
      <div className={styles.layout}>
          <div className={styles.sidebar}>
            <ProfileSectionContainer activeAccount={activeAccount} setContext={setContext}/>
          </div>
          <div className={styles.topbar}>
            <div className={styles['topbar-button']} onClick={() => setContext('explore')}>Explore</div>
          </div>
          <div className={styles.gallery}>
            <NFTGallery
            setIsNFTOpen={setIsNFTOpen}
            setIndex={setIndex}
            setContract={setContract}
            setTokenId={setTokenId}
            context={context}
            />
          </div>
      </div>
    </div>
  );
};
