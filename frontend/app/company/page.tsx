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
import {fetchInvestmentsByCompanyClerkId, getCompanyById, updateCompany} from '@/lib/actions/company.actions';
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
async function savePost(article,clerkId,setSavedArticles){
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

async function getCompany(clerkId){
    return getCompanyById(clerkId)
}


const HomePage = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: []
    });
    const [chartData, setChartData] = useState(null);
    const [userAccount, setUserAccount] = useState(null);
    const [investments, setInvestments] = useState([]);
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
    const clerkId = user?.id;


    const [userId,setUserId] = useState(null);
    const [company, setCompany] = useState(null);



    // useEffect(() => {
    //     getUserById(clerkId)
    //         .then(userAccount=>{
    //             console.log("fetched user account",userAccount)
    //             setUserAccount(userAccount)
    //         }).catch(
    //             console.error("UserId fail")
    //     )
    // }, []);
    // useEffect(() => {
    //     console.log("user account updated",userAccount)
    // }, [userAccount]);

    useEffect(() => {
        if (clerkId){
            console.log("before fetch investment")
            fetchInvestmentsByCompanyClerkId(clerkId)
                .then(investments=>{
                    console.log("investments received in frontend")
                    console.log("investments fetched:",investments)
                    getCompany(investments[0].companyClerkId)
                        .then(company=>{
                            console.log("company received in frontend")
                            console.log("investments fetched:",company)
                            setCompany(company)
                        })
                    setInvestments(investments)
                    console.log("loading done")
                }).catch(error => {
                console.error("Error fetching investments:", error);
            });}

    }, [clerkId]);
    useEffect(() => {
        console.log("company fetched:",company)
    }, [company]);
    useEffect(() => {
        console.log("investments have changed:",investments)
    }, []);

    useEffect(() => {
        setUserId(getUserId(clerkId))
        console.log(clerkId)
        console.log(userId)
        localStorage.setItem('clerkId',clerkId)
    }, []);
    useEffect(() => {
        console.log("userId has changed:",userId)
    }, [userId]);

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
    useEffect(() => {
        if (clerkId) {
            fetchSavedPosts(clerkId)
                .then(savedArticles => {
                    console.log("saved articles received in frontend")
                    savedArticles.reverse();
                    setSavedArticles(savedArticles);
                    console.log("loading saved articles done")
                })
                .catch(error => {
                    console.error("Error fetching saved posts:", error);
                });
        }
    }, [clerkId]);


    const handleCompanyClick = (company) => {
        if (company && company.name) {
            setSelectedCompany(company);
            console.log("selected Company: " + company.ticker)
            console.log(company.history['06/13/2024'])
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
    //     {
    //         name: "Quantum Solutions",
    //         description: "Quantum Solutions stands at the forefront of technology innovation, providing robust IT solutions that drive efficiency and growth. Specializing in cloud services, cybersecurity, and custom software development, we empower businesses to thrive in a digital-first world. Our commitment to excellence and innovation ensures that our clients receive the most advanced and reliable services available.",
    //         currentStockPrice: 150,
    //         stockChange: 0
    //     },
    //     {
    //         name: "GreenLeaf Renewables",
    //         description: "GreenLeaf Renewables is dedicated to advancing the adoption of sustainable energy solutions. We specialize in the development of cutting-edge solar and wind technology projects that reduce carbon footprints and foster sustainable development. Our mission is to make renewable energy accessible and efficient for all, ensuring a greener, more sustainable future.",
    //         currentStockPrice: 120,
    //         stockChange: 0
    //     },
    //     {
    //         name: "TechBridge Communications",
    //         description: "TechBridge Communications is a leader in telecommunications, offering a wide range of services including fiber optics installation, 5G network services, and comprehensive infrastructure management. We are committed to bridging the digital divide by enhancing connectivity in both urban and remote areas, thus facilitating seamless communication and business operations.",
    //         currentStockPrice: 135,
    //         stockChange: 0
    //     },
    //     {
    //         name: "HealthPath Diagnostics",
    //         description: "HealthPath Diagnostics revolutionizes the healthcare industry by providing cutting-edge diagnostic tools and AI-driven analysis. Our technologies improve patient outcomes and enhance preventive care strategies through innovative, accurate, and accessible diagnostic solutions. We are dedicated to transforming healthcare with technology, making high-quality care achievable for everyone.",
    //         currentStockPrice: 160,
    //         stockChange: 0
    //     }
    ]);
    const handleSearchResults = (searchResults) => {
        // Assuming searchResults.data contains the array of results
        if (searchResults.data.length > 0) {

            const updatedCompanies = searchResults.data.map(result => ({
                // Use 'ticker' as a name if 'name' is not available in the result
                name: (result.companyName||"") +("\n("+ result.ticker+")")||"" || "No Company Name", // Using 'ticker' as the name if 'name' is absent
                description: result.description||"No description available.", // Default text since description isn't part of the results
                ticker:result.ticker,
                details: result.details,
                history: result.History,
                _id: result._id
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

    // // Use effect to simulate stock price updates
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCompanies(companies => companies.map(company => {
    //             const change = Math.random() < 0.5 ? -1 : 1; // Randomly decide direction
    //             const fluctuation = Math.floor(Math.random() * 10); // Random price change
    //             return {
    //                 ...company,
    //                 currentStockPrice: company.currentStockPrice + fluctuation * change,
    //                 stockChange: change
    //             };
    //         }));
    //     }, 5000); // Update every 5 seconds
    //
    //     return () => clearInterval(interval);
    // }, []);
    // const pieData = {
    //     labels: ['AAPL', 'MSFT', 'TSLA'],
    //     datasets: [
    //         {
    //             data: [35, 45, 20],
    //             backgroundColor: ['#7140DEFF', 'grey', 'black'],
    //         },
    //     ],
    // };
    // const calculateColor = (stockData) => {
    //     const lastMonth = stockData[stockData.length - 1];
    //     const secondLastMonth = stockData[stockData.length - 2];
    //
    //     if (lastMonth.sales > secondLastMonth.sales) {
    //         // If the last change was an increase, return green
    //         return {
    //             borderColor: "#00ff00",
    //             pointBorderColor: "#00dd00",
    //             gradientColor: "#00dd00",
    //         };
    //     } else {
    //         // If the last change was a decrease, return red
    //         return {
    //             borderColor: "#ff0000",
    //             pointBorderColor: "#dd0000",
    //             gradientColor: "#dd0000",
    //         };
    //     }
    // };
    //
    // const color = calculateColor(salesData[selectedStock]);
    useEffect(() => {
        if (company && company.History) {
            console.log("inside if of useEffect for chartData after change in selectedStock")
            // Ensure that history is an object with keys before trying to access them
            const dates = Object.keys(company.History).sort((a, b) => {
                return new Date(a as string).getTime() - new Date(b as string).getTime();
            });
            console.log("dates: ", dates)
            const sales = dates.map(date => parseFloat(company.History[date]));

            const color = {
                borderColor: "#00ff00", // Green for increase
                pointBorderColor: "#00dd00",
                gradientColor: "#00dd00",
            }  // Ensure calculateColor can handle an empty or undefined 'history'

            const newChartData = {
                labels: dates,
                datasets: [{
                    label: company.ticker,  // Using ticker as the label
                    data: sales,
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
                }]
            };

            setChartData(newChartData);
        } else {
            // Handle cases where selectedStock or its history is not available
            console.log("inside else of useEffect for chartData after change in selectedStock")

            setChartData({
                labels: [],
                datasets: []
            });
        }
    }, [company]); // Dependency on selectedStock ensures updates when stock selection changes


    useEffect(() => {
        // Setting up the chart data
        setData({
            labels: investments.map(inv => new Date(inv.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })),
            datasets: [
                {
                    label: 'Sell',
                    data: investments.filter(inv => inv.isSell).map(inv => inv.price),
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.5,
                    fill: true
                },
                {
                    label: 'Buy',
                    data: investments.filter(inv => !inv.isSell).map(inv => inv.price),
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.5,
                    fill: true
                }
            ]
        });
    }, [investments]);  // Dependency array to update chart when investments data changes

    const options = {
        plugins: {
            legend: {
                display: true
            }
        },
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Price ($)",
                    font: {
                        size: 20,
                        style: 'italic',
                        family: 'Arial'
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Date",
                    font: {
                        size: 20,
                        style: 'italic',
                        family: 'Arial'
                    }
                }
            }
        }
    };

    const [editMode, setEditMode] = useState(false);
    const [editedCompany, setEditedCompany] = useState({
        companyName: '',
        description: '',
        bio: '',
        email: '',
        website: '',
    });

// Update editedCompany state when company data changes
    useEffect(() => {
        if (company && editMode) {
            setEditedCompany({
                companyName: company.companyName || '',
                description: company.description || '',
                bio: company.bio || '',
                email: company.email || '',
                website: company.website || '',
            });
        }
    }, [company, editMode]);

    const handleEdit = () => {
        setEditMode(!editMode);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCompany(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Updated Data:', editedCompany);

        // Prepare the data according to UpdateCompanyParams
        const updateParams = {
            companyName: editedCompany.companyName,
            description: editedCompany.description,
            bio: editedCompany.bio,
            email: editedCompany.email,
            website: editedCompany.website,
        };

        try {
            // Update the company information on the server
            console.log("updateParams before call:",updateParams,"clerkId:",clerkId)
            await updateCompany(company.clerkId, updateParams);
            console.log('Company updated successfully.');

            // Fetch the updated company information
            const updatedCompany = await getCompanyById(company.clerkId);
            if (updatedCompany) {
                // Update the local state to reflect the new company data
                setCompany(updatedCompany);
                console.log('Company data refreshed.');
            } else {
                console.error('Failed to fetch updated company data.');
            }
        } catch (error) {
            console.error('Error updating or fetching company:', error);
        }

        // Exit edit mode
        setEditMode(false);
    };


    return (
        <div>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <div className='userButton'>
                <UserButton afterSignOutUrl={"/"}  />
            </div>

            <div>
                {activeTab === 'Feed' && (
                    <div>
                    {/*//     <div className='bigSectionBG addPostSection'>*/}
                    {/*//         <p>Share some news!*/}
                    {/*//         </p>*/}
                    {/*//         <div className='form__group field'>*/}
                    {/*//             <input type="text" className="form__field form__fieldBIO"/>*/}
                    {/*//             <label htmlFor="name" className="form__label">Type something...</label>*/}
                    {/*//             <button className='postBtn'>post</button>*/}
                    {/*//         </div>*/}
                    {/*//*/}
                    {/*//*/}
                    {/*//     </div>*/}
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
                            <p>Track your stock price
                            </p>
                            <div className="">
                                <Line data={chartData} options={options}></Line>
                            </div>
                        </div>
                        <div className='bigSectionBG'>
                            {/*<p className='stockDisplayListWatchlist bigWatchlist'>*/}
                            <div style={{
                                padding: "20px",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                marginBottom: "20px",
                                position: "relative"  // To position the edit button absolutely within the container
                            }}>
                                {editMode ? (
                                        <form onSubmit={handleSubmit} style={{
                                            marginTop: "20px",
                                            padding: "20px",
                                            backgroundColor: "#f9f9f9",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                            color: "#333",
                                            fontSize: "16px"
                                        }}>
                                            <div style={{ marginBottom: "20px" }}>
                                                <label style={{ fontWeight: "bold", display: "block" }}>Company Name:
                                                    <input type="text" name="companyName" value={editedCompany.companyName}
                                                           onChange={handleChange} style={{ width: "100%", padding: "8px", margin: "8px 0" }} />
                                                </label>
                                            </div>

                                            {/* Repeat for other fields with consistent styling */}

                                            <div style={{ marginBottom: "20px" }}>
                                                <label style={{ fontWeight: "bold", display: "block" }}>Bio:
                                                    <textarea name="bio" value={editedCompany.bio} onChange={handleChange}
                                                              style={{ width: "100%", height: "100px", padding: "8px" }} />
                                                </label>
                                            </div>
                                            <div style={{ marginBottom: "20px" }}>
                                                <label style={{ fontWeight: "bold", display: "block" }}>Website:
                                                    <input type="url" name="website" value={editedCompany.website}
                                                           onChange={handleChange} style={{ width: "100%", padding: "8px", margin: "8px 0" }} />
                                                </label>
                                            </div>
                                            <div style={{ marginBottom: "20px" }}>
                                                <label style={{ fontWeight: "bold", display: "block" }}>Email:
                                                    <input type="email" name="email" value={editedCompany.email}
                                                           onChange={handleChange} style={{ width: "100%", padding: "8px", margin: "8px 0" }} />
                                                </label>
                                            </div>
                                            <div style={{ marginBottom: "20px" }}>
                                                <label style={{ fontWeight: "bold", display: "block" }}>Category:
                                                    <input type="text" name="description" value={editedCompany.description}
                                                           onChange={handleChange} style={{ width: "100%", padding: "8px", margin: "8px 0" }} />
                                                </label>
                                            </div>
                                            <button type="submit" style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "10px",
                                                backgroundColor: "#7140DEFF",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer"
                                            }}>Save Changes</button>
                                        </form>
                                    ) : (
                                    <div>
                                        <button onClick={handleEdit} style={{
                                            position: "absolute",
                                            top: "20px",
                                            right: "20px",
                                            background: `url('/css/icons/edit.png') no-repeat center center`,
                                            backgroundSize: "cover",
                                            width: "32px",
                                            height: "32px",
                                            border: "none",
                                            cursor: "pointer"
                                        }} aria-label="Edit"></button>

                                        <p style={{
                                            fontSize: "24px",
                                            color: "#333",
                                            borderBottom: "1px solid #ddd",
                                            paddingBottom: "10px"
                                        }}>Stock Metrics</p>

                                        <h2 style={{marginTop: "20px", color: "#222"}}>{company.companyName}</h2>
                                        <h3 style={{color: "#555"}}>{company.ticker}</h3>

                                        <div style={{
                                            fontSize: "16px",
                                            color: "#666",
                                            marginTop: "10px",
                                            lineHeight: "1.5"
                                        }}>
                                            {/* Display other details as non-editable spans */}
                                            <span>Previous Close: {company.details.Open} &emsp;&emsp;</span>
                                            <span>Open: {company.details.Open} &emsp;&emsp;</span>
                                            <span>Market Cap: {company.details.Market_Cap} &emsp;&emsp;</span>
                                            <span>Volume: {company.details.Volume}</span>
                                            <br/>
                                            <span>Revenue: {company.details.Revenue} &emsp;&emsp;</span>
                                            <span>PE Ratio: {company.details.PE_Ratio} &emsp;&emsp;</span>
                                            <span>Dividend: {company.details.Dividend} &emsp;&emsp;</span>
                                            <br/>
                                            <span>Shares Outstanding: {company.details.Shares_outstanding}</span>
                                        </div>

                                        <p style={{
                                            marginTop: "10px",
                                            color: "#444",
                                            fontSize: "18px"
                                        }}>Bio: {company.bio}</p>

                                        <p style={{
                                            color: "#444",
                                            fontSize: "18px"
                                        }}>Website: <a href={company.website}
                                                       style={{color: "#0652DD"}}>{company.website}</a></p>

                                        <p style={{
                                            color: "#444",
                                            fontSize: "18px"
                                        }}>Email: <a href={`mailto:${company.email}`}
                                                     style={{color: "#0652DD"}}>{company.email}</a></p>

                                        <p style={{
                                            color: "#444",
                                            fontSize: "18px"
                                        }}>Category: {company.description}</p>
                                    </div>
                                )}
                            </div>


                            {/*</p>*/}

                        </div>

                        {/*<div className='bottomLeftSectionBG bottomLeftCompanyProfile'>*/}
                        {/*    <h3>Edit your information</h3>*/}
                        {/*    <button className="submit-button"></button>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="text" className="form__field form__fieldBIO"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Bio</label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="text" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Address</label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="text" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Website</label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="text" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Phone</label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="date" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Next Event</label>*/}
                        {/*    </div>*/}

                        {/*</div>*/}
                    </div>
                )}
                {activeTab === 'User Statistics' && (
                    <div>
                        <div className='bigSectionBG'>
                            <p>Statistics
                            </p>
                            {/*<div className='form__group__watchlist field'>*/}
                            {/*    <input type="text" className="form__field"/>*/}
                            {/*    <label htmlFor="name" className="form__label">Search for a user</label>*/}
                            {/*</div>*/}
                            <div className="">
                                <Line data={data} options={options}></Line>
                            </div>
                        </div>
                        <div className='bigSectionBG'>
                            <Table className="SearchResultsTable">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Number of investments</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>
                                            Operation Type
                                        </TableCell>
                                    </TableRow>
                                    {investments.map((investment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{investment.numOfUnits}</TableCell>
                                            <TableCell>${investment.price.toFixed(2)}</TableCell>
                                            <TableCell>
                                                {`${new Date(investment.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}`}
                                            </TableCell>
                                            <TableCell
                                                className={investment.isSell ? 'stockIncrease' : 'stockDecrease'}>
                                                {investment.isSell ? 'Sell' : 'Buy'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {/*<div className='bottomRightSectionBG'>*/}
                        {/*    <div className="bottomRightChartClass">*/}
                        {/*        <h3>User Distribution</h3>*/}
                        {/*        <Pie data={pieData}/>*/}
                        {/*    </div>*/}

                        {/*</div>*/}
                        {/*<div className='bottomLeftSectionBG'>*/}
                        {/*    <h3>Add an investment event!</h3>*/}
                        {/*    <button className="submit-button"></button>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="text" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Investor Username</label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="text" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">$ Stock Price </label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="text" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Amount Purchased</label>*/}
                        {/*    </div>*/}
                        {/*    <div className='form__group field'>*/}
                        {/*        <input type="date" className="form__field"/>*/}
                        {/*        <label htmlFor="name" className="form__label">Investment date</label>*/}
                        {/*    </div>*/}

                        {/*</div>*/}
                    </div>
                )}
                {activeTab === 'Search' && (
                    <div>
                        <div className={'bigSectionBG searchContainer'}>
                            <SearchBar onSearchResults={handleSearchResults}/>
                            <Table className="SearchResultsTable">
                                {/* Tabletjsx content */}
                                <TableBody>
                                    {companies.map((company, index) => (
                                        <TableRow key={index} onClick={() => handleCompanyClick(company)}>
                                            <TableCell
                                                className="font-medium SearchCompanyName">{company.name}</TableCell>
                                            <TableCell>{company.ticker}</TableCell>
                                            <TableCell>{company.description}</TableCell>
                                            <TableCell
                                                className={`font-medium ${company.history['06/13/2024'] - company.history['06/12/2024'] > 0 ? 'stockIncrease' : 'stockDecrease'}`}>
                                                ${company?.history['06/13/2024'] || 'N/A'} {company.history['06/13/2024'] - company.history['06/12/2024'] >= 0 ? '↑' : '↓'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </div>
                        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                            {selectedCompany ? (
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
                                    <h1 style={{fontSize: '48px'}}>{selectedCompany.name}</h1>
                                    <br/><br/>
                                    <p>{selectedCompany.description}</p>
                                    <br/><br/><br/><br/>
                                    <p className="profileStockValue">
                                        Current Stock Price:
                                        <span className={selectedCompany.history && selectedCompany.history['06/13/2024'] - selectedCompany.history['06/12/2024'] >= 0 ? 'stockIncrease' : 'stockDecrease'}>
                        &nbsp;${selectedCompany.history && selectedCompany.history['06/13/2024'] || 'N/A'}
                                            {selectedCompany.history && (selectedCompany.history['06/13/2024'] - selectedCompany.history['06/12/2024'] >= 0 ? '↑' : '↓')}
                    </span>
                                    </p>
                                    {/*<button className="addWatchlistBtn" onClick={() => handleAddToWatchlistClick(clerkId,selectedCompany,setWatchlist,setSelectedStock)}>Add to Watchlist</button>*/}
                                </div>
                            ) : (
                                <div>
                                    <p>No company selected.</p>
                                </div>
                            )}
                        </Modal>




                    </div>
                )}
                {activeTab === 'About Us' && (
                    <div className='bigSectionBG About-Us'>
                        <p>
                            Welcome to <strong>Stock Investment Platform</strong>, your number one source for all things
                            related to stock investment. We're dedicated to providing you the very best of investment
                            advice, with an emphasis on reliability, customer service, and uniqueness.
                        </p>
                        <p>
                            Founded in 2023, <strong>Stock Investment Platform</strong> has come a long way from its
                            beginnings. When we first started out, our passion for helping other investors be more
                            eco-friendly, providing the best equipment for their trading drove us to start our own
                            business.
                        </p>
                        <p>
                            We hope you enjoy our services as much as we enjoy offering them to you. If you have any
                            questions or comments, please don't hesitate to contact us.
                        </p>
                        <br></br><br></br>
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
