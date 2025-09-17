import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/loader';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Intro from './components/Intro';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('introShown');
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light', !darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleIntroComplete = () => {
    sessionStorage.setItem('introShown', 'true');
    setShowIntro(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark' : 'light'}`}>
        {showIntro && <Intro onIntroComplete={handleIntroComplete} />}

        {!showIntro && (
          <>
            <Loader />
            <Routes>
              {/* Remove template literals from paths */}
              <Route path="/" element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/about" element={<About darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/projects" element={<Projects darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/contact" element={<Contact darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;