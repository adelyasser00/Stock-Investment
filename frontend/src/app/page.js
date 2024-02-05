import React from 'react';
import './css/landing.css';
import Navbar from './navbar.js';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div><p>Welcome to our stock investment website! We provide comprehensive analysis, real-time market data, and expert insights to help you make informed investment decisions. Whether you're a beginner or an experienced investor, we've got you covered. Start exploring our platform today and take your investment journey to the next level.</p>
      </div>
      <div> <a className='SignUpBtn' href="/signup">Sign Up Now!</a> </div>

    </div>
    
  );
};

export default HomePage;

