// pages/onboarding.js
// ngrok: ngrok http http://localhost:3000
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../css/onboarding.css';

const GenreItem = ({ genre, isSelected, toggleGenreSelection }) => (
    <div className={`o-type-item ${isSelected ? 'selected' : ''}`} onClick={() => toggleGenreSelection(genre)}>
        <div className="o-type-item__example">
            <span>{genre[0]}</span>
        </div>
        <div className="o-type-item__content">
            <div className="o-type-item__title">{genre}</div>
        </div>
    </div>
);

const Page = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [preferences, setPreferences] = useState({
        favoriteGenres: [],
        favoriteCompanies: [],
    });
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);

    const handleCompleteOnboarding = () => {
        localStorage.setItem('hasCompletedOnboarding', 'true');
        console.log('Submitting final preferences:', preferences);
        router.push('/');  // Redirect to the homepage
    };

    const handleNext = () => {
        setIsNextButtonDisabled(true);
        setTimeout(() => {
            setIsNextButtonDisabled(false);
        }, 1000);  // Re-enable the button after 1 second

        const nextStep = step + 1;
        if (nextStep >= 2) {
            handleCompleteOnboarding();
        } else {
            setStep(nextStep);
        }
    };

    const toggleGenreSelection = (genre) => {
        setPreferences(prev => ({
            ...prev,
            favoriteGenres: prev.favoriteGenres.includes(genre) ?
                prev.favoriteGenres.filter(g => g !== genre) : [...prev.favoriteGenres, genre]
        }));
    };

    const toggleCompanySelection = (genre) => {
        setPreferences(prev => ({
            ...prev,
            favoriteCompanies: prev.favoriteCompanies.includes(genre) ?
                prev.favoriteCompanies.filter(g => g !== genre) : [...prev.favoriteCompanies, genre]
        }));
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <center>
                            <br></br>
                            <h1>What are your fields of interest?</h1>
                            <p>Select one or more</p>
                            <br></br><br></br><br></br><br></br><br></br>
                            <div className="c-type-select">
                                {['Technology', 'Healthcare', 'Financial Services', 'Consumer Goods', 'Energy', 'Telecommunications']
                                    .map(genre => (
                                        <GenreItem
                                            key={genre}
                                            genre={genre}
                                            isSelected={preferences.favoriteGenres.includes(genre)}
                                            toggleGenreSelection={toggleGenreSelection}
                                        />
                                    ))}
                            </div>
                            <button className="o-type-item" onClick={handleNext} disabled={isNextButtonDisabled}>Next
                            </button>
                        </center>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <center>
                            <br></br>
                            <h1>We have gathered some trendy companies to follow</h1>
                            <p>Select one or more</p>
                            <br></br><br></br><br></br><br></br><br></br>
                            <div className="c-type-select">
                                {['Quantum Innovations', 'MediCore Solutions', 'Global Finance Group', 'Luxury Living Goods', 'Green Energy Inc.', 'NextGen Telecom']
                                    .map(company => (
                                        <GenreItem
                                            key={company}
                                            genre={company}
                                            isSelected={preferences.favoriteCompanies.includes(company)}
                                            toggleGenreSelection={toggleCompanySelection}
                                        />
                                    ))}
                            </div>
                            <button className="o-type-item" onClick={handleNext} disabled={isNextButtonDisabled}>Finish
                            </button>
                        </center>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <center>
                            <h1>Review your preferences</h1>
                            <p>Favorite Genres: {preferences.favoriteGenres.join(', ')}</p>
                            <p>Favorite Companies: {preferences.favoriteCompanies.join(', ')}</p>
                            <button onClick={handleNext} disabled={isNextButtonDisabled}>Finish Setup</button>
                        </center>
                    </div>
                );
            default:
                return <div>Reviewing...</div>; // Just in case to handle unexpected state
        }
    };

    return (
        <div>
            {renderStepContent()}
        </div>
    );
};

export default Page;




// 'use client'
// import React, { useState } from 'react';
// import '../css/onboarding.css';
//
// type TypeItemProps = {
//     type: string;
//     desc: string;
//     isSelected: boolean;
//     toggleSelection: (type: string) => void;
// };
//
// const TypeItem: React.FC<TypeItemProps> = ({ type, desc, isSelected, toggleSelection }) => {
//     const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
//         event.preventDefault();
//         toggleSelection(type);
//     };
//
//     return (
//         <a className={`o-type-item ${isSelected ? 'selected' : ''}`} href="#" id={type} onClick={handleClick}>
//             <div className="o-type-item__example">
//                 <span className={type}>Aa</span>
//             </div>
//             <div className="o-type-item__content">
//                 <div className="o-type-item__title">{type}</div>
//                 <div className="o-type-item__subtitle">{desc}</div>
//                 {isSelected && <span className="material-icons o-type-item__icon">check_circle</span>}
//             </div>
//         </a>
//     );
// };
//
// const Onboarding: React.FC = () => {
//     const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//
//     const toggleSelection = (type: string) => {
//         setSelectedTypes(prev => {
//             const currentIndex = prev.indexOf(type);
//             return currentIndex > -1 ? prev.filter(t => t !== type) : [...prev, type];
//         });
//     };
//
//     return (
//         <div>
//             <div className="wrapper">
//                 <div className="c-title">
//                     <h1>Select a Typographic Style:</h1>
//                 </div>
//                 <br></br>
//                 <div className="c-type-select">
//                     {['serif', 'sans-serif', 'monospace', 'display', 'handwriting'].map((type) => (
//                         <TypeItem
//                             key={type}
//                             type={type}
//                             desc="Legible & Fixed"
//                             isSelected={selectedTypes.includes(type)}
//                             toggleSelection={toggleSelection}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Onboarding;
