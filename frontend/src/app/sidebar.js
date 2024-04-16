import React from 'react';
import styles from './css/sidebar.module.css';

export default function Sidebar({ activeTab, setActiveTab }) {
    const MenuItem = ({name, icon}) => {
        const isActive = activeTab === name;
        return (
            <div
                onClick={() => {
                    setActiveTab(name);
                }}
                className={`${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`}
            >
                <img src={icon} alt={name} className={`${styles.menuIcon} ${isActive ? styles.activeMenuIcon : ''}`} />
                <div>{name}</div>
            </div>
        )
    }

    return (
        <aside>
            <div className={styles.sidebar}>
                <div >
                    <MenuItem name="**Logo**" icon="/css/icons/sdbar_home.png" />
                    <MenuItem name="Home" icon="/css/icons/sdbar_home.png" />
                    <MenuItem name="Portfolio" icon="/css/icons/sdbar_portfolio.png" />
                    <MenuItem name="Watchlist" icon="/css/icons/sdbar_watchlist.png" />
                    <MenuItem name="About Us" icon="/css/icons/sdbar_aboutUs.png" />
                    <MenuItem name="Contact" icon="/css/icons/sdbar_contactUs.png" />
                </div>
            </div>
        </aside>
            )


}
