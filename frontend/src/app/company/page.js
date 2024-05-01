// HomePage.js
'use client'
import React, { useState, useEffect } from 'react';
import './css/landing.css';
import Navbar from './navbar.js';
import Sidebar from './sidebar.js'; // Import the Sidebar component
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

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
  const [activeTab, setActiveTab] = useState('Feed');
  const [selectedStock, setSelectedStock] = useState('AAPL');
    // Stock companies data and stock price updater
    const [companies, setCompanies] = useState([
        // Initial stock data
        { name: "Quantum Solutions", description: "Leading IT solutions.", currentStockPrice: 150, stockChange: 0 },
        { name: "GreenLeaf Renewables", description: "Sustainable energy.", currentStockPrice: 120, stockChange: 0 },
        { name: "TechBridge Communications", description: "Telecommunications.", currentStockPrice: 135, stockChange: 0 },
        { name: "HealthPath Diagnostics", description: "Healthcare diagnostics.", currentStockPrice: 160, stockChange: 0 }
    ]);

    // Use effect to simulate stock price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCompanies(companies => companies.map(company => {
                const change = Math.random() < 0.5 ? -1 : 1; // Randomly decide direction
                const fluctuation = Math.floor(Math.random() * 10); // Random price change
                return {
                    ...company,
                    currentStockPrice: company.currentStockPrice + fluctuation * change,
                    stockChange: change
                };
            }));
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);
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
        {activeTab === 'Feed' && (
            <div>
                <div className='bigSectionBG addPostSection'>
                    <p>Share some news!
                    </p>
                    <div className='form__group field'>
                        <input type="text" className="form__field form__fieldBIO"/>
                        <label htmlFor="name" className="form__label">Type something...</label>
                        <button className='postBtn'>post</button>
                    </div>


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
          {activeTab === 'Profile' && (
              <div>
                  <div className='bigSectionBG'>
                      <p>Track your stock price
                      </p>
                      {/*<span style={{marginBottom    : '20px'}}></span>*/}
                      <br></br>
                      <p className='stockDetailsText'>Previous Close &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 172.62</p>
                      <p className='stockDetailsText'>Open     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 175.60</p>
                      <p className='stockDetailsText'>Bid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;173.05 x 1400</p>
                      <p className='stockDetailsText'>Ask &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;173.07 x 1100</p>
                      <p className='stockDetailsText'>Day's Range &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;173.52 - 177.71</p>
                      <p className='stockDetailsText'>52 Week Range &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;155.98 - 199.62</p>
                      <p className='stockDetailsText'>Volume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 75,000,820</p>
                      <p className='stockDetailsText'>Avg. Volume &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;59,125,448</p>
                      <p className='stockDetailsText'>Market Cap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.683T</p>
                      <p className='stockDetailsText'>Beta (5Y Monthly)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1.29</p>
                      <p className='stockDetailsText'>PE Ratio (TTM) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27.02</p>
                      <p className='stockDetailsText'>EPS (TTM) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.43</p>
                      <p className='stockDetailsText'>Earnings Date May 02, 2024 - May 06, 2024</p>
                      <p className='stockDetailsText'>Forward Dividend & Yield&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0.96 (0.55%)</p>
                      <p className='stockDetailsText'>Ex-Dividend Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Feb 09, 2024</p>
                      <p className='stockDetailsText'>1y Target Est &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;184.96</p>

                      <div className="topChartClass">
                          <Line data={data} options={options}></Line>
                      </div>

                  </div>
                  <div className='bottomRightSectionBG'>
                      <p className='stockDetailsText'>Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                          do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                          dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                          id est laborum.</p>
                      <p className='stockDetailsText'>Address: 55599 st. Alexandria, Egypt</p>
                      <p className='stockDetailsText'>Website: www.aapl.com</p>
                      <p className='stockDetailsText'>Phone: 01014066663</p>





                  </div>
                  <div className='bottomLeftSectionBG'>
                      <h3>Edit your information</h3>
                      <button className="submit-button"></button>
                      <div className='form__group field'>
                          <input type="text" className="form__field form__fieldBIO"/>
                          <label htmlFor="name" className="form__label">Bio</label>
                      </div>
                      <div className='form__group field'>
                          <input type="text" className="form__field"/>
                          <label htmlFor="name" className="form__label">Address</label>
                      </div>
                      <div className='form__group field'>
                          <input type="text" className="form__field"/>
                          <label htmlFor="name" className="form__label">Website</label>
                      </div>
                      <div className='form__group field'>
                          <input type="text" className="form__field"/>
                          <label htmlFor="name" className="form__label">Phone</label>
                      </div>
                      <div className='form__group field'>
                          <input type="date" className="form__field"/>
                          <label htmlFor="name" className="form__label">Next Event</label>
                      </div>

                  </div>
              </div>
          )}
          {activeTab === 'User Statistics' && (
              <div>
                  <div className='bigSectionBG'>
                      <p>Statistics
                      </p>
                      <div className='form__group__watchlist field'>
                          <input type="text" className="form__field"/>
                          <label htmlFor="name" className="form__label">Search for a user</label>
                      </div>
                      <p className='stockDisplayListWatchlist'>
                          <span className='stockDisplayListItem'>Peak number of investors: 300</span>
                          <br></br>
                          <span className='stockDisplayListItem'>Peak user profit: $335</span>
                          <br></br>
                          <span className='stockDisplayListItem'>Biggest stock amount purchased: 95</span>
                      </p>
                      <div className="topChartClassWatchlist">
                          <Line data={data} options={options}></Line>
                      </div>
                  </div>
                  <div className='bottomRightSectionBG'>
                      <div className="bottomRightChartClass">
                          <h3>User Distribution</h3>
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
          {activeTab === 'Search' && (
              <div className={'bigSectionBG searchContainer'}>
                  <Input className="searchBar" />
                  <Table className="SearchResultsTable">
                      <TableCaption>Search Results</TableCaption>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Stock Price</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {companies.map((company, index) => (
                              <TableRow key={index}>
                                  <TableCell className="font-medium SearchCompanyName">{company.name}</TableCell>
                                  <TableCell>{company.description}</TableCell>
                                  <TableCell className={`font-medium ${company.stockChange > 0 ? 'stockIncrease' : 'stockDecrease'}`}>
                                      ${company.currentStockPrice.toFixed(2)} {company.stockChange > 0 ? '↑' : '↓'}
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          )}
          {activeTab === 'About Us' && (
              <div className='bigSectionBG About-Us'>
                  <p>
                      Welcome to <strong>Stock Investment Platform</strong>, your number one source for all things
                      related to stock investment. We're dedicated to providing you the very best of investment advice,
                      with an emphasis on reliability, customer service, and uniqueness.
                  </p>
                  <p>
                      Founded in 2023, <strong>Stock Investment Platform</strong> has come a long way from its
                      beginnings. When we first started out, our passion for helping other investors be more
                      eco-friendly, providing the best equipment for their trading drove us to start our own business.
                  </p>
                  <p>
                      We hope you enjoy our services as much as we enjoy offering them to you. If you have any questions
                      or comments, please don't hesitate to contact us.
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
    </div>
  );
};

export default HomePage;
