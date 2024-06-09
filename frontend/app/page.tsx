// HomePage.js
'use client'
import React, { useState, useEffect } from 'react';
import './css/landing.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import ChatComponent from './chatComponent';
import { Line, Pie } from "react-chartjs-2";
import Modal from './components/modal';
import { UserButton } from "@clerk/nextjs";
import Page from './onboarding/page';
import { useRouter } from 'next/navigation';

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
import { ChartOptions } from 'chart.js';
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
// Function to open modal with company details




const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedStock, setSelectedStock] = useState('AAPL');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
    const [watchlist, setWatchlist] = useState([]);
    // Inside HomePage function component
    const [isFirstLogin, setIsFirstLogin] = useState(() => {
        // Initialize state based on localStorage
        return localStorage.getItem('hasCompletedOnboarding') !== 'true';
    });
    const router = useRouter();

    useEffect(() => {
        if (isFirstLogin) {
            router.push('/onboarding');
        }
    }, [isFirstLogin, router]);

    // Assuming onboarding sets this in localStorage when completed
    useEffect(() => {
        const handleStorageChange = () => {
            if (localStorage.getItem('hasCompletedOnboarding') === 'true') {
                setIsFirstLogin(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);


    const handleCompanyClick = (company) => {
        if (company && company.name && company.currentStockPrice != null) {
            setSelectedCompany(company);
            setIsModalOpen(true);
        } else {
            console.error("Invalid company data");
            // Optionally, display an error message to the user
        }
    };

// When closing the modal, clear the selected company
    const handleCloseModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
        setSelectedCompany(null);
    };
    const addToWatchlist = (company) => {
        if (!watchlist.find(item => item.name === company.name)) {
            setWatchlist([...watchlist, company]);
            alert(`${company.name} added to your watchlist!`);
        } else {
            alert(`${company.name} is already in your watchlist.`);
        }
    };


    // Stock companies data and stock price updater
    const [companies, setCompanies] = useState([
        // Initial stock data
        {
            name: "Quantum Solutions",
            description: "Quantum Solutions stands at the forefront of technology innovation, providing robust IT solutions that drive efficiency and growth. Specializing in cloud services, cybersecurity, and custom software development, we empower businesses to thrive in a digital-first world. Our commitment to excellence and innovation ensures that our clients receive the most advanced and reliable services available.",
            currentStockPrice: 150,
            stockChange: 0
        },
        {
            name: "GreenLeaf Renewables",
            description: "GreenLeaf Renewables is dedicated to advancing the adoption of sustainable energy solutions. We specialize in the development of cutting-edge solar and wind technology projects that reduce carbon footprints and foster sustainable development. Our mission is to make renewable energy accessible and efficient for all, ensuring a greener, more sustainable future.",
            currentStockPrice: 120,
            stockChange: 0
        },
        {
            name: "TechBridge Communications",
            description: "TechBridge Communications is a leader in telecommunications, offering a wide range of services including fiber optics installation, 5G network services, and comprehensive infrastructure management. We are committed to bridging the digital divide by enhancing connectivity in both urban and remote areas, thus facilitating seamless communication and business operations.",
            currentStockPrice: 135,
            stockChange: 0
        },
        {
            name: "HealthPath Diagnostics",
            description: "HealthPath Diagnostics revolutionizes the healthcare industry by providing cutting-edge diagnostic tools and AI-driven analysis. Our technologies improve patient outcomes and enhance preventive care strategies through innovative, accurate, and accessible diagnostic solutions. We are dedicated to transforming healthcare with technology, making high-quality care achievable for everyone.",
            currentStockPrice: 160,
            stockChange: 0
        }
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
        labels: salesData[selectedStock].map(data => data.month),
        datasets: [
            {
                label: selectedStock,
                data: salesData[selectedStock].map(data => data.sales),
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

    const options: ChartOptions<"line"> = {
        plugins: {
            legend: {
                display: true,
            },
        },
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 16,
                        weight: 'bold',
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
                        style: 'italic',
                        family: 'Arial',
                    },
                },
                min: 50,
            },
            x: {
                ticks: {
                    font: {
                        size: 14,
                        weight: 'bold',
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
                        style: 'italic',
                        family: 'Arial',
                    },
                },
            },
        },
    };


    return (
    <div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className='userButton'>
            <UserButton  />
        </div>


      <div>
        {activeTab === 'Home' && (
            <div>
                <div className='bigSectionBG'>
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

                    </p>
                    <br></br>
                    <br></br>
                    <p className='stockDisplayListWatchlist'>
                        <div className='StockDisplayWatchlistStats'>
                            <span>Previous Close: 172.62  &emsp;&emsp;    Open: 175.60&emsp;&emsp;    Bid 173.05 x 1400&emsp;&emsp; Volume: 75,000,820</span>
                            <br></br>
                            <span> Ask: 173.07 x 1100&emsp;&emsp; Day's Range: 173.52 - 177.71 &emsp;&emsp;52 Week Range: 155.98 - 199.62</span>
                        </div>
                    </p>

                    <div className="topChartClassWatchlist">
                        <Line data={data} options={options}></Line>
                    </div>

                </div>
                <div className='bottomOfHomeChart'>
                {/*    <div className='sideBlocks'>*/}
                {/*<div className='bottomRightSectionBGHome'>*/}
                {/*    <h2>Trending stocks</h2>*/}
                {/*    <ul>*/}
                {/*        <li><p className='newsFont'>ACS </p> <p className='newsFont stockDecrease'>5.77 -0.02</p></li>*/}
                {/*        <li><p className='newsFont'>NBD </p> <p className='newsFont stockIncrease'>3.86 +0.34</p></li>*/}

                {/*        <li><p className='newsFont'>HSBC </p> <p className='newsFont stockDecrease'>0.77 +0.08</p></li>*/}
                {/*    </ul>*/}
                {/*</div>*/}

                {/*<div className='bottomLeftSectionBGHome'>*/}
                {/*    <h2>Latest News</h2>*/}
                {/*    <ul>*/}
                {/*        <li><p className='newsFont'>'Excessive fragmentation': Vodafone in €8bn Italy exit as CEO*/}
                {/*            ...</p></li>*/}
                {/*        <li><p className='newsFont'>Nvidia GTC 2024: What to expect from the AI giant's big*/}
                {/*            conference</p></li>*/}
                {/*        <li><p className='newsFont'>All eyes on the Federal Reserve: What to know this week</p></li>*/}
                {/*    </ul>*/}
                {/*</div>*/}
                {/*    </div>*/}
                <div className='postArea'>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>HSBC CO.</p>
                        <p className={'post-text'}>Tech Innovations Inc. has outperformed market expectations in the latest financial quarter, registering a significant increase in revenue. This growth is attributed primarily to robust sales in their innovative consumer technology sector.</p>
                        <p className={'post-text'}>However, despite the increase in revenue, the company's profit margins have faced pressures due to rising raw material costs and increased expenditures on research and development.</p>
                        <p className={'post-text'}>The company's executive team remains optimistic about future prospects, citing strong pre-orders for upcoming products and a stable increase in market share across key regions.</p>
                        <p className={'post-text'}>In response to financial results, Tech Innovations Inc. has announced plans to expand into new international markets, aiming to capitalize on emerging consumer trends and increase global reach.</p>
                        <p className={'post-text'}>Analysts have adjusted their forecasts for the company’s stock, with several major firms upgrading their ratings, reflecting confidence in the company’s strategic direction and its potential for sustained growth.</p>

                        <div className='post-imageContainer'>
                        <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="post-image"/>
                        <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="post-image"/>
                        </div>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Ezz Steel Company Ltd.</p>
                        <p className={'post-text'}>Global Pharma Co. reported a mixed financial performance this quarter, with revenue slightly below expectations due to disruptions in the supply chain. The impact was notably significant in overseas markets.</p>
                        <p className={'post-text'}>Despite the revenue shortfall, the company achieved a higher profit margin thanks to cost-saving measures implemented in the previous year.</p>
                        <p className={'post-text'}>The firm has successfully launched two new blockbuster drugs, which are expected to contribute significantly to future revenues, as confirmed by the early strong market acceptance.</p>
                        <p className={'post-text'}>In an effort to boost investor confidence, Global Pharma Co. has announced an increase in their quarterly dividend and a new share buyback program.</p>
                        <p className={'post-text'}>Market analysts remain cautiously optimistic about the company’s trajectory, citing the need for continued innovation and market expansion to sustain growth.</p>
                        <div className='post-imageContainer'>
                            <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="post-image"/>
                            <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="post-image"/>
                            <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="post-image"/>

                        </div>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Allianz Bank</p>
                        <p className={'post-text'}>EcoEnergy Solutions has exceeded analyst predictions with a
                            record-breaking revenue this quarter, driven by a surge in demand for renewable energy
                            solutions.</p>
                        <p className={'post-text'}>Operating expenses have risen in tandem with sales, reflecting the
                            company's investment in scaling up production capabilities and enhancing their supply
                            chain.</p>
                        <p className={'post-text'}>The company's strategic partnerships with major industrial players
                            have been instrumental in achieving these results, positioning EcoEnergy as a leader in
                            sustainable energy technologies.</p>
                        <p className={'post-text'}>Looking forward, EcoEnergy is expanding its R&D department to focus
                            on next-generation solar panels and energy storage systems.</p>
                        <p className={'post-text'}>With government subsidies expected to bolster the renewable sector,
                            analysts are revising their growth projections upwards for EcoEnergy Solutions.</p>

                        <div className='post-imageContainer'>
                            <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="post-image"/>
                        </div>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Fathallah Gomla Market</p>
                        <p className={'post-text'}>Luxury Living Furnishings reported a decline in quarterly revenue,
                            attributing the downturn to a sluggish luxury goods market and decreased consumer spending
                            in key demographics.</p>
                        <p className={'post-text'}>Despite lower sales, the company has managed to maintain
                            profitability through stringent cost controls and inventory management.</p>
                        <p className={'post-text'}>In response to current market conditions, Luxury Living is pivoting
                            towards more online sales channels and enhancing their digital marketing efforts.</p>
                        <p className={'post-text'}>The company also announced a new designer partnership aimed at
                            rejuvenating its product line and attracting a younger clientele.</p>
                        <p className={'post-text'}>Analysts are closely watching Luxury Living's strategic shifts, with
                            some expressing concerns about the brand's ability to adapt to rapidly changing consumer
                            preferences.</p>

                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>HSBC CO.</p>
                        <p className={'post-text'}>This is a post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Ezz Steel Company Ltd.</p>
                        <p className={'post-text'}>This is another post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Allianz Bank</p>
                        <p className={'post-text'}>and Another post</p>
                        <p className={'post-text'}>with multiple lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Fathallah Gomla Market</p>
                        <p className={'post-text'}>and Another post</p>
                        <p className={'post-text'}>with one,</p>
                        <p className={'post-text'}>Two Three lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>HSBC CO.</p>
                        <p className={'post-text'}>This is a post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Ezz Steel Company Ltd.</p>
                        <p className={'post-text'}>This is another post</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Allianz Bank</p>
                        <p className={'post-text'}>and Another post</p>
                        <p className={'post-text'}>with multiple lines</p>
                    </div>
                    <div className='postContainer'>
                        <p style={{color: '#7140DEFF'}}>Fathallah Gomla Market</p>
                        <p className={'post-text'}>and Another post</p>
                        <p className={'post-text'}>with one,</p>
                        <p className={'post-text'}>Two Three lines</p>
                    </div>
                </div>
                </div>
            </div>
        )}
          {activeTab === 'Portfolio' && (
              <div>
                  <div className='bigSectionBG'>
                      <p>Your Stocks
                      </p>
                      <p className='stockDisplayListWatchlist'>
                          <span className='stockDisplayListItem' onClick={() => setSelectedStock('AAPL')}>AAPL</span>
                          <br></br>
                          <span className='stockDisplayListItem' onClick={() => setSelectedStock('MSFT')}>MSFT</span>
                          <br></br>
                          <span className='stockDisplayListItem' onClick={() => setSelectedStock('TSLA')}>TSLA</span>
                      </p>
                      <div className="topChartClassWatchlist watchlistChart">
                          <Line data={data} options={options}></Line>
                      </div>
                      <br></br>
                      <br></br>
                      <p className='stockDisplayListWatchlist bigWatchlist'>
                          <div className='StockDisplayWatchlistStats'>
                              <span>Previous Close: 172.62  &emsp;&emsp;    Open: 175.60&emsp;&emsp;    Bid 173.05 x 1400&emsp;&emsp; Volume: 75,000,820</span>
                              <br></br>
                              <span> Ask: 173.07 x 1100&emsp;&emsp; Day's Range: 173.52 - 177.71 &emsp;&emsp;52 Week Range: 155.98 - 199.62</span>
                          </div>
                      </p>

                  </div>
                  <div className='bottomOfHomeChart'>
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
                  <br></br>
                  <br></br>
                  <p className='stockDisplayListWatchlist'>
                      <div className='StockDisplayWatchlistStats'>
                          <span>Previous Close: 172.62  &emsp;&emsp;    Open: 175.60&emsp;&emsp;    Bid 173.05 x 1400&emsp;&emsp; Volume: 75,000,820</span>
                          <br></br>
                          <span> Ask: 173.07 x 1100&emsp;&emsp; Day's Range: 173.52 - 177.71 &emsp;&emsp;52 Week Range: 155.98 - 199.62</span>
                      </div>
                  </p>
                  <div className="topChartClassWatchlist">
                      <Line data={data} options={options}></Line>
                  </div>
              </div>
          )}
          {activeTab === 'Search' && (
              <div>
                  <div className={'bigSectionBG searchContainer'}>
                      <Input className="searchBar"/>
                      <Table className="SearchResultsTable">
                          {/* Tabletjsx content */}
                          <TableBody>
                              {companies.map((company, index) => (
                                  <TableRow key={index} onClick={() => handleCompanyClick(company)}>
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
                  <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                      <div style={{position: 'relative'}}>

                          {/* Adding an image below the close button but aligned to the top right corner */}
                          <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" style={{
                              position: 'absolute',
                              right: '10px',
                              top: '40px',
                              width: '150px',
                              height: '150px'
                          }}/>
                          <br/><br/><br/>
                          <h1 style={{fontSize: '48px'}}>{selectedCompany?.name}</h1>
                          <br/><br/>
                          <p>{selectedCompany?.description}</p>
                          <br/><br/><br/><br/>
                          <p className="profileStockValue">
                              Current Stock Price:
                              <span
                                  className={`${selectedCompany?.stockChange > 0 ? 'stockIncrease' : 'stockDecrease'}`}>
                &nbsp;${selectedCompany?.currentStockPrice?.toFixed(2)}
                                  {selectedCompany?.stockChange > 0 ? '↑' : '↓'}
            </span>
                          </p>

                          <button className="addWatchlistBtn" onClick={() => addToWatchlist(selectedCompany)}>Add to
                              Watchlist
                          </button>
                      </div>
                  </Modal>


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
          {activeTab === 'Chatbot' && (
              <div className='bigSectionBG chatbot'>
                  <ChatComponent />
              </div>
          )}
      </div>

    </div>
  );
};

export default HomePage;
