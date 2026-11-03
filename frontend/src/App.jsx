
import './App.css';
import { useState } from 'react';
import Jobs from './components/Jobs';
import ApplyForm from './components/ApplyForm';

import InterviewPrep from './components/InterviewPrep';

function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  

  const [showRegister, setShowRegister] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const handleApply = (job) => {
    setSelectedJob(job);

    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  

  
  const handleRegister = async (event) => {
    event.preventDefault();
    setAuthMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthMessage(data.message || 'Registration failed.');
        return;
      }

      setAuthMessage(data.message || 'Registration successful!');
      setName('');
      setEmail('');
      setPassword('');

    } catch (error) {
      setAuthMessage('Unable to connect to the server.');
    }
  };

const handleSearch = () => {
  setShowResults(true);

  setTimeout(() => {
    document.getElementById('jobs')?.scrollIntoView({
      behavior: 'smooth'
    });
  }, 100);
};

  return (
    <div>
      <nav className="navbar">
        <h2>CareerConnect <span>AI</span></h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#jobs">Find Jobs</a>
          <a href="#prepare">AI Preparation</a>
          <a href="#about">About</a>
        </div>

        <button
          className="login-btn"
          onClick={() => {
            setShowRegister(true);
            setAuthMessage('');
          }}
        >
          Register
        </button>
      </nav>

      {showRegister && (
        <section className="auth-section">
          <div className="auth-card">
            <button
              className="auth-close"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </button>

            <h2>Create Your Account</h2>
            <p>Join CareerConnect AI and explore opportunities.</p>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength="6"
                required
              />

              <button type="submit">Register</button>
            </form>

            {authMessage && (
              <p className="auth-message">{authMessage}</p>
            )}
          </div>
        </section>
      )}

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">YOUR CAREER, OUR PRIORITY</p>

          <h1>
            Launch a new chapter
            <span> in your career with us.</span>
          </h1>

          <p className="hero-description">
            Explore exciting opportunities, connect with top companies,
            and prepare for interviews with AI-powered guidance.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Job title or keyword"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
            >
              <option value="All Locations">All Locations</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
            </select>

            <button onClick={handleSearch}>Search Jobs</button>
          </div>

          <p className="popular">
            Popular: Developer · Designer · Data Analyst
          </p>

          <img
            src="/developer-illustration.png"
            alt="Developer working on a laptop"
            className="hero-illustration"
          />
        </div>
      </section>
      {showResults && (
  <Jobs
    searchTerm={searchTerm}
    selectedLocation={selectedLocation}
  />
)}
      <section className="features" id="about">
        <h2>Everything You Need to Grow</h2>

        <div className="feature-container">
          <div className="feature-card">
            <h3>Find Jobs</h3>
            <p>Discover opportunities that match your skills.</p>
          </div>

          <div className="feature-card" id="prepare">
            <h3>AI Interview Prep</h3>
            <p>Practice interview questions with AI assistance.</p>
          </div>

          <div className="feature-card">
            <h3>Build Your Career</h3>
            <p>Take the next step towards your dream career.</p>
          </div>
        </div>
      </section>

      

      <InterviewPrep />

      <div id="application-form">
        <ApplyForm selectedJob={selectedJob} />
      </div>
    </div>
  );
}

export default App;
