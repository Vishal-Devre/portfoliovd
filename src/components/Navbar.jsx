import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaMoon, FaSun, FaBars, FaTimes, FaPalette } from 'react-icons/fa';
import '../hooks/Navbahook';
import './navbar.css';
import './Themes/Theme2.css';
import './Themes/Theme3.css';
import './Themes/Theme4.css';
import './Themes/Theme1.css';
import './Themes/Theme5.css';
import './Themes/Theme6.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Theme dropdown state
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isThemeDropdownClosing, setIsThemeDropdownClosing] = useState(false);
  const [activeTheme, setActiveTheme] = useState('theme1');
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  // Navbar visibility state
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const isDesktopRef = useRef(false);
  const navbarRef = useRef(null);
  const scrollTolerance = 40;

  // Theme colors for the dropdown swatches
  const themeColors = {
    theme1: '#8d50ff',
    theme2: '#FF5252',
    theme3: '#4CAF50',
    theme4: '#FFC107',
    theme5: '#2196F3',
    theme6: '#9C27B0'
  };

  // Disable body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      setScrollPosition(window.scrollY);
      // Apply styles to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    } else {
      // Restore styles and scroll position
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }

    return () => {
      // Cleanup - ensure scrolling is re-enabled
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    };
  }, [isMenuOpen, scrollPosition]);

  // Load saved theme from localStorage when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme1';
    setActiveTheme(savedTheme);
    applyTheme(savedTheme, darkMode);
    isDesktopRef.current = !window.matchMedia('(hover: none)').matches;
  }, [darkMode]);

  // Handle scroll and mouse events
  useEffect(() => {
    if (!isDesktopRef.current) return;

    let mouseTimeout;
    let rafId;
    let lastScrollY = lastScrollYRef.current;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

        if (scrollDelta > 0) {
          setNavbarVisible(false);
        }
        else if (scrollDelta < +scrollTolerance) {
          setNavbarVisible(true);
        }

        if (currentScrollY <= 0) {
          setNavbarVisible(true);
        }

        lastScrollYRef.current = currentScrollY;
        lastScrollY = currentScrollY;
      });
    };

    const handleMouseMove = () => {
      setNavbarVisible(true);
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        if (window.scrollY > 0) setNavbarVisible(false);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseTimeout);
    };
  }, []);

  // Apply the selected theme
  const applyTheme = (themeName, isDark) => {
    document.documentElement.classList.remove(
      'theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6', 'dark'
    );
    document.documentElement.classList.add(themeName);
    if (isDark) document.documentElement.classList.add('dark');
    setActiveTheme(themeName);
    localStorage.setItem('selectedTheme', themeName);
  };

  const startThemeDropdownClosing = useCallback(() => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }

    setIsThemeDropdownClosing(true);
    const timer = setTimeout(() => {
      setIsThemeDropdownOpen(false);
      setIsThemeDropdownClosing(false);
    }, 200);

    setDropdownTimeout(timer);
  }, [dropdownTimeout]);

  const cancelThemeDropdownClosing = useCallback(() => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsThemeDropdownClosing(false);
  }, [dropdownTimeout]);

  const startClosingAnimation = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
      startThemeDropdownClosing();
    }, 200);
    return () => clearTimeout(timer);
  }, [startThemeDropdownClosing]);

  const closeMenu = useCallback(() => {
    if (isMenuOpen) startClosingAnimation();
  }, [isMenuOpen, startClosingAnimation]);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
      setIsClosing(false);
    }
  }, [isMenuOpen, closeMenu]);

  const changeTheme = (themeNumber, e) => {
    e.stopPropagation();
    const themeName = `theme${themeNumber}`;
    applyTheme(themeName, darkMode);
    startThemeDropdownClosing();
    closeMenu();
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    toggleDarkMode();
    applyTheme(activeTheme, newDarkMode);
  };

  const toggleThemeDropdown = useCallback((e) => {
    e.stopPropagation();
    if (isThemeDropdownOpen) {
      startThemeDropdownClosing();
    } else {
      cancelThemeDropdownClosing();
      setIsThemeDropdownOpen(true);
    }
  }, [isThemeDropdownOpen, startThemeDropdownClosing, cancelThemeDropdownClosing]);

  const handleThemeDropdownMouseLeave = useCallback(() => {
    const timer = setTimeout(() => {
      startThemeDropdownClosing();
    }, 700);
    setDropdownTimeout(timer);
  }, [startThemeDropdownClosing]);

  const handleNavbarLinksDoubleClick = useCallback((e) => {
    if (e.target.closest('.navbar-links')) {
      closeMenu();
    }
  }, [closeMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && !e.target.closest('.navbar-container')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('dblclick', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('dblclick', handleOutsideClick);
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [isMenuOpen, closeMenu, dropdownTimeout]);

  return (
    <>
      <nav
        ref={navbarRef}
        className={`navbar ${darkMode ? 'light' : 'dark'} ${!navbarVisible ? 'navbar-hidden' : ''}`}
      >
        <div className="side-box left-box"></div>
        <div className="navbar-container">
          <a
            href="/"
            className="navbar-logo"
            style={{
              visibility: isMenuOpen ? 'hidden' : 'visible',
              opacity: isMenuOpen ? 0 : 1,
              transition: 'all 0.3s ease',
            }}
            onClick={closeMenu}
          >
            <img
              src="images\svglogo.svg"
              alt="Logo"
            />
          </a>

          <div
            className={`navbar-links ${isMenuOpen ? 'active' : ''} ${isClosing ? 'closing' : ''}`}
            onDoubleClick={handleNavbarLinksDoubleClick}
          >
            <a href="/" onClick={closeMenu}>Home</a>
            <a href="/about" onClick={closeMenu}>About</a>
            <a href="/projects" onClick={closeMenu}>Projects</a>
            <a href="/contact" onClick={closeMenu}>Contact</a>

            <div
              className="theme-selector-container"
              onMouseLeave={handleThemeDropdownMouseLeave}
              onMouseEnter={cancelThemeDropdownClosing}
              onClick={toggleThemeDropdown}
            >
              <button
                aria-label="Change theme"
                className="theme-selector-button"
              >
                <h3 className='mytheme'>Themes</h3>
              </button>

              {isThemeDropdownOpen && (
                <div
                  className={`theme-dropdown ${isThemeDropdownClosing ? 'closing' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                  onMouseLeave={handleThemeDropdownMouseLeave}
                  onMouseEnter={cancelThemeDropdownClosing}
                >
                  <div className="theme-grid">
                    {[1, 2, 3, 4, 5, 6].map((themeNumber) => {
                      const themeName = `theme${themeNumber}`;
                      return (
                        <button
                          key={themeNumber}
                          className={`theme-option ${activeTheme === themeName ? 'active' : ''}`}
                          onClick={(e) => changeTheme(themeNumber, e)}
                          data-theme={themeName}
                          aria-label={`Theme ${themeNumber}`}
                          style={{
                            backgroundColor: themeColors[themeName]
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="dandmmode">
              <div className="togglewrap">
                <button
                  onClick={() => {
                    handleDarkModeToggle();
                    closeMenu();
                  }}
                  className="theme-toggle"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <div className="side-box right-box"></div>
      </nav>

      {isMenuOpen && (
        <div
          className={`menu-overlay ${isClosing ? 'closing' : ''}`}
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;