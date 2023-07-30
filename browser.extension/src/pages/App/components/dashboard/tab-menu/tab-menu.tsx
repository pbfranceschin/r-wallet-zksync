import React from 'react';
import { TabItemSelected } from '../tab-item-selected/tab-item-selected';
import { TabItem } from '../tab-item/tab-item';
import styles from './tab-menu.module.scss';
import classNames from 'classnames';

export interface TabMenuProps {
    className?: string;
    setContext: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const TabMenu = ({ className, setContext }: TabMenuProps) => {
    return (
      <div>
        <TabItemSelected name="Owned" setContext={setContext}/>
        <TabItem name="Borrowed" setContext={setContext}/>
      </div>
    );
};
