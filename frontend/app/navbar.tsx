// Navbar.js
import styles from './css/navbar.module.css';
import  { UserButton, SignOutButton,  } from "@clerk/nextjs";


const Navbar = () => {
    return (
        <nav className={styles.navbar}>

            <div className={styles.navLinkUserButton}>
                <UserButton/>
            </div>

        </nav>
    );
};

export default Navbar;

