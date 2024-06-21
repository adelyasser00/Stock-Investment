import React, { useState } from 'react';
import { search } from './lib/actions/user.actions'; // Adjust the path as necessary

const SearchBar = ({onSearchResults}) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission behavior
            console.log('Submitting:', inputValue);
            const request = { searchText: inputValue };
            try {
                const response = await search(request); // Assuming search returns a promise
                console.log('Search response:', response);
                onSearchResults(response);
                // Handle further actions based on response
            } catch (error) {
                console.error('Search failed:', error);
                // Handle errors
            }
        }
    };

    return (
        <input
            className="searchBar"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter to search..."
        />
    );
};

export default SearchBar;
