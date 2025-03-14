import React, { useState, useEffect } from 'react';

const CategorySelectInput = () => {
  const [inputValue, setInputValue] = useState('');

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchData = async (query) => {
    try {
      const response = await fetch(`/api/search?text=${query}`);
      const data = await response.json();
      console.log(data);
      // Handle the data as needed
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedFetchData(value);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <div>
        {/* Render search results here */}
      </div>
    </div>
  );
};

export default CategorySelectInput; 