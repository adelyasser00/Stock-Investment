// pages/onboarding.js
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Ensure the import is correct based on your project setup

const Page = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [preferences, setPreferences] = useState({
        favoriteGenre: '',
        notificationPreferences: false,
    });

    const handleCompleteOnboarding = () => {
        localStorage.setItem('hasCompletedOnboarding', 'true');
        router.push('/');  // Redirect to the homepage or wherever appropriate
    };

    const handleNext = () => {
        const nextStep = step + 1;
        if (nextStep > 2) { // Assuming there are 3 steps
            console.log('Submitting preferences:', preferences);
            handleCompleteOnboarding(); // Use this function instead of router.push('/')
        } else {
            setStep(nextStep);
        }
    };

    const handleSelectGenre = (genre) => {
        setPreferences(prev => ({ ...prev, favoriteGenre: genre }));
        handleNext();
    };

    const handleNotificationPreference = (preference) => {
        setPreferences(prev => ({ ...prev, notificationPreferences: preference }));
        handleNext();
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <h1>Welcome to our service!</h1>
                        <p>Select your favorite genre:</p>
                        <button onClick={() => handleSelectGenre('Rock')}>Rock</button>
                        <button onClick={() => handleSelectGenre('Pop')}>Pop</button>
                        <button onClick={() => handleSelectGenre('Jazz')}>Jazz</button>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <h1>Notification Preferences</h1>
                        <p>Would you like to receive notifications?</p>
                        <button onClick={() => handleNotificationPreference(true)}>Yes</button>
                        <button onClick={() => handleNotificationPreference(false)}>No</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h1>Review your preferences</h1>
                        <p>Favorite Genre: {preferences.favoriteGenre}</p>
                        <p>Notifications: {preferences.notificationPreferences ? 'Yes' : 'No'}</p>
                        <button onClick={handleNext}>Finish Setup</button>
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
