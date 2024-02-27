// HomePage.js
'use client'
import React, { useState } from 'react';
import './css/landing.css';
import Navbar from './navbar.js';
import Sidebar from './sidebar.js'; // Import the Sidebar component
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

const salesData = [
  { month: "January", sales: 100 },
  { month: "February", sales: 150 },
  { month: "March", sales: 200 },
  { month: "April", sales: 120 },
  { month: "May", sales: 300 },
  { month: "June", sales: 250 },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const data = {
    labels: salesData.map((data) => data.month),
    datasets: [
      {
        label: "Revenue",
        data: salesData.map((data) => data.sales),
        borderColor: "#cb0c9f",
        borderWidth: 3,
        pointBorderColor: "#cb0c9f",
        pointBorderWidth: 3,
        tension: 0.5,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#f797e1");
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
            size: 17,
            weight: "bold",
          },
        },
        title: {
          display: true,
          text: "Sales",
          padding: {
            bottom: 10,
          },
          font: {
            size: 30,
            style: "italic",
            family: "Arial",
          },
        },
        min: 50,
      },
      x: {
        ticks: {
          font: {
            size: 17,
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
            size: 30,
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
            <p>Portfolio</p>
            <div className="topChartClass">
        <Line data={data} options={options}></Line>
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
