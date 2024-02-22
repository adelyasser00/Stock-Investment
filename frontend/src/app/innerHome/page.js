import React from 'react';
import styles from '../css/innerHome.module.css';
import Navbar from '../navbar.js';

function InnerHome() {
    return (   
    <div>
        <header className={styles.innerHome}>
                <Navbar />
        <p>
        <br></br><br></br>
        <h1>&emsp;Welcome back, -User- "Pending change 2x2 layout to omnia's version"</h1>
        </p>
        <div className={styles.mainContainer}>
            {/* 4 main containers */}
            <div className={styles.innerContainer}>
                <p>
                <h1 className={styles.h1}>Latest Stocks!</h1>
                <br />
                AAPL&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>205.00↑</span><br />
                MSFT&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>196.50↓</span><br />
                TSLA&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>32.88↑</span><br />
                ATTS&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>20.00↓</span><br />
                AAPL&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>205.00↑</span><br />
                MSFT&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>196.50↓</span><br />
                TSLA&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>32.88↑</span><br />
                ATTS&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>20.00↓</span><br />
                </p>
            </div>
            <div className={styles.innerContainer}>
                <p>
            <h1 className={styles.h1}>10 Recommendations based on your searches</h1> 
            <br />
                AAPL&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>205.00↑</span><br />
                MSFT&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>196.50↓</span><br />
                TSLA&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>32.88↑</span><br />
                ATTS&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>20.00↓</span><br />
                AAPL&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>205.00↑</span><br />
                MSFT&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>196.50↓</span><br />
                TSLA&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>32.88↑</span><br />
                ATTS&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>20.00↓</span><br />
                
                </p>
                </div>
             <div className={styles.innerContainer}>
                <p>
             <h1 className={styles.h1}>Previously viewed stocks</h1>           
             <br />
                AAPL&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>205.00↑</span><br />
                MSFT&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>196.50↓</span><br />
                TSLA&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>32.88↑</span><br />
                ATTS&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>20.00↓</span><br />
                AAPL&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>205.00↑</span><br />
                MSFT&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>196.50↓</span><br />
                TSLA&emsp;&emsp;&emsp;&emsp;<span className={styles.priceUp}>32.88↑</span><br />
                ATTS&emsp;&emsp;&emsp;&emsp;<span className={styles.priceDn}>20.00↓</span><br />
                **small Graphs will be added next to stock prices, like iOS stocks app.      
              </p>
              </div>
            <div className={styles.innerContainer}>
            <p> <h1 className={styles.h1}>Have a quick chat! 'Chatbot'</h1>
                Under development**  
                </p>    
            </div> 
            </div>    
        </header>

        </div>
    );
};
export default InnerHome;
