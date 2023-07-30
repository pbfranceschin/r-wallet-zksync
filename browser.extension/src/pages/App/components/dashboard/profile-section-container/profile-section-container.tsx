import React from 'react';
import { ProfileHeader } from '../profile-header/profile-header';
import { TabMenu } from '../tab-menu/tab-menu';
import styles from './profile-section-container.module.scss';
import classNames from 'classnames';

export interface ProfileSectionContainerProps {
    className?: string;
    activeAccount?: string;
    setContext: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ProfileSectionContainer = ({ className, activeAccount, setContext }: ProfileSectionContainerProps) => {
    return (
        <div className={styles['profile-section-container']}>
            <ProfileHeader activeAccount={activeAccount}/>
            <TabMenu setContext={setContext} />
        </div>
    );
};
