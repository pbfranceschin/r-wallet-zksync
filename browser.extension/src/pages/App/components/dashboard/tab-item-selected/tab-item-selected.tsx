import React from 'react';
import styles from './tab-item-selected.module.scss';
import classNames from 'classnames';

export interface TabItemSelectedProps {
    className?: string;
    name: string;
    setContext: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const TabItemSelected = ({ className, name, setContext }: TabItemSelectedProps) => {
    return (
        <span className={styles['tab-item-button-selected']} onClick={() => setContext('owned')}>
            <div className={styles['tab-item-container-selected']}>
                <div className={styles['tab-item-name-selected']}>
                    {name}
                </div>
                <div className={styles['tab-item-icon-selected']}>
                    <svg
                        fill="none"
                        height="22"
                        viewBox="0 0 22 22"
                        width="22"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10.6973 21.5059C16.498 21.5059 21.2441 16.7598 21.2441 10.959C21.2441 5.14844 16.498 0.402344 10.6875 0.402344C4.88672 0.402344 0.140625 5.14844 0.140625 10.959C0.140625 16.7598 4.88672 21.5059 10.6973 21.5059ZM10.6973 18.3223C6.61523 18.3223 3.32422 15.0312 3.32422 10.959C3.32422 6.87695 6.61523 3.58594 10.6875 3.58594C14.7695 3.58594 18.0605 6.87695 18.0605 10.959C18.0605 15.0312 14.7695 18.3223 10.6973 18.3223ZM8.61719 15.6953C8.99805 16.0762 9.79883 16.0664 10.209 15.6758L13.8711 12.248C14.5938 11.5742 14.5938 10.373 13.8711 9.69922L10.209 6.28125C9.75 5.85156 9.07617 5.86133 8.65625 6.25195C8.17773 6.68164 8.17773 7.43359 8.62695 7.86328L11.9668 10.9688L8.62695 14.084C8.1875 14.5039 8.14844 15.2266 8.61719 15.6953Z"
                            fill="#25292E"
                        ></path>
                    </svg>
                </div>
            </div>
        </span>
    );
};
