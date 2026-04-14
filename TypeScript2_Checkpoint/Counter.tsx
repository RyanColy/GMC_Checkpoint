import React, { Component } from 'react';

// Step 1: Define an interface for the component's state.
// 'count' is a number that tracks how many times the button was clicked.
interface CounterState {
  count: number;
}

// Step 2: Define an interface for the component's props.
// This component has no props, so we use an empty interface.
interface CounterProps {}

// Step 3: Pass the Props and State types to Component as generic parameters.
// Component<Props, State> lets TypeScript validate both.
class Counter extends Component<CounterProps, CounterState> {

  // Step 4: Initialize the state with the correct type.
  state: CounterState = {
    count: 0,
  };

  // Step 5: Type the increment method — it returns void (nothing).
  increment = (): void => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;
