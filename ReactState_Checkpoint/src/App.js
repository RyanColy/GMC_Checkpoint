import React, { Component } from 'react';
import './App.css';

// Class-based App component demonstrating state and lifecycle methods
class App extends Component {
  constructor(props) {
    super(props);

    // Initialize state with a Person object and a boolean to toggle visibility
    this.state = {
      person: {
        fullName: 'Jane Doe',
        bio: 'A passionate software developer who loves building web applications and exploring new technologies.',
        imgSrc: 'https://i.pravatar.cc/150?img=47',
        profession: 'Software Developer',
      },
      shows: false,         // Controls whether the person profile is displayed
      timeSinceMount: 0,    // Tracks seconds elapsed since the component was mounted
    };
  }

  // Lifecycle method: runs after the component is first rendered
  componentDidMount() {
    // Start an interval that increments the timer every second
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        timeSinceMount: prevState.timeSinceMount + 1,
      }));
    }, 1000);
  }

  // Lifecycle method: clean up the interval when the component is unmounted
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Toggle the 'shows' boolean in state when the button is clicked
  toggleProfile = () => {
    this.setState((prevState) => ({
      shows: !prevState.shows,
    }));
  };

  render() {
    const { person, shows, timeSinceMount } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>React State Checkpoint</h1>

          {/* Timer showing seconds since component mounted */}
          <p className="timer">
            Time since component mounted: <strong>{timeSinceMount}s</strong>
          </p>

          {/* Toggle switch that controls person profile visibility */}
          <div className="toggle-wrapper">
            <span className="toggle-label">Show Profile</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={shows}
                onChange={this.toggleProfile}
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
            </label>
          </div>

          {/* Conditionally render the person profile based on shows state */}
          {shows && (
            <div className="profile-card">
              <img
                src={person.imgSrc}
                alt={person.fullName}
                className="profile-img"
              />
              <h2>{person.fullName}</h2>
              <h3>{person.profession}</h3>
              <p>{person.bio}</p>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
