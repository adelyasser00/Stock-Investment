    // HomePage.js
    'use client'
    import React, { useState, useEffect } from 'react';
    import './css/landing.css';
    import Navbar from './navbar';
    import Sidebar from './sidebar';
    import ChatComponent from './chatComponent';
    import { Line, Pie } from "react-chartjs-2";
    import Modal from './components/modal';
    import { UserButton, useUser } from "@clerk/nextjs";
    import { clerkClient } from '@clerk/nextjs';
    import Page from './onboarding/page';
    import { useRouter } from 'next/navigation';
    import {checkAndUpdateFeed} from "@/lib/newsfeed/helper";
    import {addToWatchlist, search} from "@/lib/actions/user.actions"
    import SearchBar from './searchbar'
    import {getUserById, savePostToUser, getSavedPosts, addInvestment, getWatchlist, getInvestments,removeFromWatchlist,removeSavedPost,removeInvestment} from '@/lib/actions/user.actions'
    import axios from 'axios';
    // import {runRecommsys} from '@/lib/recommsys/helper'
    import {sendRequest} from '@/lib/chatbot/helper'
    // import {AddInvestedStock} from './types/index'
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
    // import { Input } from "@/components/ui/input"
    // import {flushAndExit} from "next/dist/telemetry/flush-and-exit";
    // import {response} from "express";






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


    async function fetchRSS() {
        try {
            const response = await checkAndUpdateFeed()
            if (response.length==0) {
                throw new Error(`Failed to fetch articles`);
            }
            console.log("RSS received in fetchRSS()");
            return response;
        } catch (error) {
            console.error("Error fetching RSS  :", error);
            throw error;  // Rethrowing the error after logging
        }
    }
    async function removePost(article,clerkId,setSavedArticles){

        await removeSavedPost(article._id, clerkId)
        fetchSavedPosts(clerkId)
            .then(savedArticles=>{
                console.log("saved articles received in frontend")
                savedArticles.reverse();
                setSavedArticles(savedArticles);
                console.log("loading saved articles done")
                alert("post has been removed successfully!")
            })
            .catch(error => {
                console.error("Error fetching saved posts:", error);
            });
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
    async function removeInvestmentFromUser(clerkId,stock,userInvestments,setUserInvestments){
        const stockIdString = stock._id.toString();
        await removeInvestment(clerkId,stockIdString)
        getUserInvestments(clerkId)
            .then(userInvestments=()=>{
                setUserInvestments(userInvestments);
                alert("investment removed successfully")
            })
            .catch(error => {
                console.error("Error fetching investments:", error);
            });
    }

    const handleRemoveWatchlist = async(clerkId,company,setWatchlist,setSelectedStock) =>{
        try {
            console.log("clerk id:",clerkId)
            console.log("company id:",company.clerkId)
            console.log("company is:",company)
            await removeFromWatchlist(clerkId, company._id);
            alert(`${company.companyName} removed to your watchlist!`);
            if (clerkId){
                fetchWatchlist(clerkId)
                    .then(watchlist =>{
                        console.log("watchlist received in frontend")
                        setWatchlist(watchlist)
                        setSelectedStock(watchlist[0])
                        console.log("loading watchlist done")
                    })
                    .catch(error => {
                        console.error("Error fetching watchlist:", error);
                    });
            }

        } catch (error) {
            console.error('Error removing to watchlist:', error);
            alert('Failed to remove to watchlist.');
        }
    }
    const handleAddToWatchlistClick = async (clerkId,company,setWatchlist,setSelectedStock) => {
        try {
            console.log("company is: "+ company.ticker)
            console.log("adding: " + company._id)
            const added = await addToWatchlist(clerkId, company._id);  // Assuming each company has an _id field
            console.log('User added:', added);
            alert(`${company.name} added to your watchlist!`);
            // update watchlist
            if (clerkId){
                fetchWatchlist(clerkId)
                    .then(watchlist =>{
                        console.log("watchlist received in frontend")
                        setWatchlist(watchlist)
                        setSelectedStock(watchlist[0])
                        console.log("loading watchlist done")
                    })
                    .catch(error => {
                        console.error("Error fetching watchlist:", error);
                    });
            }

        } catch (error) {
            console.error('Error adding to watchlist:', error);
            alert('Failed to add to watchlist.');
        }
    };
    async function fetchWatchlist(clerkId){
        try{
            const response = await getWatchlist(clerkId);
            console.log("watchlist received")
            console.log(response)
            return response
        } catch(error){
            console.error("Error fetching watchlist:", error);
            throw error;  // Rethrowing the error after logging
        }
    }
    async function postChatbot(task,data){
        try{
            console.log("inside postChatbot")
            // const response = await fetch(`https://037f-34-135-219-34.ngrok-free.app/predict?data=${encodeURIComponent('Financial Headline Classification')}&task=${encodeURIComponent('Apple released new iphone')}`,
            //     {
            //         method: 'POST', // Assuming it's a POST request; adjust if different
            //         mode: 'no-cors',
            //         headers: {
            //             'Accept': 'application/json',  // It's good practice to capitalize the first letter of header names
            //             'Access-Control-Allow-Origin':'*',
            //         }
            //     });
            const response = sendRequest(task,data)
            console.log(response)
            console.log("fetch has passed")
            // const response = await sendRequest('Financial Headline Classification', 'Apple released new iphone')
            // const jsonRes = await response.json()
            // console.log(jsonRes)
            // console.log("finished sendRequest")
            return response
        } catch(error) {
            console.error("Error fetching chatbot:", error);
            throw error;  // Rethrowing the error after logging
        }

    }
    async function getUserInvestments(clerkId){
        try{
            const response = await getInvestments((clerkId))
            console.log("investments received")
            console.log(response)
            return response
        }catch(error) {
            console.error("Error fetching investments:", error);
            throw error;  // Rethrowing the error after logging
        }

    }
    const ChatbotTaskContext = React.createContext(null);

    const RadioButtonsComponent = ({ setChatbotTask }) => {
        // Initialize with the default task
        const [selectedOption, setSelectedOption] = useState('a');

        // Effect hook to set the default value on initial render
        useEffect(() => {
            setChatbotTask("Financial Sentiment Analysis");
        }, [setChatbotTask]);

        const handleRadioChange = (event) => {
            setSelectedOption(event.target.value);
            setChatbotTask(event.target.labels[0].innerText);
        };

        return (
            <div className="toggle-radio">
                <input type="radio" name="ab" id="a" value="a" checked={selectedOption === 'a'} onChange={handleRadioChange}/>
                <label htmlFor="a">Financial Sentiment Analysis</label>

                <input type="radio" name="ab" id="b" value="b" checked={selectedOption === 'b'} onChange={handleRadioChange}/>
                <label htmlFor="b">Financial Relation Extraction</label>

                <input type="radio" name="ab" id="c" value="c" checked={selectedOption === 'c'} onChange={handleRadioChange}/>
                <label htmlFor="c">Financial Headline Classification</label>

                <input type="radio" name="ab" id="d" value="d" checked={selectedOption === 'd'} onChange={handleRadioChange}/>
                <label htmlFor="d">Financial Named Entity Recognition</label>
            </div>
        );
    };


    const HomePage = () => {
        // const [tickers,setTickers]=useState(null);
        // useEffect(() => {
        //     runRecommsys()
        //         .then(tickers =>{
        //             const bruh = localStorage.getItem('sortedTickers')
        //             setTickers(bruh) ;
        //     })
        // }, []);
        // useEffect(() => {
        //     console.log("***********************")
        //     console.log("tickers have changed:",tickers)
        // }, [tickers]);
        // useEffect(() => {
        //     console.log("before recom sys")
        //     fetch('/api/runRecommsys')
        //         .then(res => {
        //             console.log("after fetch recom sys")
        //             console.log(res)
        //             res.json()
        //         })
        //         .then(data => {
        //             console.log("!!!!!!!!!!!!!!!!!!!!\n recommendation system result:")
        //             console.log(data)
        //         })
        //         .catch(err => console.error('Error running recommendation system:', err));
        // }, []);
        const handleApplyCompany=()=>{
            alert("We will be in contact once your documents have been reviewed!")
            router.push("/")
        }
        const [uInvestment,setUInvesment] = useState(null)
        const [chatbotTask, setChatbotTask] = useState('');
        const [conversation, setConversation] = useState([
            { text: "Hello! How can I assist you with your financial planning today?", isUser: false }
        ]);
        const [chatbotResponse,setChatbotResponse]= useState(null)
        const handleSendMessage = async (message) => {
            // Update conversation with user's message
            setConversation(conversation => [...conversation, { text: message, isUser: true }]);
            try {
                const chatbotResponse = await postChatbot(chatbotTask, message);
                console.log("chatbot response:", chatbotResponse.response);
                const result = chatbotResponse.response;
                const answer = result.split('Answer: ')[1].trim();

                // Use a callback to ensure you're working with the latest state
                setConversation(currentConversation => [
                    ...currentConversation,
                    { text: answer, isUser: false }
                ]);
            } catch (error) {
                console.error("Error in fetching chatbot response: ", error);
            }
        };
        const [userInvestments, setuserInvestments] = useState([]);

        const [chatbot,setChatbot]=useState(null);

        const [savedArticles, setSavedArticles] = useState([]);
        const [articles, setArticles] = useState([]);
      const [activeTab, setActiveTab] = useState('Home');
        const [chartData, setChartData] = useState({
            labels: [],
            datasets: [] // Ensure datasets is always an array
        });
        const [chartDataPort, setChartDataPort] = useState({
            labels: [],
            datasets: [] // Ensure datasets is always an array
        });
        const [selectedStock, setSelectedStock] = useState(null);
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
        }, [clerkId]); // Ensuring fetch only runs when clerkId changes and exists
        useEffect(()=>{
            if (clerkId){
                fetchWatchlist(clerkId)
                    .then(watchlist =>{
                        console.log("watchlist received in frontend")
                        setWatchlist(watchlist)
                        setSelectedStock(watchlist[0])
                        console.log("loading watchlist done")
                    })
                    .catch(error => {
                        console.error("Error fetching watchlist:", error);
                    });
            }
        },[clerkId]);
        useEffect(() => {
            if (clerkId){
                getUserInvestments(clerkId)
                    .then(userInvestments =>{
                        console.log("user investments received in frontend")
                        setuserInvestments(userInvestments)
                        setUInvesment(userInvestments[0].companyDetails)
                        console.log("loading user investments done")
                    })
                    .catch(error => {
                        console.error("Error fetching user investments:", error);
                    });
                // console.log("call getInvestments: ",response)
            }
        }, [clerkId]);
        // useEffect(() => {
        //     if (clerkId){
        //         postChatbot()
        //             .then(chatbot =>{
        //                 console.log("chatbot received in frontend")
        //                 // Assuming chatbot.response contains the response string
        //                 const result = chatbot.response;
        //                 // Splitting the string at "Answer: " and taking the second part (index 1)
        //                 const answer = result.split('Answer:  ')[1];
        //                 setChatbot(answer);  // Now setChatbot will store only the part after "Answer: "
        //                 console.log("loading chatbot done")
        //             })
        //             .catch(error => {
        //                 console.error("Error fetching user investments:", error);
        //             });
        //     }
        //
        // }, [clerkId]);
        useEffect(() => {
            console.log("====================")
            console.log("chatbot has changed to:",chatbot)
        }, [chatbotResponse]);
        // useEffect(() => {
        //     if (chatbot){
        //          console.log("useEffect received response of chatbot: ")
        //          console.log(chatbot)
        //     }
        // }, [chatbot]);
        // Use effect to simulate stock price updates
        useEffect(() => {
            const interval = setInterval(() => {
                setCompanies(companies => companies.map(company => {
                    const change = Math.random() < 0.5 ? -1 : 1; // Randomly decide direction
                    const fluctuation = Math.floor(Math.random() * 10); // Random price change
                    return {
                        ...company,
                        // currentStockPrice: company.currentStockPrice + fluctuation * change,
                        // stockChange: change
                    };
                }));
            }, 5000); // Update every 5 seconds

            return () => clearInterval(interval);
        }, []);




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
            // {
            //     name: "Quantum Solutions",
            //     description: "Quantum Solutions stands at the forefront of technology innovation, providing robust IT solutions that drive efficiency and growth. Specializing in cloud services, cybersecurity, and custom software development, we empower businesses to thrive in a digital-first world. Our commitment to excellence and innovation ensures that our clients receive the most advanced and reliable services available.",
            //     currentStockPrice: 150,
            //     stockChange: 0
            // },
            // {
            //     name: "GreenLeaf Renewables",
            //     description: "GreenLeaf Renewables is dedicated to advancing the adoption of sustainable energy solutions. We specialize in the development of cutting-edge solar and wind technology projects that reduce carbon footprints and foster sustainable development. Our mission is to make renewable energy accessible and efficient for all, ensuring a greener, more sustainable future.",
            //     currentStockPrice: 120,
            //     stockChange: 0
            // },
            // {
            //     name: "TechBridge Communications",
            //     description: "TechBridge Communications is a leader in telecommunications, offering a wide range of services including fiber optics installation, 5G network services, and comprehensive infrastructure management. We are committed to bridging the digital divide by enhancing connectivity in both urban and remote areas, thus facilitating seamless communication and business operations.",
            //     currentStockPrice: 135,
            //     stockChange: 0
            // },
            // {
            //     name: "HealthPath Diagnostics",
            //     description: "HealthPath Diagnostics revolutionizes the healthcare industry by providing cutting-edge diagnostic tools and AI-driven analysis. Our technologies improve patient outcomes and enhance preventive care strategies through innovative, accurate, and accessible diagnostic solutions. We are dedicated to transforming healthcare with technology, making high-quality care achievable for everyone.",
            //     currentStockPrice: 160,
            //     stockChange: 0
            // }
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
                _id: result._id,
                bio:result.bio,
                website:result.website,
                email:result.email,
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



        const [pieData, setPieData] = useState({
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],  // Initial empty array
            }],
        });
        const calculatePieData = () => {
            const groupedData = userInvestments.reduce((acc, investment) => {
                const key = investment.companyDetails.companyName;  // or investment.companyClerkId for ID based grouping
                if (!acc[key]) {
                    acc[key] = {
                        totalValue: 0,
                        count: 0, // To calculate average price if needed
                    };
                }
                if (!investment.isSell){
                    acc[key].totalValue += investment.numOfUnits * investment.price;
                    acc[key].count += investment.numOfUnits;
                } else {
                    acc[key].totalValue -= investment.numOfUnits * investment.price;
                    acc[key].count -= investment.numOfUnits;
                }
                return acc;
            }, {});

            const labels = Object.keys(groupedData);
            const data = labels.map(label => groupedData[label].totalValue);
            const backgroundColors = labels.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);  // Random colors for each company

            setPieData({
                labels,
                datasets: [{
                    data,
                    backgroundColor: backgroundColors,
                }],
            });
        };
        useEffect(() => {
            calculatePieData();
        }, [userInvestments]);  // Recalculate when userInvestments changes


        const calculateColor = (history) => {
            if(selectedStock){
                // Ensure that history is not null or undefined
                if (!history) {
                    return {
                        borderColor: "#cccccc", // Default color if history is not available
                        pointBorderColor: "#cccccc",
                        gradientColor: "#cccccc"
                    };
                }

                // Sort the keys in history to find the latest two dates
                const dates = Object.keys(selectedStock.History).sort((a, b) => {
                    return new Date(a as string).getTime() - new Date(b as string).getTime();
                });
                // Ensure there are at least two dates to compare
                if (dates.length < 2) {
                    return {
                        borderColor: "#cccccc", // Default color if not enough data
                        pointBorderColor: "#cccccc",
                        gradientColor: "#cccccc"
                    };
                }
                dates.reverse()
                // console.log("print dates for colors:")
                // console.log(userInvestments)
                // console.log(chatbot)
                // console.log(chatbot.Response)
                // console.log(history[dates[0]],history[dates[1]])
                const lastPrice = parseFloat(history[dates[0]]);
                const secondLastPrice = parseFloat(history[dates[1]]);

                return lastPrice > secondLastPrice ? {
                    borderColor: "#00ff00", // Green for increase
                    pointBorderColor: "#00dd00",
                    gradientColor: "#00dd00",
                } : {
                    borderColor: "#ff0000", // Red for decrease
                    pointBorderColor: "#dd0000",
                    gradientColor: "#dd0000",
                };
            }

        };


    // Example usage
        let color = null
        if(selectedStock){
            color = calculateColor(selectedStock.History);
        }

        // const data = {
        //     labels: salesData[selectedStock].map(data => data.month),
        //     datasets: [
        //         {
        //             label: selectedStock,
        //             data: salesData[selectedStock].map(data => data.sales),
        //             borderColor: color.borderColor,
        //             borderWidth: 3,
        //             pointBorderColor: color.pointBorderColor,
        //             pointBorderWidth: 3,
        //             tension: 0.5,
        //             fill: true,
        //             backgroundColor: (context) => {
        //                 const ctx = context.chart.ctx;
        //                 const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        //                 gradient.addColorStop(0, color.gradientColor);
        //                 gradient.addColorStop(1, "white");
        //                 return gradient;
        //             },
        //         },
        //     ],
        // };

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
                        text: "Date",
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
        const [stockName, setStockName] = useState('');
        const [stockPrice, setStockPrice] = useState('');
        const [amountPurchased, setAmountPurchased] = useState('');
        const [purchaseDate, setPurchaseDate] = useState('');
        const [isSell, setIsSell] =useState(false);
        const [key, setKey] = useState(0);
        const [sales,setSales] = useState([]);
        const addInvestmentToCompany = async (event) => {
            event.preventDefault(); // Prevent default form submission
            const investment: AddInvestedStock = {
                price: parseFloat(stockPrice),
                numOfUnits: parseInt(amountPurchased, 10),
                companyTicker: stockName,
                date: new Date(purchaseDate),
                isSell: isSell,
            };
            try{
                console.log('Submitting', { investment });
                // Add your submit logic here, e.g., sending data to an API
                await addInvestment(clerkId,investment)
                if (clerkId){
                    getUserInvestments(clerkId)
                        .then(userInvestments =>{
                            console.log("user investments received in frontend")
                            setuserInvestments(userInvestments)
                            console.log("loading user investments done")
                        })
                        .catch(error => {
                            console.error("Error fetching user investments:", error);
                        });
                    // console.log("call getInvestments: ",response)
                }
                console.log("added investment successfully")
            } catch (error){
                console.log(error)
                alert("company not found!")
            }

        };
        // const getChartData = () => {
        //     if (!selectedStock) {
        //         console.log("didnt find selected stock")
        //         return {labels: [], datasets: []};
        //     }
        //     console.log(selectedStock.History)
        //
        //     const dates = Object.keys(selectedStock.History).sort((a, b) => {
        //         return new Date(a as string).getTime() - new Date(b as string).getTime();
        //     });
        //     console.log(dates);
        //     setSales(dates.map(date => parseFloat(selectedStock.History[date])))
        //     console.log(sales)
        //     return {
        //         labels: dates,
        //         datasets: [{
        //             label: `${selectedStock.ticker} Price`,
        //             data: sales,
        //             borderColor: "rgba(53, 162, 235, 0.5)",
        //             fill: false,
        //             borderWidth: 2
        //         }]
        //     };
        // };
        // useEffect(() => {
        //     if (selectedStock){
        //         const dates = Object.keys(selectedStock.History).sort((a, b) => {
        //         return new Date(a as string).getTime() - new Date(b as string).getTime();
        //     });
        //         setSales(dates.map(date => parseFloat(selectedStock.History[date])))
        //         // Assuming selectedStock is updated from somewhere, like a watchlist click
        //         const newChartData = {
        //
        //             labels: dates, // new labels array
        //             datasets: [{
        //                 label: `${selectedStock.ticker} Price`,
        //                 data: sales,
        //                 borderColor: "rgba(53, 162, 235, 0.5)",
        //                 fill: false,
        //                 borderWidth: 2
        //             }]
        //         };
        //         setChartData(newChartData);
        //     }
        //
        //
        // }, [selectedStock]); // Dependency on selectedStock to update the chart when it changes
        // useEffect(() => {
        //     if (uInvestment && uInvestment.History){
        //         const dates = Object.keys(uInvestment.History).sort((a, b) => {
        //             return new Date(a as string).getTime() - new Date(b as string).getTime();
        //         });
        //         setSales(dates.map(date => parseFloat(uInvestment.History[date])))
        //         // Assuming selectedStock is updated from somewhere, like a watchlist click
        //         const newChartData = {
        //
        //             labels: dates, // new labels array
        //             datasets: [{
        //                 label: `${uInvestment.ticker} Price`,
        //                 data: sales,
        //                 borderColor: "rgba(53, 162, 235, 0.5)",
        //                 fill: false,
        //                 borderWidth: 2
        //             }]
        //         };
        //         setChartDataPort(newChartData);
        //     }
        //
        //
        // }, [uInvestment]); // Dependency on selectedStock to update the chart when it changes


        const selectInvestmentFromPortfolio = (company) => {
            console.log("entered selectInvestmentFromPortfolio")
            setUInvesment(company.companyDetails); // Assuming setUInvesment sets the company whose details are to be displayed
            console.log("set selectInvestmentFromPortfolio: ","stock sent as parameter: " ,company)
        };
        const selectStockFromWatchlist = (company) => {
            console.log("entered selectStockFromWatchlist")
            setSelectedStock(company); // Assuming setSelectedStock sets the company whose details are to be displayed
            console.log("set selectStockFromWatchlist: ","stock sent as parameter: " ,company)
        };
        useEffect(() => {
            if (selectedStock) {
                console.log("New selected stock: ", selectedStock);
                // Perform any action that depends on the updated value of selectedStock
            }
        }, [selectedStock]);

        useEffect(() => {
            if (selectedStock && selectedStock.History) {
                console.log("inside if of useEffect for chartData after change in selectedStock")
                // Ensure that history is an object with keys before trying to access them
                const dates = Object.keys(selectedStock.History).sort((a, b) => {
                    return new Date(a as string).getTime() - new Date(b as string).getTime();
                });
                console.log("dates: ", dates)
                const sales = dates.map(date => parseFloat(selectedStock.History[date]));

                const color = calculateColor(selectedStock.History);  // Ensure calculateColor can handle an empty or undefined 'history'

                const newChartData = {
                    labels: dates,
                    datasets: [{
                        label: selectedStock.ticker,  // Using ticker as the label
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
        }, [selectedStock]); // Dependency on selectedStock ensures updates when stock selection changes
        useEffect(() => {
            if (uInvestment && uInvestment.History) {
                console.log("inside if of useEffect for chartData after change in uInvestment")
                // Ensure that history is an object with keys before trying to access them
                const dates = Object.keys(uInvestment.History).sort((a, b) => {
                    return new Date(a as string).getTime() - new Date(b as string).getTime();
                });
                console.log("dates: ", dates)
                const sales = dates.map(date => parseFloat(uInvestment.History[date]));

                const color = calculateColor(uInvestment.History);  // Ensure calculateColor can handle an empty or undefined 'history'

                    const newChartData = {
                        labels: dates,
                        datasets: [{
                            label: uInvestment.ticker,  // Using ticker as the label
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
                        }],
                    };
                    console.log(newChartData)

                    setChartDataPort(newChartData);

            } else {
                // Handle cases where uInvestment or its history is not available
                console.log("inside else of useEffect for chartData after change in uInvestment")

                setChartDataPort({
                    labels: [],
                    datasets: []
                });
            }
        }, [uInvestment]);
        useEffect(() => {
            setKey(prevKey => prevKey + 1);
            console.log("***chartData:",chartData)
            console.log("***sales:",sales)
        }, [chartData]);
        useEffect(() => {
            console.log("***sales:",sales)
        }, [sales]);

        useEffect(() => {
            console.log("=================")
            console.log("selectedStock changed")
            console.log(selectedStock)
        }, [selectedStock]);
        useEffect(() => {
            console.log("=================")
            console.log("uInvestment changed")
            console.log(uInvestment)
        }, [uInvestment]);
        const getUniqueInvestmentsByTicker = (investments) => {
            const investmentMap = new Map();

            investments.forEach(investment => {
                const ticker = investment.companyDetails.ticker;
                if (!investmentMap.has(ticker)) {
                    investmentMap.set(ticker, investment);
                }
            });

            return Array.from(investmentMap.values());
        };
        const uniqueInvestments = getUniqueInvestmentsByTicker(userInvestments);


        return (
        <div>

          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className='userButton'>
                {/*<UserButton afterSignOutUrl={"https://843e-41-45-12-162.ngrok-free.app"}  />*/}
                <UserButton afterSignOutUrl={"/"}  />
            </div>
            {/*<form>*/}
            {/*    <button className="submit-button save-button">Register company</button>*/}
            {/*</form>*/}


          <div>
            {activeTab === 'Home' && (
                <div>
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
                                        <img src={extractImageUrl(article.content)} alt="Post Image" className="post-image"/>
                                    </a>
                                    <p className='post-text'>{article.contentSnippet}</p>
                                    <br></br><br></br>
                                    <button

                                        onClick={() => savePost(article, clerkId, setSavedArticles)}
                                        style={{
                                            background: `url('/css/icons/save.png') no-repeat center center`,
                                            backgroundSize: 'contain',
                                            width: '64px', // Adjust the size as needed
                                            height: '64px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'block'
                                        }}
                                        aria-label="Save"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            )}
              {activeTab === 'Portfolio' && (
                  <div>
                      <div className='bigSectionBG' style={{
                          padding: "20px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                      }}>
                          <h2 style={{
                              fontSize: "24px",
                              color: "#333",
                              borderBottom: "2px solid #ccc",
                              paddingBottom: "10px",
                              marginBottom: "20px"
                          }}>Your Stocks</h2>

                          <div style={{marginBottom: "20px", overflowX: "auto"}}>
                              {uniqueInvestments.map(company => (
                                  <span key={company._id} style={{
                                      display: "inline-block",
                                      margin: "5px 10px",
                                      padding: "10px 20px",
                                      backgroundColor: "#fff",
                                      borderRadius: "5px",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                      cursor: "pointer"
                                  }}
                                        onClick={() => selectInvestmentFromPortfolio(company)}>
                    {company.companyDetails.ticker}
                </span>
                              ))}
                          </div>

                          {uInvestment ? (
                              <div style={{marginBottom: "20px"}}>
                                  <div style={{height: "500px", marginBottom: "20px"}}>
                                      <Line data={chartDataPort} options={options}/>
                                  </div>

                                  <div style={{
                                      padding: "20px",
                                      backgroundColor: "#fff",
                                      borderRadius: "5px",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                  }}>
                                      <div style={{fontSize: "16px", color: "#666", lineHeight: "1.5"}}>
                                          <p><strong>Previous Close:</strong> {uInvestment.details?.Open || 'N/A'}</p>
                                          <p><strong>Open:</strong> {uInvestment.details?.Open || 'N/A'}</p>
                                          <p><strong>Market Cap:</strong> {uInvestment.details?.Market_Cap || 'N/A'}</p>
                                          <p><strong>Volume:</strong> {uInvestment.details?.Volume || 'N/A'}</p>
                                          <p><strong>Revenue:</strong> {uInvestment.details?.Revenue || 'N/A'}</p>
                                          <p><strong>PE Ratio:</strong> {uInvestment.details?.PE_Ratio || 'N/A'}</p>
                                          <p><strong>Dividend:</strong> {uInvestment.details?.Dividend || 'N/A'}</p>
                                          <p><strong>Shares
                                              Outstanding:</strong> {uInvestment.details?.Shares_outstanding || 'N/A'}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div style={{marginBottom: "20px", textAlign: "center"}}>
                                  <p>No investment selected or available to display.</p>
                              </div>
                          )}
                      </div>
                      <div className="bigSectionBG">
                          <Table className="SearchResultsTable">
                              <TableBody>
                                  <TableRow>
                                      <TableCell>Company</TableCell>
                                      <TableCell>Number of investments</TableCell>
                                      <TableCell>Price</TableCell>
                                      <TableCell>Date</TableCell>
                                      <TableCell>Operation Type</TableCell>
                                      <TableCell>Action</TableCell> {/* Adding header for actions */}
                                  </TableRow>
                                  {userInvestments.map((investment, index) => (
                                      <TableRow key={index}>
                                          <TableCell>{investment.companyDetails.companyName}</TableCell>
                                          <TableCell>{investment.numOfUnits}</TableCell>
                                          <TableCell>${investment.price.toFixed(2)}</TableCell>
                                          <TableCell>
                                              {`${new Date(investment.date).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric'
                                              })}`}
                                          </TableCell>
                                          <TableCell className={investment.isSell ? 'stockIncrease' : 'stockDecrease'}>
                                              {investment.isSell ? 'Sell' : 'Buy'}
                                          </TableCell>
                                          <TableCell>
                                              <button
                                                  onClick={() => removeInvestmentFromUser(clerkId, investment, userInvestments, setuserInvestments)}
                                                  style={{
                                                      background: `url('/css/icons/remove.png') no-repeat center center`,
                                                      backgroundSize: 'contain',
                                                      border: 'none',
                                                      width: '32px',
                                                      height: '32px',
                                                      cursor: 'pointer'
                                                  }} aria-label="Remove Investment">
                                              </button>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </div>


                      <div className='bottomOfHomeChart'>
                          <div className='bottomRightSectionBG'>
                              <div className="bottomRightChartClass">
                                  <h3>Stock Distribution</h3>
                                  <Pie data={pieData}/>
                              </div>
                          </div>

                          <div className='bottomLeftSectionBG'>
                              <form onSubmit={addInvestmentToCompany} style={{
                                  padding: "20px",
                                  backgroundColor: "#fff",
                                  borderRadius: "5px",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                              }}>
                                  <h3>Add your stocks</h3>
                                  <div className='form__group field'>
                                      <input type="text" className="form__field" value={stockName}
                                             onChange={(e) => setStockName(e.target.value)} placeholder="Stock Ticker"
                                             required/>
                                      <label htmlFor="name" className="form__label">Stock Name</label>
                                  </div>
                                  <div className='form__group field'>
                                      <input type="text" className="form__field" value={stockPrice}
                                             onChange={(e) => setStockPrice(e.target.value)} placeholder="Stock Price"
                                             required/>
                                      <label htmlFor="stockPrice" className="form__label">$ Stock Price </label>
                                  </div>
                                  <div className='form__group field'>
                                      <input type="text" className="form__field" value={amountPurchased}
                                             onChange={(e) => setAmountPurchased(e.target.value)}
                                             placeholder="Amount Purchased" required/>
                                      <label htmlFor="amountPurchased" className="form__label">Amount Purchased</label>
                                  </div>
                                  <div className='form__group field'>
                                      <input type="date" className="form__field" value={purchaseDate}
                                             onChange={(e) => setPurchaseDate(e.target.value)} required/>
                                      <label htmlFor="purchaseDate" className="form__label">Purchase Date</label>
                                  </div>
                                  <div className='form__group field'>
                                      <label className="form__label">Transaction Type:</label>
                                      <div className="radio-group">
                                          <label>
                                              <input type="radio" name="transactionType" value="buy" checked={isSell}
                                                     onChange={() => setIsSell(true)}/>
                                              Buy
                                          </label>
                                          &emsp;
                                          <label>
                                              <input type="radio" name="transactionType" value="sell" checked={!isSell}
                                                     onChange={() => setIsSell(false)}/>
                                              Sell
                                          </label>
                                      </div>
                                  </div>
                                  <button type="submit" style={{margin: "20px 0", padding: "10px 20px"}}>Submit</button>
                              </form>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'Watchlist' && (
                  <div className='bigSectionBG' style={{
                      padding: "20px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                  }}>
                      <h2 style={{
                          fontSize: "24px",
                          color: "#333",
                          borderBottom: "2px solid #ccc",
                          paddingBottom: "10px",
                          marginBottom: "20px"
                      }}>My WatchList</h2>

                      <div style={{
                          marginBottom: "20px"
                      }}>
                          {watchlist.map(company => (
                              <div key={company._id} style={{
                                  display: "flex",
                                  alignItems: "center",
                                  margin: "5px 10px",
                                  padding: "10px 20px",
                                  backgroundColor: "#fff",
                                  borderRadius: "5px",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}>
                    <span style={{
                        flex: 1,
                        cursor: "pointer"
                    }} onClick={() => selectStockFromWatchlist(company)}>
                        {company.ticker}
                    </span>
                                  <button style={{
                                      border: "none",
                                      background: "red",
                                      color: "white",
                                      padding: "5px 10px",
                                      borderRadius: "5px",
                                      cursor: "pointer"
                                  }}
                                          onClick={() => handleRemoveWatchlist(clerkId, company, setWatchlist, setSelectedStock)}>
                                      Remove
                                  </button>
                              </div>
                          ))}
                      </div>

                      {selectedStock && (
                          <div style={{
                              marginBottom: "20px",
                          }}>
                              <div style={{
                                  height: "500px",  // Larger height for more emphasis
                                  marginBottom: "20px"
                              }}>
                                  <Line data={chartData} options={options} key={key}/>
                              </div>

                              <div style={{
                                  padding: "20px",
                                  backgroundColor: "#fff",
                                  borderRadius: "5px",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                              }}>
                                  <div style={{
                                      fontSize: "16px",
                                      color: "#666",
                                      lineHeight: "1.5"
                                  }}>
                                      {/* Display company details */}
                                      <p><strong>Previous Close:</strong> {selectedStock.details.Open}</p>
                                      <p><strong>Open:</strong> {selectedStock.details.Open}</p>
                                      <p><strong>Market Cap:</strong> {selectedStock.details.Market_Cap}</p>
                                      <p><strong>Volume:</strong> {selectedStock.details.Volume}</p>
                                      <p><strong>Revenue:</strong> {selectedStock.details.Revenue}</p>
                                      <p><strong>PE Ratio:</strong> {selectedStock.details.PE_Ratio}</p>
                                      <p><strong>Dividend:</strong> {selectedStock.details.Dividend}</p>
                                      <p><strong>Shares Outstanding:</strong> {selectedStock.details.Shares_outstanding}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      )}
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
                              <div style={{
                                  position: 'relative',
                                  padding: "20px",
                                  backgroundColor: "#f9f9f9",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  marginBottom: "20px"
                              }}>
                                  <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" style={{
                                      position: 'absolute',
                                      right: '20px',
                                      top: '20px',
                                      width: '100px', // Reduced for better fit
                                      height: '100px',
                                      borderRadius: '50%' // Make it circular if it fits the design
                                  }}/>
                                  <br/><br/><br/><br/> {/* Adjusted for spacing */}

                                  <p style={{
                                      fontSize: "24px",
                                      color: "#333",
                                      borderBottom: "1px solid #ddd",
                                      paddingBottom: "10px"
                                  }}>Stock Metrics</p>

                                  <h2 style={{marginTop: "20px", color: "#222"}}>{selectedCompany.companyName}</h2>
                                  <h3 style={{color: "#555"}}>{selectedCompany.ticker}</h3>

                                  <div style={{
                                      fontSize: "16px",
                                      color: "#666",
                                      marginTop: "10px",
                                      lineHeight: "1.5"
                                  }}>
                                      <span>Previous Close: {selectedCompany.details.Open} &emsp;&emsp;</span>
                                      <span>Open: {selectedCompany.details.Open} &emsp;&emsp;</span>
                                      <span>Market Cap: {selectedCompany.details.Market_Cap} &emsp;&emsp;</span>
                                      <span>Volume: {selectedCompany.details.Volume}</span>
                                      <br/>
                                      <span>Revenue: {selectedCompany.details.Revenue} &emsp;&emsp;</span>
                                      <span>PE Ratio: {selectedCompany.details.PE_Ratio} &emsp;&emsp;</span>
                                      <span>Dividend: {selectedCompany.details.Dividend} &emsp;&emsp;</span>
                                      <br/>
                                      <span>Shares Outstanding: {selectedCompany.details.Shares_outstanding}</span>
                                  </div>

                                  <p style={{
                                      marginTop: "10px",
                                      color: "#444",
                                      fontSize: "18px"
                                  }}>Bio: {selectedCompany.bio}</p>

                                  <p style={{
                                      color: "#444",
                                      fontSize: "18px"
                                  }}>Website: <a href={selectedCompany.website}
                                                 style={{color: "#0652DD"}}>{selectedCompany.website}</a></p>

                                  <p style={{
                                      color: "#444",
                                      fontSize: "18px"
                                  }}>Email: <a href={`mailto:${selectedCompany.email}`}
                                               style={{color: "#0652DD"}}>{selectedCompany.email}</a></p>

                                  <p style={{
                                      color: "#444",
                                      fontSize: "18px"
                                  }}>Category: {selectedCompany.description}</p>

                                  <button style={{
                                      marginTop: "20px",
                                      padding: "10px 20px",
                                      fontSize: "16px",
                                      color: "#fff",
                                      backgroundColor: "#0652DD",
                                      border: "none",
                                      borderRadius: "5px",
                                      cursor: "pointer",
                                      outline: "none"
                                  }}
                                          onClick={() => handleAddToWatchlistClick(clerkId, selectedCompany, setWatchlist, setSelectedStock)}>
                                      Add to Watchlist
                                  </button>
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
              {activeTab === 'Apply Company' && (
                  <div className='bigSectionBG Contact'>
                      <h1>
                          Please upload your company's documents and we will be in touch
                      </h1>
                      <form onSubmit={handleApplyCompany}>
                          <input type="file" accept="document/*"/>
                          <button className="submit-button apply-company">Submit</button>
                      </form>
                  </div>
              )}
              {activeTab === 'Chatbot' && (
                  <div className='bigSectionBG chatbot'>
                      <ChatComponent onSendMessage={handleSendMessage} conversation={conversation}/>
                      <ChatbotTaskContext.Provider value={chatbotTask}>
                          <RadioButtonsComponent setChatbotTask={setChatbotTask}/>
                          <div>Selected Task: {chatbotTask}</div>
                          {/* Other components that need access to chatbotTask */}
                      </ChatbotTaskContext.Provider>

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
                                              <img src={extractImageUrl(article.content)} alt="Post Image" className="post-image"/>
                                          </a>
                                          <p className='post-text'>{article.contentSnippet}</p>
                                          <br></br><br></br>
                                          <button
                                              onClick={() => removePost(article, clerkId,setSavedArticles)}
                                              style={{
                                                  background: `url('/css/icons/remove.png') no-repeat center center`,
                                                  backgroundSize: 'contain',
                                                  width: '64px',
                                                  height: '64px',
                                                  border: 'none',
                                                  cursor: 'pointer'
                                              }}
                                              aria-label="Remove"
                                          ></button>
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