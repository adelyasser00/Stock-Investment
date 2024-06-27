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
    import {getUserById, savePostToUser, getSavedPosts, addInvestment, getWatchlist, getInvestments} from '@/lib/actions/user.actions'
    import axios from 'axios';
    import {runRecommsys} from '@/lib/recommsys/helper'
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

    const handleAddToWatchlistClick = async (clerkId,company) => {
        try {
            console.log("company is: "+ company.ticker)
            console.log("adding: " + company._id)
            const added = await addToWatchlist(clerkId, company._id);  // Assuming each company has an _id field
            console.log('User added:', added);
            alert(`${company.name} added to your watchlist!`);
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
        const [tickers,setTickers]=useState(null);
        useEffect(() => {
            runRecommsys()
                .then(tickers =>{
                    const bruh = localStorage.getItem('sortedTickers')
                    setTickers(bruh) ;
            })
        }, []);
        useEffect(() => {
            console.log("***********************")
            console.log("tickers have changed:",tickers)
        }, [tickers]);

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
        });    const [selectedStock, setSelectedStock] = useState(null);
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



            const pieData = {
            labels: ['AAPL', 'MSFT', 'TSLA'],
            datasets: [
                {
                    data: [35, 45, 20],
                    backgroundColor: ['#7140DEFF', 'grey', 'black'],
                },
            ],
        };
        const calculateColor = (history) => {
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
        const [stockName, setStockName] = useState('');
        const [stockPrice, setStockPrice] = useState('');
        const [amountPurchased, setAmountPurchased] = useState('');
        const [purchaseDate, setPurchaseDate] = useState('');
        const addInvestmentToCompany = async (event) => {
            event.preventDefault(); // Prevent default form submission
            const investment: AddInvestedStock = {
                price: parseFloat(stockPrice),
                numOfUnits: parseInt(amountPurchased, 10),
                companyTicker: stockName,
                date: new Date(purchaseDate),
            };
            try{
                console.log('Submitting', { investment });
                // Add your submit logic here, e.g., sending data to an API
                await addInvestment(clerkId,investment)
                console.log("added investment successfully")
            } catch (error){
                console.log(error)
                alert("company not found!")
            }

        };
        const getChartData = () => {
            if (!selectedStock) {
                console.log("didnt find selected stock")
                return {labels: [], datasets: []};
            }
            console.log(selectedStock.History)

            const dates = Object.keys(selectedStock.History).sort((a, b) => {
                return new Date(a as string).getTime() - new Date(b as string).getTime();
            });
            console.log(dates);
            const sales = dates.map(date => parseFloat(selectedStock.History[date]));
            console.log(sales)
            return {
                labels: dates,
                datasets: [{
                    label: `${selectedStock.ticker} Price`,
                    data: sales,
                    borderColor: "rgba(53, 162, 235, 0.5)",
                    fill: false,
                    borderWidth: 2
                }]
            };
        };
        useEffect(() => {
            if (selectedStock){
                const dates = Object.keys(selectedStock.History).sort((a, b) => {
                return new Date(a as string).getTime() - new Date(b as string).getTime();
            });
                const sales = dates.map(date => parseFloat(selectedStock.History[date]));

                // Assuming selectedStock is updated from somewhere, like a watchlist click
                const newChartData = {

                    labels: dates, // new labels array
                    datasets: [{
                        label: `${selectedStock.ticker} Price`,
                        data: sales,
                        borderColor: "rgba(53, 162, 235, 0.5)",
                        fill: false,
                        borderWidth: 2
                    }]
                };
                setChartData(newChartData);
            }


        }, [selectedStock]); // Dependency on selectedStock to update the chart when it changes

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

        }, [chartData]);




        return (
        <div>

          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className='userButton'>
                {/*<UserButton afterSignOutUrl={"https://843e-41-45-12-162.ngrok-free.app"}  />*/}
                <UserButton afterSignOutUrl={"/"}  />
            </div>


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
                                    <button className='submit-button save-button' onClick={() => savePost(article,clerkId, setSavedArticles)}>Save</button>
                                </div>
                            </div>
                        ))}
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
                          <div className="topChartClassWatchlist">
                              {selectedStock ? (
                                  <Line data={chartData} options={options} />
                              ) : (
                                  <div>Loading or Select a Stock...</div>
                              )}
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
                              <form onSubmit={addInvestmentToCompany}>
                                  <h3>Add your stocks</h3>
                                  <button type="submit" className="submit-button"></button>
                                  <div className='form__group field'>
                                      <input
                                          type="text"
                                          className="form__field"
                                          value={stockName}
                                          onChange={(e) => setStockName(e.target.value)}
                                          placeholder="Stock Ticker"
                                          required
                                      />
                                      <label htmlFor="name" className="form__label">Stock Name</label>
                                  </div>
                                  <div className='form__group field'>
                                      <input
                                          type="text"
                                          className="form__field"
                                          value={stockPrice}
                                          onChange={(e) => setStockPrice(e.target.value)}
                                          placeholder="Stock Price"
                                          required
                                      />
                                      <label htmlFor="stockPrice" className="form__label">$ Stock Price </label>
                                  </div>
                                  <div className='form__group field'>
                                      <input
                                          type="text"
                                          className="form__field"
                                          value={amountPurchased}
                                          onChange={(e) => setAmountPurchased(e.target.value)}
                                          placeholder="Amount Purchased"
                                          required
                                      />
                                      <label htmlFor="amountPurchased" className="form__label">Amount Purchased</label>
                                  </div>
                                  <div className='form__group field'>
                                      <input
                                          type="date"
                                          className="form__field"
                                          value={purchaseDate}
                                          onChange={(e) => setPurchaseDate(e.target.value)}
                                          required
                                      />
                                      <label htmlFor="purchaseDate" className="form__label">Purchase Date</label>
                                  </div>

                              </form>
                          </div>
                      </div>
                  </div>
              )}
              {activeTab === 'Watchlist' && (
                  <div className='bigSectionBG'>
                      <p>My WatchList</p>
                      <div className='form__group__watchlist field'>
                          <input type="text" className="form__field"/>
                          <label htmlFor="name" className="form__label">Add a stock</label>
                      </div>
                      <p className='stockDisplayListWatchlist'>
                          {watchlist.map(company => (
                              <span key={company._id} className='stockDisplayListItem'
                                    onClick={() => selectStockFromWatchlist(company)}>
                                    <br></br>
                                  <span>{company.ticker}</span>
            </span>
                          ))}
                      </p>
                      <br/><br/>
                      <p className='stockDisplayListWatchlist'>
                          {watchlist.map(company => (
                              <div key={company._id} className='StockDisplayWatchlistStats'>

                                  <span>Previous Close: {company.details.Open} &emsp;&emsp;
                                      Open: {company.details.Open}&emsp;&emsp;
                                      Market Cap: {company.details.Market_Cap} &emsp;&emsp;
                                      Volume: {company.details.Volume}</span>
                                  <br/>
                                  <span> Market Cap: {company.details.Market_Cap} &emsp;&emsp;
                                      Revenue: {company.details.Revenue} &emsp;&emsp;
                                      PE Ratio: {company.details.PE_Ratio} &emsp;&emsp;
                                      Dividend: {company.details.Dividend} &emsp;&emsp;
                                      <br></br>
                                      Shares Outstanding: {company.details.Shares_outstanding}</span>
                              </div>
                          ))}
                      </p>
                      <div className="topChartClassWatchlist">
                          {selectedStock ? (
                              <Line data={chartData} options={options} />
                          ) : (
                              <div>Loading or Select a Stock...</div>
                          )}
                      </div>
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
                                          <TableCell className="font-medium SearchCompanyName">{company.name}</TableCell>
                                          <TableCell>{company.ticker}</TableCell>
                                      <TableCell>{company.description}</TableCell>
                                      <TableCell className={`font-medium ${company.history['06/13/2024'] - company.history['06/12/2024'] > 0 ? 'stockIncrease' : 'stockDecrease'}`}>
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
                                  <button className="addWatchlistBtn" onClick={() => handleAddToWatchlistClick(clerkId,selectedCompany)}>Add to Watchlist</button>
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
                      <ChatComponent onSendMessage={handleSendMessage} conversation={conversation}/>
                      <ChatbotTaskContext.Provider value={chatbotTask}>
                          <RadioButtonsComponent setChatbotTask={setChatbotTask} />
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