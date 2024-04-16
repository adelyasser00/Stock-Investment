// HomePage.js
'use client'
import React, { useState } from 'react';
import './css/landing.css';
import Navbar from './navbar.js';
import Sidebar from './sidebar.js'; // Import the Sidebar component
import ChatComponent from './chatComponent.js';
import { Line, Pie } from "react-chartjs-2";
import { UserButton } from "@clerk/nextjs";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
  Filler,
    ArcElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
  ArcElement,
);

const salesData = {
  AAPL: [
 { month: "January"  , sales: 100 } ,
 { month: "February" , sales: 150 } ,
 { month: "March"    , sales: 200 } ,
 { month: "April"    , sales: 120 } ,
 { month: "May"      , sales: 300 } ,
 { month: "June"     , sales: 250 } ,
 ]                   ,
 MSFT: [
 { month: "January"  , sales: 110 } ,
 { month: "February" , sales: 300 } ,
 { month: "March"    , sales: 210 } ,
 { month: "April"    , sales: 860 } ,
 { month: "May"      , sales: 500 } ,
 { month: "June"     , sales: 260 } ,
 ]                   ,
 TSLA: [
 { month: "January"  , sales: 120 } ,
 { month: "February" , sales: 170 } ,
 { month: "March"    , sales: 220 } ,
 { month: "April"    , sales: 140 } ,
 { month: "May"      , sales: 320 } ,
 { month: "June"     , sales: 390 } ,
 ]                   ,

};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedStock, setSelectedStock] = useState('AAPL');
    const pieData = {
        labels: ['AAPL', 'MSFT', 'TSLA'],
        datasets: [
            {
                data: [35, 45, 20],
                backgroundColor: ['#7140DEFF', 'grey', 'black'],
            },
        ],
    };
  const calculateColor = (stockData) => {
    const lastMonth = stockData[stockData.length - 1];
    const secondLastMonth = stockData[stockData.length - 2];

    if (lastMonth.sales > secondLastMonth.sales) {
      // If the last change was an increase, return green
      return {
        borderColor: "#00ff00",
        pointBorderColor: "#00dd00",
        gradientColor: "#00dd00",
      };
    } else {
      // If the last change was a decrease, return red
      return {
        borderColor: "#ff0000",
        pointBorderColor: "#dd0000",
        gradientColor: "#dd0000",
      };
    }
  };

  const color = calculateColor(salesData[selectedStock]);

  const data = {
    labels: salesData[selectedStock].map((data) => data.month),
    datasets: [
      {
        label: selectedStock,
        data: salesData[selectedStock].map((data) => data.sales),
        borderColor: color.borderColor,
        borderWidth: 3,
        pointBorderColor: color.pointBorderColor,
        pointBorderWidth: 3,
        tension: 0.5,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, color.gradientColor);
          gradient.addColorStop(1, "white");
          return gradient;
        },
      },
    ],
  };

  const options = {
    plugins: {
      legend: true,
    },
    responsive: true,
    scales: {
      y: {
        ticks: {
          font: {
            size: 16,
            weight: "bold",
          },
        },
        title: {
          display: true,
          text: "Price",
          padding: {
            bottom: 10,
          },
          font: {
            size: 20,
            style: "italic",
            family: "Arial",
          },
        },
        min: 50,
      },
      x: {
        ticks: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
        title: {
          display: true,
          text: "Month",
          padding: {
            top: 10,
          },
          font: {
            size: 20,
            style: "italic",
            family: "Arial",
          },
        },
      },
    },
    
  };


  return (
    <div>
      <Navbar />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />


      <div>
        {activeTab === 'Home' && (
            <div>
                <div className='bigSectionBG' style={{transform: 'translateX(-40%) translateY(15%)'}}>
                    <p>Recommendations, Just for you!
                    </p>
                    <div className='form__group__watchlist field'>
                        <input type="text" className="form__field"/>
                        <label htmlFor="name" className="form__label">Search amongst recommendations</label>
                    </div>
                    <p className='stockDisplayListWatchlist'>
                        <span className='stockDisplayListItem' onClick={() => setSelectedStock('AAPL')}>AAPL</span>
                        <br></br>
                        <span className='stockDisplayListItem' onClick={() => setSelectedStock('MSFT')}>ALDX</span>
                        <br></br>
                        <span className='stockDisplayListItem' onClick={() => setSelectedStock('TSLA')}>BASE</span>
                        <br></br>
                        <span className='stockDisplayListItem' onClick={() => setSelectedStock('MSFT')}>MSFT</span>
                        <br></br>
                        <span className='stockDisplayListItem' onClick={() => setSelectedStock('TSLA')}>TSLA</span>
                        <br></br>
                        <br></br>
                        <span
                            className='stockDisplayListItem'>Previous Close: 172.62  &emsp;&emsp;    Open: 175.60&emsp;&emsp;    Bid 173.05 x 1400&emsp;&emsp; Volume: 75,000,820</span>
                        <br></br>
                        <span className='stockDisplayListItem'> Ask: 173.07 x 1100&emsp;&emsp; Day's Range: 173.52 - 177.71 &emsp;&emsp;52 Week Range: 155.98 - 199.62</span>

                    </p>
                    <div className="topChartClassWatchlist">
                        <Line data={data} options={options}></Line>
                    </div>

                </div>

                <div className='bottomRightSectionBGHome'>
                    <h2>Trending stocks</h2>
                    <ul>
                        <li><p className='newsFont'>ACS </p> <p class='newsFont stockDecrease'>5.77 -0.02</p></li>
                        <li><p className='newsFont'>NBD </p> <p class='newsFont stockIncrease'>3.86 +0.34</p></li>

                        <li><p className='newsFont'>HSBC </p> <p class='newsFont stockDecrease'>0.77 +0.08</p></li>
                    </ul>
                </div>

                <div className='bottomLeftSectionBGHome'>
                    <h2>Latest News</h2>
                    <ul>
                        <li><p className='newsFont'>'Excessive fragmentation': Vodafone in €8bn Italy exit as CEO
                            ...</p></li>
                        <li><p className='newsFont'>Nvidia GTC 2024: What to expect from the AI giant's big
                            conference</p></li>
                        <li><p className='newsFont'>All eyes on the Federal Reserve: What to know this week</p></li>
                    </ul>
                </div>
                <div className='postArea'>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>HSBC CO.</p>
                        <p>This is a post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Ezz Steel Company Ltd.</p>
                        <p>This is another post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Allianz Bank</p>
                        <p>and Another post</p>
                        <p>with multiple lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Fathallah Gomla Market</p>
                        <p>and Another post</p>
                        <p>with one,</p>
                        <p>Two Three lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>HSBC CO.</p>
                        <p>This is a post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Ezz Steel Company Ltd.</p>
                        <p>This is another post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Allianz Bank</p>
                        <p>and Another post</p>
                        <p>with multiple lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Fathallah Gomla Market</p>
                        <p>and Another post</p>
                        <p>with one,</p>
                        <p>Two Three lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>HSBC CO.</p>
                        <p>This is a post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Ezz Steel Company Ltd.</p>
                        <p>This is another post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Allianz Bank</p>
                        <p>and Another post</p>
                        <p>with multiple lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Fathallah Gomla Market</p>
                        <p>and Another post</p>
                        <p>with one,</p>
                        <p>Two Three lines</p>
                    </div>
                </div>
            </div>
        )}
          {activeTab === 'Portfolio' && (
              <div className='bigSectionBG'>
                  <p>Your Stocks
                  </p>
                  <p className='stockDisplayList'>
                      <span className='stockDisplayListItem' onClick={() => setSelectedStock('AAPL')}>AAPL</span>
                      <br></br>
                      <span className='stockDisplayListItem' onClick={() => setSelectedStock('MSFT')}>MSFT</span>
                      <br></br>
                      <span className='stockDisplayListItem' onClick={() => setSelectedStock('TSLA')}>TSLA</span>
                  </p>
                  <div className="topChartClass">
                      <Line data={data} options={options}></Line>
                  </div>
                  <div className='bottomRightSectionBG'>
                      <div className="bottomRightChartClass">
                      <h3>Stock Distribution</h3>
                          <Pie data={pieData}/>
                      </div>

                  </div>
                  <div className='bottomLeftSectionBG'>
                      <h3>Add your stocks</h3>
                    <button className="submit-button"></button>
                    <div className='form__group field'>
                        <input type="text" className="form__field"/>
                        <label htmlFor="name" className="form__label">Stock Name</label>
                    </div>
                    <div className='form__group field'>
                        <input type="text" className="form__field"/>
                        <label htmlFor="name" className="form__label">$ Stock Price </label>
                    </div>
                    <div className='form__group field'>
                        <input type="text" className="form__field"/>
                        <label htmlFor="name" className="form__label">Amount Purchased</label>
                    </div>
                    <div className='form__group field'>
                        <input type="date" className="form__field"/>
                        <label htmlFor="name" className="form__label">Purchase date</label>
                    </div>

                </div>
            </div>
        )}
          {activeTab === 'Watchlist' && (
              <div className='bigSectionBG'>
                  <p>My WatchList
                  </p>
                  <div className='form__group__watchlist field'>
                      <input type="text" className="form__field"/>
                      <label htmlFor="name" className="form__label">Add a stock</label>
                  </div>
                  <p className='stockDisplayListWatchlist'>
                      <span className='stockDisplayListItem' onClick={() => setSelectedStock('AAPL')}>AAPL</span>
                      <br></br>
                      <span className='stockDisplayListItem' onClick={() => setSelectedStock('MSFT')}>MSFT</span>
                      <br></br>
                      <span className='stockDisplayListItem' onClick={() => setSelectedStock('TSLA')}>TSLA</span>
                  </p>
                  <div className="topChartClassWatchlist">
                      <Line data={data} options={options}></Line>
                  </div>
              </div>
          )}
          {activeTab === 'About Us' && (
              <div className='bigSectionBG About-Us'>
                  <p>
                      Welcome to <strong>Stock Investment Platform</strong>, your number one source for all things related to stock investment. We're dedicated to providing you the very best of investment advice, with an emphasis on reliability, customer service, and uniqueness.
                  </p>
                  <p>
                      Founded in 2023, <strong>Stock Investment Platform</strong> has come a long way from its beginnings. When we first started out, our passion for helping other investors be more eco-friendly, providing the best equipment for their trading drove us to start our own business.
                  </p>
                  <p>
                      We hope you enjoy our services as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                  </p>
              </div>
          )}
          {activeTab === 'Contact' && (
              <div className='bigSectionBG Contact'>
                  <h1>
                      For further inquiries:
                  </h1>
                  <p>
                      Email: es-adelyasser00@alexu.edu.eg
                  </p>
                  <p>
                      Mobile: +20 1014066663
                  </p>
                  <p>
                      Telephone: +20 1014066663
                  </p>
              </div>
          )}
      </div>
        <ChatComponent />
    </div>
  );
};

export default HomePage;
