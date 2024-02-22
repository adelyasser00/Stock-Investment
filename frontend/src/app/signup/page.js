import React from 'react';
import styles from '../css/loginsignup.module.css';
import Link from 'next/link';

function signup() {
    return (
        <div>
            <header className={styles.loginsignup}>
                <div className={styles.innerContainer}>
                    <h2>Sign Up</h2>
                    <input type="text" placeholder="Full Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input type="password" placeholder="Confirm Password"/>
                    <p>Birthday</p><input type="date" placeholder="Birthday" />

                    
                    <button>Sign Up</button>
                    <p>
                        Already have an account? <Link href="/login">Login</Link>
                    </p>
                </div>
            </header>
        </div>
    );
};

export default signup;
