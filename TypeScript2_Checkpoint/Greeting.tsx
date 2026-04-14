import React from 'react';

// Step 1: Define an interface to type the props of the component.
// This tells TypeScript that 'name' must be a string.
interface GreetingProps {
  name: string;
}

// Step 2: Type the functional component using the GreetingProps interface.
// React.FC<GreetingProps> ensures the component receives the correct props.
const Greeting: React.FC<GreetingProps> = ({ name }) => {
  // Step 3: Return JSX — no change needed here, TypeScript handles the rest.
  return <div>Hello, {name}!</div>;
};

export default Greeting;
