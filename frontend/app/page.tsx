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
import {search} from "@/lib/actions/user.actions"
import SearchBar from './searchbar'
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
import {flushAndExit} from "next/dist/telemetry/flush-and-exit";






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

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className='userButton'>
            <UserButton afterSignOutUrl={"https://8adc-197-246-35-202.ngrok-free.app"}  />
        </div>


      <div>
        {activeTab === 'Home' && (
            <div>
                {/*<div className='bigSectionBG'>*/}
                {/*    <p>Recommendations, Just for you!*/}
                {/*    </p>*/}
                {/*    <div className='form__group__watchlist field'>*/}
                {/*        <input type="text" className="form__field"/>*/}
                {/*        <label htmlFor="name" className="form__label">Search amongst recommendations</label>*/}
                {/*    </div>*/}
                {/*    <p className='stockDisplayListWatchlist'>*/}
                {/*        <span className='stockDisplayListItem' onClick={() => setSelectedStock('AAPL')}>AAPL</span>*/}
                {/*        <br></br>*/}
                {/*        <span className='stockDisplayListItem' onClick={() => setSelectedStock('MSFT')}>ALDX</span>*/}
                {/*        <br></br>*/}
                {/*        <span className='stockDisplayListItem' onClick={() => setSelectedStock('TSLA')}>BASE</span>*/}
                {/*        <br></br>*/}
                {/*        <span className='stockDisplayListItem' onClick={() => setSelectedStock('MSFT')}>MSFT</span>*/}
                {/*        <br></br>*/}
                {/*        <span className='stockDisplayListItem' onClick={() => setSelectedStock('TSLA')}>TSLA</span>*/}

                {/*    </p>*/}
                {/*    <br></br>*/}
                {/*    <br></br>*/}
                {/*    <p className='stockDisplayListWatchlist'>*/}
                {/*        <div className='StockDisplayWatchlistStats'>*/}
                {/*            <span>Previous Close: 172.62  &emsp;&emsp;    Open: 175.60&emsp;&emsp;    Bid 173.05 x 1400&emsp;&emsp; Volume: 75,000,820</span>*/}
                {/*            <br></br>*/}
                {/*            <span> Ask: 173.07 x 1100&emsp;&emsp; Day's Range: 173.52 - 177.71 &emsp;&emsp;52 Week Range: 155.98 - 199.62</span>*/}
                {/*        </div>*/}
                {/*    </p>*/}

                {/*    <div className="topChartClassWatchlist">*/}
                {/*        <Line data={data} options={options}></Line>*/}
                {/*    </div>*/}

                {/*</div>*/}
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
                                <button className='submit-button save-button' onClick={() => savePost(article,clerkId)}>Save</button>
                            </div>
                        </div>
                    ))}
                    {/*<div className='postContainer'>*/}
                    {/*    <div className='postContent'>*/}
                    {/*        <p className={'postTitle'}><a href='https://www.almasryalyoum.com/news/details/3190684'>ضبط*/}
                    {/*            7*/}
                    {/*            مليون جنيه حصيلة تجارة العملة خلال 24 ساعة</a></p>*/}

                    {/*        <p className='postPubDate'>Tue, 11 Jun 2024 12:52:44 +0300</p>*/}
                    {/*            <a href='https://www.almasryalyoum.com/news/details/3190684'> <img*/}
                    {/*                src="https://mediaaws.almasryalyoum.com/news/small/2024/05/11/2391276_0.jpeg"*/}
                    {/*                alt="Modal Icon" className="post-image"/>*/}
                    {/*            </a>*/}
                    {/*        <p className={'post-text'}>نجح قطاع الأمن العام بالتنسيق مع الإدارة العامة لمكافحة جرائم*/}
                    {/*            الأموال العامة ومديريات الأمن خلال24 ساعة في توجيه عدد من الضربات الأمنية لجرائم*/}
                    {/*            الإتجار غير المشروع بالنقد الأجنبى والمضاربة بأسعار العملات عن طريق إخفائها عن*/}
                    {/*            التداول والإتجار بها خارج نطاق السوق المصرفى ، وما تمثله...</p>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
                    {/*<div className='postContainer'>*/}
                    {/*    <div className='postContent'>*/}
                    {/*        <p className={'postTitle'}><a href='https://www.almasryalyoum.com/news/details/3190692'>مصادر*/}
                    {/*            برلمانية تكشف آخر تطورات قانون الإيجار القديم: إحصائيات أولية واجتماع مرتقب</a></p>*/}
                    {/*        <p className='postPubDate'>Tue, 11 Jun 2024 12:52:13 +0300</p>*/}
                    {/*        <a href='https://www.almasryalyoum.com/news/details/3190692'>*/}
                    {/*            <img src="https://mediaaws.almasryalyoum.com/news/small/2024/01/06/2291847_0.jpg"*/}
                    {/*                 alt="Post Image" className="post-image"/>*/}
                    {/*        </a>*/}
                    {/*        <p className={'post-text'}>قالت مصادر بلجنة الإسكان بمجلس النواب أن الأرقام التي وصلت للجنة*/}
                    {/*            حتي الآن فيما يخص «الإيجار القديم» تشير إلى أن 82% من الوحدات السكنية الخاضعة لقانون*/}
                    {/*            الإيجار القديم تقع في محافظات القاهرة والإسكندرية والجيزة والقليوبية، و18% منها مقسمة*/}
                    {/*            على باقي المحافظات، لافتًا إلى أن الحصر كشف عن وجود مباني...</p>*/}
                    {/*    </div>*/}

                    {/*</div>*/}

                    {/*<div className='postContainer'>*/}
                    {/*    <div className='postContent'>*/}
                    {/*        <p className={'postTitle'}><a href='https://www.almasryalyoum.com/news/details/3190667'>تجهيز*/}
                    {/*            250 شاحنة تمهيدًا لإدخالها الى قطاع غزة عبر بوابة معبر «كرم أبو سالم»</a></p>*/}
                    {/*        <p className='postPubDate'>Tue, 11 Jun 2024 12:51:32 +0300</p>*/}
                    {/*        <a href="https://www.almasryalyoum.com/news/details/3190667" target="_blank">*/}
                    {/*            <img src="https://mediaaws.almasryalyoum.com/news/small/2024/05/26/2403979_0.jpeg"*/}
                    {/*                 alt="Post Image" className="post-image"/>*/}
                    {/*        </a>*/}
                    {/*        <p className={'post-text'}>جهز الهلال الأحمر المصري في شمال سيناء، اليوم الثلاثاء، عدد 250*/}
                    {/*            شاحنة تضم مواد اغاثية وإنسانية تمهيدا لإدخالها الي قطاع غزة عبر بوابة معبر كرم أبو سالم*/}
                    {/*            جنوب مدينة رفح. وقال مصدر مسؤول بالهلال الأحمر المصري بشمال سيناء، ان الشاحنات تضم*/}
                    {/*            شاحنات وقود واغذية وادوية ومساعدات إنسانية واغاثية،...</p>*/}
                    {/*    </div>*/}


                    {/*</div>*/}

                    {/*<div className='postContainer'>*/}
                    {/*    <div className='postContent'>*/}
                    {/*        <p className={'postTitle'}><a href='https://www.almasryalyoum.com/news/details/3190670'>طقس*/}
                    {/*            شديد الحرارة بشمال سيناء</a></p>*/}
                    {/*        <p className='postPubDate'>Tue, 11 Jun 2024 12:50:48 +0300</p>*/}
                    {/*        <img src="https://mediaaws.almasryalyoum.com/news/small/2024/06/03/2409392_0.jpg"*/}
                    {/*             alt="Post Image" className="post-image"/>*/}
                    {/*        <p className={'post-text'}>يسود مدن محافظة شمال سيناء، اليوم الثلاثاء، طقس شديد الحرارة خلال*/}
                    {/*            ساعات النهار ومعتدل الحرارة خلال ساعات الليل وفي الساعات الاولي من الصباح، مع تعرض مدن*/}
                    {/*            المحافظة لرياح خفيفة ساهمت في تلطيف درجات الحرارة. وقالت الهيئة العامة للأرصاد الجوية إن*/}
                    {/*            درجات الحرارة بمدن محافظة شمال...</p>*/}
                    {/*    </div>*/}

                    {/*</div>*/}

                    {/*<div className='postContainer'>*/}
                    {/*    <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="companyIcon"/>*/}
                    {/*    <p style={{color: '#7140DEFF'}}>&emsp;&emsp;&ensp;Fathallah Gomla Market</p>*/}
                    {/*    <p><br></br></p>*/}
                    {/*    <p className={'post-text'}>Luxury Living Furnishings reported a decline in quarterly revenue,*/}
                    {/*        attributing the downturn to a sluggish luxury goods market and decreased consumer spending*/}
                    {/*        in key demographics.</p>*/}
                    {/*    <p className={'post-text'}>Despite lower sales, the company has managed to maintain*/}
                    {/*        profitability through stringent cost controls and inventory management.</p>*/}
                    {/*    <p className={'post-text'}>In response to current market conditions, Luxury Living is pivoting*/}
                    {/*        towards more online sales channels and enhancing their digital marketing efforts.</p>*/}
                    {/*    <p className={'post-text'}>The company also announced a new designer partnership aimed at*/}
                    {/*        rejuvenating its product line and attracting a younger clientele.</p>*/}
                    {/*    <p className={'post-text'}>Analysts are closely watching Luxury Living's strategic shifts, with*/}
                    {/*        some expressing concerns about the brand's ability to adapt to rapidly changing consumer*/}
                    {/*        preferences.</p>*/}

                    {/*</div>*/}
                    {/*<div className='postContainer'>*/}
                    {/*    <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="companyIcon"/>*/}
                    {/*    <p style={{color: '#7140DEFF'}}>&emsp;&emsp;&ensp;HSBC CO.</p>*/}
                    {/*    <p><br></br></p>*/}
                    {/*    <p className={'post-text'}>This is a post</p>*/}
                    {/*</div>*/}
                    {/*<div className='postContainer'>*/}
                    {/*    <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="companyIcon"/>*/}
                    {/*    <p style={{color: '#7140DEFF'}}>&emsp;&emsp;&ensp;Ezz Steel Company Ltd.</p>*/}
                    {/*    <p><br></br></p>*/}
                    {/*    <p className={'post-text'}>This is another post</p>*/}
                    {/*</div>*/}
                    {/*<div className='postContainer'>*/}
                    {/*    <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="companyIcon"/>*/}
                    {/*    <p style={{color: '#7140DEFF'}}>&emsp;&emsp;&ensp;Allianz Bank</p>*/}
                    {/*    <p><br></br></p>*/}
                    {/*    <p className={'post-text'}>and Another post</p>*/}
                    {/*    <p className={'post-text'}>with multiple lines</p>*/}
                    {/*</div>*/}
                    {/*<div className='postContainer'>*/}
                    {/*    <img src="/css/icons/200-x-200.jpg" alt="Modal Icon" className="companyIcon"/>*/}
                    {/*    <p style={{color: '#7140DEFF'}}>&emsp;&emsp;&ensp;Allianz Bank</p>*/}
                    {/*    <p><br></br></p>*/}
                    {/*    <p className={'post-text'}>and Another post</p>*/}
                    {/*    <p className={'post-text'}>with one,</p>*/}
                    {/*    <p className={'post-text'}>Two Three lines</p>*/}
                    {/*</div>*/}
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
                      <SearchBar onSearchResults={handleSearchResults} />
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
