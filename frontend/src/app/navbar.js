// Navbar.js
import Link from 'next/link';
import styles from './css/navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <input type="text" className={styles.searchBar} placeholder="Search..." />
            <Link href="/login" className={styles.navLink}>Sign In</Link>
        </nav>
    );
};

export default Navbar;

