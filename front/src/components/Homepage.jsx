import React, { useState } from 'react';

const Homepage = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <button onClick={increment}>Click me</button>
      {count}
      {/* Add your content here */}
    </div>
  );
};

export default Homepage;
