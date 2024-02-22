'use client'
import React, { useState } from 'react';
import './css/landing.css';
import Navbar from './navbar.js';
import Sidebar from './sidebar.js'; // Import the Sidebar component

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div>
      <Navbar />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === 'Home' && (
          <>
            <p>
              <h5>Find the advice you always wanted,</h5>
              <h4>Take your investments to the next level!</h4>
              <h1>FIND. INVEST. PROFIT! </h1>
            </p>
            <div> <a className='SignUpBtn' href="/signup">Sign Up Now!</a> </div>
          </>
        )}
        {activeTab === 'Portfolio' && <p>Portfolio</p>}
        {activeTab === 'Watchlist' && <p>Watchlist</p>}
        {activeTab === 'About Us' && <p>About Us</p>}
        {activeTab === 'Contact' && <p>Contact</p>}
      </div>
    </div>
  );
};

export default HomePage;
