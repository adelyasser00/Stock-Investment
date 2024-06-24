// HomePage.js
'use client'
import React, { useState, useEffect, ReactNode } from 'react';
import '../css/landing.css';
import Navbar from '../navbar';
import Sidebar from './sidebar'; // Import the Sidebar component
import { Line, Pie } from "react-chartjs-2";
import Modal from '../components/modal';
import { UserButton, useUser } from "@clerk/nextjs";
import { clerkClient } from '@clerk/nextjs';
import Page from '../onboarding/page';
import { useRouter } from 'next/navigation';
import {checkAndUpdateFeed} from "@/lib/newsfeed/helper";
import {search} from "@/lib/actions/user.actions"
import SearchBar from '../searchbar'
import {getUserById, savePostToUser, getSavedPosts} from '@/lib/actions/user.actions'
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
import { Input } from '@/components/ui/input'
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

async function fetchRSS() {
    try {
        const response = await checkAndUpdateFeed()
        if (response.length==0) {
            throw new Error(`Failed to fetch articles`);
        }
        console.log("RSS received in fetchRSS()");
        return response;
    } catch (error) {
        console.error("Error fetching RSS:", error);
        throw error;  // Rethrowing the error after logging
    }
}
async function savePost(article,clerkId){
    console.log("saving this post")
    console.log(article)
    const result = await savePostToUser(article,clerkId)
    console.log("save successful")
    console.log(result)
    // re-fetch saved posts for the same session
    console.log("fetching the updated saved posts")
    fetchSavedPosts(clerkId)
        .then(savedArticles=>{
            console.log("saved articles received in frontend")
            savedArticles.reverse();
            setSavedArticles(savedArticles);
            console.log("loading saved articles done")
        })
        .catch(error => {
            console.error("Error fetching saved posts:", error);
        });
}
async function fetchSavedPosts(clerkId){
    try{
        const response = await getSavedPosts(clerkId)
        console.log("saved posts received")
        console.log(response)
        return response
    } catch(error){
        console.error("Error fetching saved post:", error);
        throw error;  // Rethrowing the error after logging
    }
}

function extractImageUrl(content) {
    // const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
    const imgTagMatch = content.slice(content.indexOf("src='") + 5).split("'")[0];
    // console.log("=======================================")
    // console.log("extraced image source:",imgTagMatch)

    return imgTagMatch ;
}
async function getUserId (u){
    return await getUserById(u)
}



const HomePage = () => {
    const [savedArticles, setSavedArticles] = useState([]);
    const [articles, setArticles] = useState([]);
    const [activeTab, setActiveTab] = useState('Feed');
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
    const {user} = useUser();
    const clerkId = user?.id

    const [userId,setUserId] = useState(null)

    useEffect(() => {
        setUserId(getUserId(clerkId))
        console.log(clerkId)
        console.log(userId)
        localStorage.setItem('clerkId',clerkId)
    }, []);

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
    useEffect(() => {
        fetchRSS()
            .then(articles => {
                console.log("articles received in frontend")
                setArticles(articles);
                console.log("loading done")
            })
            .catch(error => {
                console.error("Error fetching RSS:", error);
            });
    }, []);
    useEffect(()=>{
        fetchSavedPosts(clerkId)
            .then(savedArticles=>{
                console.log("saved articles received in frontend")
                // get by newest saved first
                savedArticles.reverse();
                setSavedArticles(savedArticles);
                console.log("loading saved articles done")
            })
            .catch(error => {
                console.error("Error fetching saved posts:", error);
            });
    })


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
    const handleSearchResults = (searchResults) => {
        // Assuming searchResults.data contains the array of results
        if (searchResults.data.length > 0) {

            const updatedCompanies = searchResults.data.map(result => ({
                // Use 'ticker' as a name if 'name' is not available in the result
                name: (result.companyName||"") +("\n("+ result.ticker+")")||"" || "No Company Name", // Using 'ticker' as the name if 'name' is absent
                description: result.description||"No description available.", // Default text since description isn't part of the results
                currentStockPrice: Math.random() * 100, // Simulated stock price if not in the results
                stockChange: Math.random() >= 0.5 ? 1 : -1 // Simulated stock change
            }));
            setCompanies(updatedCompanies);
        }
        else {
            setCompanies(
                [
                    {
                        name: "No Results Found",
                        description: "No results found for your search.",
                        currentStockPrice: 0,
                        stockChange: 0
                    }
                ]
            );
        }
    };

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

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <div className='userButton'>
                <UserButton afterSignOutUrl={"https://843e-41-45-12-162.ngrok-free.app"}  />
            </div>

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
                        <div className='bottomOfHomeChart'>
                            <div className='postArea'>
                                {articles.map((article, index) => (
                                    <div key={index} className='postContainer'>
                                        <div className='postContent'>
                                            <p className='postTitle'>
                                                <a href={article.link}>{article.title}</a>
                                            </p>
                                            <p className='postPubDate'>{article.pubDate}</p>
                                            <a href={article.link}>
                                                <img src={extractImageUrl(article.content)} alt="Post Image"
                                                     className="post-image"/>
                                            </a>
                                            <p className='post-text'>{article.contentSnippet}</p>
                                            <button className='submit-button save-button'
                                                    onClick={() => savePost(article, clerkId)}>Save
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
                {activeTab === 'Profile' && (
                    <div>
                        <div className='bigSectionBG'>
                            <div className="topChartClassWatchlist companyProfileChart ">
                                <Line data={data} options={options}></Line>
                            </div>
                            <br></br>
                            <br></br>
                            {/*<p className='stockDisplayListWatchlist bigWatchlist'>*/}
                            <div className='StockDisplayWatchlistStats profileStats'>
                                <p>Track your stock price
                                </p>
                                {/*<span style={{marginBottom    : '20px'}}></span>*/}
                                <br></br>
                                <p className='stockDetailsText'>
                                    Previous Close &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 172.62
                                    <br></br>Open &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 175.60
                                    <br></br>Bid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;173.05 x 1400
                                    <br></br>Ask &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;173.07 x 1100
                                    <br></br>Day's Range &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;173.52 - 177.71
                                    <br></br>52 Week Range &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;155.98 - 199.62
                                    <br></br>Volume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 75,000,820
                                    <br></br>Avg. Volume &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;59,125,448
                                    <br></br>Market Cap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.683T
                                    <br></br>Beta (5Y Monthly)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1.29
                                    <br></br>PE Ratio (TTM) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27.02
                                    {/*<br></br>EPS (TTM) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.43*/}
                                    {/*<br></br>Earnings Date May 02, 2024 - May 06, 2024*/}
                                    {/*<br></br>Forward Dividend & Yield&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0.96 (0.55%)*/}
                                    {/*<br></br>Ex-Dividend Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Feb 09, 2024*/}
                                    {/*<br></br>1y Target Est &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;184.96*/}
                                </p>

                            </div>
                            {/*</p>*/}

                        </div>
                        <div className='bottomRightSectionBG bottomRightCompanyProfile'>
                            <p className='stockDetailsText'>Bio: Lorem ipsum dolor sit amet, consectetur adipiscing
                                elit, sed
                                do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis
                                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                mollit anim
                                id est laborum.</p>
                            <p className='stockDetailsText'>Address: 55599 st. Alexandria, Egypt</p>
                            <p className='stockDetailsText'>Website: www.aapl.com</p>
                            <p className='stockDetailsText'>Phone: 01014066663</p>


                        </div>
                        <div className='bottomLeftSectionBG bottomLeftCompanyProfile'>
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
                            <p className='stockDisplayListWatchlist StockDisplayWatchlistStats userStatistics'>
                                <p>Peak number of investors: 300</p>
                                <br></br>
                                <p>Peak user profit: $335</p>
                                <br></br>
                                <p>Biggest amount purchased: 95</p>
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
                            <h3>Add an investment event!</h3>
                            <button className="submit-button"></button>
                            <div className='form__group field'>
                                <input type="text" className="form__field"/>
                                <label htmlFor="name" className="form__label">Investor Username</label>
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
                                <label htmlFor="name" className="form__label">Investment date</label>
                            </div>

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
                                            <TableCell
                                                className="font-medium SearchCompanyName">{company.name}</TableCell>
                                            <TableCell>{company.description}</TableCell>
                                            <TableCell
                                                className={`font-medium ${company.stockChange > 0 ? 'stockIncrease' : 'stockDecrease'}`}>
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

                                {/*<button className="addWatchlistBtn" onClick={() => addToWatchlist(selectedCompany)}>Add to*/}
                                {/*    Watchlist*/}
                                {/*</button>*/}
                            </div>
                        </Modal>


                    </div>
                )}
                {activeTab === 'About Us' && (
                    <div className='bigSectionBG About-Us'>
                        <p>
                            Welcome to <strong>Stock Investment Platform</strong>, your number one source for all things
                            related to stock investment. We're dedicated to providing you the very best of investment
                            advice,
                            with an emphasis on reliability, customer service, and uniqueness.
                        </p>
                        <p>
                            Founded in 2023, <strong>Stock Investment Platform</strong> has come a long way from its
                            beginnings. When we first started out, our passion for helping other investors be more
                            eco-friendly, providing the best equipment for their trading drove us to start our own
                            business.
                        </p>
                        <p>
                            We hope you enjoy our services as much as we enjoy offering them to you. If you have any
                            questions
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
                {activeTab === 'Saved Posts' && (
                    <div>
                        <div className='bottomOfHomeChart'>
                            <div className='postArea'>
                                {savedArticles.map((article, index) => (
                                    <div key={index} className='postContainer'>
                                        <div className='postContent'>
                                            <p className='postTitle'>
                                                <a href={article.link}>{article.title}</a>
                                            </p>
                                            <p className='postPubDate'>{article.pubDate}</p>
                                            <a href={article.link}>
                                                <img src={extractImageUrl(article.content)} alt="Post Image"
                                                     className="post-image"/>
                                            </a>
                                            <p className='post-text'>{article.contentSnippet}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
