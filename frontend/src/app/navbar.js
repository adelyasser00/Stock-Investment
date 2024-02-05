// components/Navbar.js
import Link from 'next/link';
import styles from './css/navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/search" className={styles.navLink}>Search</Link>
            <Link href="/portfolio" className={styles.navLink}>Portfolio</Link>
            <Link href="/signin" className={styles.navLink}>Sign In</Link>
        </nav>
    );
};

export default Navbar;
