// HomePage.js
'use client'
import React, { useState } from 'react';
import './css/landing.css';
import Navbar from './navbar.js';
import Sidebar from './sidebar.js'; // Import the Sidebar component
import { Line, Pie } from "react-chartjs-2";

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
          <>
            <p>
              <h5>Find the advice you always wanted,</h5>
              <h4>Take your investments to the next level!</h4>
              <h1>FIND. INVEST. PROFIT! </h1>
            </p>
            {/* <div> <a className='SignUpBtn' href="/signup">Sign Up Now!</a> </div> */}
          </>
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
                        <Pie data={pieData} />
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
          {activeTab === 'Watchlist' && <p>Watchlist</p>}
          {activeTab === 'About Us' && <p>About Us</p>}
          {activeTab === 'Contact' && <p>Contact</p>}
      </div>
    </div>
  );
};

export default HomePage;
