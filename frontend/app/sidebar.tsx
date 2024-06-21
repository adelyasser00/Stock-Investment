import React, { useState, useEffect } from 'react';
import styles from './css/sidebar.module.css';

export default function Sidebar({ activeTab, setActiveTab }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Automatically handle sidebar collapse on narrow screens
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const MenuItem = ({ name, icon }) => {
        const isActive = activeTab === name;
        return (
            <div
                onClick={() => setActiveTab(name)}
                className={`${styles.menuItem} ${isActive ? styles.activeMenuItem : ''} ${isCollapsed ? styles.collapsedMenuItem : ''}`}
            >
                <img src={icon} alt={name} className={`${styles.menuIcon} ${isActive ? styles.activeMenuIcon : ''}`} />
                {!isCollapsed && <div>{name}</div>}
            </div>
        );
    }

    return (
        <aside>
            <div className={`${styles.sidebar} ${isCollapsed ? styles.sidebarHidden : ''}`}>
                {isCollapsed ? (
                    <button onClick={toggleSidebar} className={styles.toggleButton}>
                        <img src="/css/icons/sdbar_menu.png" alt="Expand" className={styles.menuIcon} />
                    </button>
                ) : (
                    <button onClick={toggleSidebar} className={styles.toggleButton}>
                        <img src="/css/icons/sdbar_menu.png" alt="Collapse" className={styles.menuIcon} />
                    </button>
                )}
                <MenuItem name="**Logo**" icon="/css/icons/sdbar_home.png" />
                <MenuItem name="Home" icon="/css/icons/sdbar_home.png" />
                <MenuItem name="Portfolio" icon="/css/icons/sdbar_portfolio.png" />
                <MenuItem name="Watchlist" icon="/css/icons/sdbar_watchlist.png" />
                <MenuItem name="Search" icon="/css/icons/sdbar_search.png" />
                <MenuItem name="Saved Posts" icon="/css/icons/sdbar_home.png" />
                <MenuItem name="Chatbot" icon="/css/icons/sdbar_chatbot.png" />
                <MenuItem name="About Us" icon="/css/icons/sdbar_aboutUs.png" />
                <MenuItem name="Contact" icon="/css/icons/sdbar_contactUs.png" />
            </div>
        </aside>
    );
}
