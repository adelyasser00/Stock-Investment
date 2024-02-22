// Sidebar.js
import React from 'react'
import styles from './css/sidebar.module.css'

export default function Sidebar({ activeTab, setActiveTab }) {
    const MenuItem = ({name}) => {
        const isActive = activeTab === name;
        return (
            <div
                onClick={() => {
                    setActiveTab(name);
                }}
                className={`${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`}
            >
                <div>{name}</div>
            </div>
        )
    }

    return (
        <div className={styles.sidebar}>
            <div className="flex flex-col">
                <MenuItem name="Home" />
                <MenuItem name="Portfolio" />
                <MenuItem name="Watchlist" />
                <MenuItem name="About Us" />
                <MenuItem name="Contact" />
            </div>
        </div>
    )
}
