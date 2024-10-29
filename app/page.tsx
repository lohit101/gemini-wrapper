"use client";

import { useState } from 'react';

export default function Home() {
  const [joke, setJoke] = useState('');

  const fetchJoke = async () => {
    try {
      const response = await fetch('/api/generate'); // Call your API route
      const data = await response.text();
      console.log(data);
      setJoke(data);
    } catch (error) {
      console.error('Error fetching joke:', error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <p>Tell me a joke</p>
      <button onClick={fetchJoke} className='btn btn-primary'>Tell</button> {/* Call fetchJoke on click */}
      {joke && <p>{joke}</p>} {/* Display the joke if available */}
    </div>
  );
}
