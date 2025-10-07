import { useGSAP } from "@gsap/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import Chatbot from "./Chatbot.jsx";
import "./Home.css";
import Navbar from "./Navbar.jsx";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const TechIcon = ({ icon, onClick }) => {
  const iconSources = {
    html: "/images/htmlicon.png",
    staricon: "images/staricon.png",
    js: "/images/jsicon.png",
    react: "/images/reacticon.png",
    vscode: "/images/vscodeicon.png",
    css: "/images/cssicon.png",
    github: "/images/githubicon.png",
  };

  return (
    <div
      className="tech-icon-container"
      onClick={onClick}
      role="button"
      aria-label={`${icon} icon`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <img
        src={iconSources[icon] || iconSources.html}
        alt={icon}
        className={`tech-icon ${icon === "github" ? "profile" : ""}`}
        loading="lazy"
      />
    </div>
  );
};

const ChatbotToggle = ({ isOpen, onClick }) => {
  return (
    <div
      className="chatbot-toggle"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      role="button"
      tabIndex={0}
    >
      <FaCommentDots className="chat-icon" />
      {!isOpen && <span className="pulse-ring" aria-hidden="true"></span>}
    </div>
  );
};

const AnimatedText = ({ texts, isMobile }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setFade(true);
      }, 500);
    }, 1500);

    return () => clearInterval(textInterval);
  }, [texts.length]);

  return (
    <span className={`animated-text ${fade ? "fade-in" : "fade-out"}`}>
      {texts[currentTextIndex]}
    </span>
  );
};

const Home = ({ darkMode, toggleDarkMode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/images/homeimage.jpg",
    "/images/changeimg2.jpg",
    "/images/changeimg6.png",
    "/images/changeimg4.jpg",
    "/images/changeimg5.jpg",
    "/images/changeimg3.jpg",
  ];

  // Auto-rotate images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [images.length]);

  // State management
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [icons] = useState([
    { id: 1, type: "html", active: true },
    { id: 2, type: "staricon", active: true },
    { id: 3, type: "js", active: true },
    { id: 4, type: "react", active: true },
    { id: 5, type: "vscode", active: true },
    { id: 6, type: "github", active: true },
    { id: 7, type: "css", active: true },
  ]);
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const homeImageRef = useRef(null);
  const iconsRef = useRef([]);
  const section3Ref = useRef(null);
  const overlayRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Constants
  const textVariations = [
    "Web Developer",
    "UI/UX Designer",
    "Frontend Developer",
    "Creative Thinker",
    "Tech Enthusiast",
    "Computing Specialist",
  ];

  // Check mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle body scroll when chat is open
  // Updated useEffect for scroll locking (only on mobile)
  useEffect(() => {
    if (isChatOpen && isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isChatOpen, isMobile]);

  // Handle icon click
  const handleIconClick = (id) => {
    const index = icons.findIndex((icon) => icon.id === id);
    if (index !== -1 && iconsRef.current[index]) {
      gsap.to(iconsRef.current[index], {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in",
      });
    }
  };

  // Initialize floating icons animation
  useGSAP(() => {
    if (!homeImageRef.current) return;

    const container = homeImageRef.current;
    const updateIconsPosition = () => {
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const radius =
        Math.min(containerRect.width, containerRect.height) *
        (isMobile ? 0.5 : 0.4);

      iconsRef.current.forEach((iconEl, index) => {
        if (!iconEl) return;

        const angle =
          index * ((2 * Math.PI) / icons.length) + (Math.random() * 0.5 - 0.25);
        const x = centerX + Math.cos(angle) * radius - (isMobile ? 150 : 400);
        const y = centerY + Math.sin(angle) * radius - (isMobile ? 150 : 260);

        gsap.set(iconEl, {
          x: x,
          y: y,
          opacity: 1,
          scale: 1,
        });

        const duration = isMobile
          ? 5 + Math.random() * 5
          : 7 + Math.random() * 7;
        const distanceX = isMobile
          ? 15 + Math.random() * 20
          : 35 + Math.random() * 25;
        const distanceY = isMobile
          ? 15 + Math.random() * 20
          : 35 + Math.random() * 25;

        gsap.to(iconEl, {
          x: `+=${(Math.random() > 0.5 ? 1 : -1) * distanceX}`,
          y: `+=${(Math.random() > 0.5 ? 1 : -1) * distanceY}`,
          duration: duration,
          delay: Math.random() * 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    };

    updateIconsPosition();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateIconsPosition();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // Scroll animation for section 2
  useGSAP(() => {
    if (isMobile) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".sec2container",
        start: "top 55%",
        end: "top -50%",
        scrub: 0.88,
        markers: false,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.fromTo(
      ".txt1",
      { x: 250, y: -100, opacity: 0.6, skewX: -5, skewY: -2 },
      { x: -500, y: -50, opacity: 1, skewX: 20, skewY: 3 },
      "start"
    )
      .fromTo(
        ".txt2",
        { x: -200, y: -100, skewX: 5, opacity: 0.6, skewY: 2 },
        { x: 400, y: -50, skewX: -20, opacity: 1, skewY: -3 },
        "start"
      )
      .fromTo(
        ".sec2imgbox",
        { y: 250, scale: 0.4 },
        { y: -175, scale: 1.2 },
        "start"
      );
  }, [isMobile]);

  // Section 3 animation
  useGSAP(
    () => {
      if (!section3Ref.current || !overlayRef.current || isMobile) return;
      const overlay = overlayRef.current;
      const initialContent = overlay.querySelector(".circle-intro");
      const expandedContent = overlay.querySelector(".circle-content");

      const getCircleSize = () => {
        const viewportSize = Math.min(window.innerWidth, window.innerHeight);
        return {
          initial: viewportSize * 0.15,
          final: viewportSize * 1.8,
        };
      };

      const bigtxt = gsap.timeline({
        scrollTrigger: {
          trigger: ".circle-content",
          start: "center 70%",
          end: "center -50%",
          scrub: true,
          markers: false,
          anticipatePin: 1,
        },
      });

      bigtxt
        .fromTo(
          ".top-left",
          { x: -500, opacity: 0.6, fontWeight: 100, scale: 0.5 },
          { x: -100, opacity: 1, fontWeight: 800, scale: 1 },
          "start"
        )
        .fromTo(
          ".bottom-right",
          { x: 600, opacity: 0.6, fontWeight: 100, scale: 0.5 },
          { x: 100, opacity: 1, fontWeight: 800, scale: 1 },
          "start"
        )
        .fromTo(
          ".section3-object",
          { opacity: 0.6, scale: 2 },
          { opacity: 1, scale: 0.9 },
          "start"
        );

      const { initial } = getCircleSize();
      gsap.set(overlay, {
        clipPath: `circle(${initial}px at center)`,
      });
      gsap.set(expandedContent, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "bottom 100%",
          end: "bottom -80%",
          scrub: 1,
          markers: false,
          pin: true,
          anticipatePin: 1,
          onEnter: () => {
            overlay.classList.add("active");
          },
          onLeaveBack: () => {
            overlay.classList.remove("active");
          },
          onRefresh: () => {
            const resizeSize = getCircleSize().initial;
            tl.progress(0).invalidate();
            gsap.set(overlay, {
              clipPath: `circle(${resizeSize}px at center)`,
            });
          },
        },
      });

      tl.to(overlay, {
        clipPath: `circle(${getCircleSize().final}px at center)`,
        ease: "none",
      })
        .to(expandedContent, { opacity: 1 }, 0)
        .to(initialContent, { opacity: 0 }, 0);
    },
    { scope: section3Ref }
  );

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 120,
      disable: isMobile,
    });

    return () => {
      AOS.refresh();
    };
  }, [isMobile]);

  // Section 3 mirror animation
  useGSAP(() => {
    if (isMobile) return;

    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: ".mirroreffect",
        start: "bottom 80%",
        end: "bottom 10%",
        scrub: 1,
        markers: false,
        anticipatePin: 1,
      },
    });
    tl3
      .fromTo(
        ".mirroreffect",
        { scale: 0.4, opacity: 0.6 },
        { scale: 1, opacity: 1 },
        "start"
      )
      .fromTo(
        ".sec3mirrorbox",
        { scale: 0, opacity: 0.6 },
        { scale: 1, opacity: 1 },
        "start"
      );
  }, []);

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="main">
        {/* Hero Section */}
        <section
          id="home"
          className={`home-section ${darkMode ? "dark" : "light"}`}
        >
          <div className="homewrapper">
            <div className="home-content">
              <h1
                className="home-title"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Hi, I'm
                <span className="name-highlight">
                  {" "}
                  <span className="name-txt-1">V</span>ishal{" "}
                  <span className="name-txt-2">D</span>evre
                </span>
              </h1>
              <h2
                className="home-subtitle"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                I am a{" "}
                <AnimatedText texts={textVariations} isMobile={isMobile} />
              </h2>
              <p
                className="home-description"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Welcome to my creative space where ideas come to life through
                code and design. I build exceptional digital experiences that
                make an impact.
              </p>
              <div
                className="home-buttons"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <a href="/projects" className="btn btn-primary">
                  Explore More
                </a>
                <a href="/about" className="btn btn-secondary">
                  About
                </a>
              </div>
            </div>
            <div
              className="home-image"
              data-aos="fade-up"
              data-aos-delay="500"
              ref={homeImageRef}
            >
              <div className="profileimg">
                <div className="profile-placeholder">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Profile"
                      loading="lazy"
                      className={`profile-image ${index === currentImageIndex ? "active" : ""
                        }`}
                      onError={(e) => {
                        e.target.src = "";
                      }}
                    />
                  ))}
                </div>
                <div className="carousel-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentImageIndex ? "active" : ""
                        }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              {/* Floating Tech Icons */}
              {icons.map((icon, index) => (
                <div
                  key={icon.id}
                  ref={(el) => (iconsRef.current[index] = el)}
                  className="floating-tech-icon"
                >
                  <TechIcon
                    icon={icon.type}
                    onClick={() => handleIconClick(icon.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="scroll-indicator">
            <div className="scroll-down"></div>
            <span>Scroll</span>
          </div>
        </section>

        {/* Section 2 */}
        <section
          id="section2"
          className={`section2 ${darkMode ? "dark" : "light"}`}
        >
          <div className="sec2wrapper">
            <div className="sec2container">
              <div className="txt1">INNOVATION THROUGH DESIGN</div>
              <div className="txt2">THE ART OF INTERACTION</div>
            </div>
            <div className="sec2imgbox">
              <img
                src="images/meeepng.png"
                alt="Project showcase"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section
          className={`section3 ${darkMode ? "dark" : "light"}`}
          ref={section3Ref}
        >
          <div className="section3-overlay" ref={overlayRef}>
            <div className="circle-intro">
              <h2>{isMobile ? "Scroll..." : "Scroll more"}</h2>
            </div>

            <div className="circle-content">
              <div className="section3-object">
                <div className="object-placeholder">
                  <img
                    src="https://i.pinimg.com/736x/ff/71/69/ff7169087d0a23e8f08e7e4bcfaa1383.jpg"
                    alt=""
                  />
                  <div className="mirroreffect">
                    <div className="sec3mirrorbox"></div>
                  </div>
                </div>
                <div className="big-word top-left">SOMETHING</div>
                <div className="big-word bottom-right">CREATIVE</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Chatbot Toggle */}
      <ChatbotToggle
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
      />

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Home;
