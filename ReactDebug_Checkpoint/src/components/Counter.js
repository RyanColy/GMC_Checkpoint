import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  // BUG 3: dependency array is empty — message never updates when count changes
  useEffect(() => {
    if (count > 5) {
      setMessage('High count!');
    } else {
      setMessage('');
    }
  }, []);

  return (
    <div style={{ marginBottom: 16 }}>
      <h2>Counter</h2>
      <p>Count: <strong>{count}</strong></p>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: 8 }}>-1</button>
      {/* BUG 4: reset sets to 1 instead of 0 */}
      <button onClick={() => setCount(1)} style={{ marginLeft: 8 }}>Reset</button>
    </div>
  );
}

export default Counter;
