// Navbar.js
import Link from 'next/link';
import styles from './css/navbar.module.css';
import  { UserButton, SignOutButton,  } from "@clerk/nextjs";
import {color} from "chart.js/helpers";


const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            {/*<div className={styles.navLink}>*/}
            {/*    <input type="text" className={styles.searchBar} placeholder="Search..."/>*/}
            {/*</div>*/}
            {/*<div className={`${styles.navLink} ${styles.switchBtn}`}>*/}
            {/*    <a href="/company">Company</a>*/}
            {/*</div>*/}
            <div className={styles.navLinkUserButton}>
                <UserButton/>
            </div>

            {/*<Link href="/login" className={styles.navLink}>Sign In</Link>*/}

            {/*<SignOutButton />*/}
        </nav>
    );
};

export default Navbar;

