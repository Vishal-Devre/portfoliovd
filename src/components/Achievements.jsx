import React, { useState, useEffect } from "react";
import {
  FaTrophy,
  FaAward,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Navbar from "./Navbar";
import "./Achievements.css";

const Achievements = ({ darkMode, toggleDarkMode }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle body scroll when popup opens/closes
  useEffect(() => {
    if (selectedAchievement && !isMobile) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else if (!isMobile) {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      if (!isMobile) {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
      }
    };
  }, [selectedAchievement, isMobile]);

  const achievements = [
    {
      id: 1,
      title: "GreenSphere Environmental Platform",
      issuer: "Environmental Sustainability Web",
      date: "27-March-2025",
      description:
        "Validates skills in building responsive, accessible React applications with performance optimization and PWA capabilities.",
      images: [
        "images/project-images/Cardone01.jpg",
        "images/project-images/Cardone02.jpg",
        "images/project-images/Cardone03.jpg",
        "images/project-images/Cardone04.jpg",
      ],
      credentialLink: "https://vd-green-sphere.vercel.app/",

      skills: ["React.js", "Vite", "CSS3", "JavaScript"],
      about:
        "As the team leader of Coding Ninjas (with Ashish Dudhate and Diksha Dhawale), we attended our first hackathon at Cummins College, Pune. The challenge was to create a website/app on Environmental Sustainability. Being only in 1st year SEM-II B.Tech, it was nerve-wracking but incredibly rewarding. Out of 140 teams in the online quiz, 20 were selected for the offline round, and we made it through. In the offline round, we ranked 4th. Mentorship from seniors made the experience even more enriching, and we gained valuable skills and confidence.",
    },
    {
      id: 2,
      title: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      description:
        "Demonstrates ability to design and deploy scalable systems on AWS.",
      images: [
        "images/project-images/Cardotwo01.jpg",
        "images/project-images/Cardotwo02.jpg",
        "images/project-images/Cardotwo03.jpg",
        "images/project-images/Cardotwo04.jpg",
      ],
      credentialLink: "https://www.credly.com/your-badge-id",
      skills: ["AWS", "Cloud Architecture", "Solutions Design", "Scalability"],
      about:
        "This certification validates the ability to design and deploy robust, secure applications on AWS technologies.",
    },
    {
      id: 3,
      title: "Hackathon Winner - Tech Innovation 2023",
      issuer: "Tech Community",
      date: "2023",
      description:
        "First place in national hackathon for developing an innovative AI-powered solution.",
      images: [
        "images/project-images/Cardothree01.jpg",
        "images/project-images/Cardothree02.jpg",
        "images/project-images/Cardothree03.jpg",
        "images/project-images/Cardothree04.jpg",
      ],
      credentialLink: "https://devpost.com/your-project",
      skills: ["AI/ML", "Team Leadership", "Problem Solving", "Innovation"],
      about:
        "Won first prize in a national-level hackathon by developing an AI-powered solution that addresses real-world challenges.",
    },
    {
      id: 4,
      title: "Microsoft Certified: Azure Fundamentals",
      issuer: "Microsoft",
      date: "2022",
      description:
        "Foundational knowledge of cloud services and how those services are provided with Azure.",
      images: [
        "images/project-images/Cardofour01.jpg",
        "images/project-images/Cardofour02.jpg",
        "images/project-images/Cardofour03.jpg",
        "images/project-images/Cardofour04.jpg",
      ],
      credentialLink: "",
      skills: [
        "Azure",
        "Cloud Fundamentals",
        "Microsoft Cloud",
        "Cloud Concepts",
      ],
      about:
        "This certification provides foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
    },
  ];

  const openAchievementDetails = (achievement, event) => {
    if (event.target.closest(".achievement-content")) {
      setSelectedAchievement(achievement);
      setSelectedImageIndex(0);
    }
  };

  const openImageGallery = (achievement, index = 0, event) => {
    event.stopPropagation();
    setSelectedAchievement(achievement);
    setSelectedImageIndex(index);
  };

  const closeAchievementDetails = () => {
    setSelectedAchievement(null);
    setSelectedImageIndex(0);
  };

  const nextImage = (event) => {
    event?.stopPropagation();
    if (selectedAchievement) {
      setSelectedImageIndex(
        (prev) => (prev + 1) % selectedAchievement.images.length
      );
    }
  };

  const prevImage = (event) => {
    event?.stopPropagation();
    if (selectedAchievement) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedAchievement.images.length - 1 : prev - 1
      );
    }
  };

  // Prevent background scroll when popup is open (mobile)
  useEffect(() => {
    if (selectedAchievement && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedAchievement, isMobile]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedAchievement) {
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") prevImage();
        if (event.key === "Escape") closeAchievementDetails();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAchievement]);

  useGSAP(() => {
    const achievementCards = gsap.utils.toArray(".achievement-card");
    achievementCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <section
        id="achievements"
        className={`achievements-section ${darkMode ? "dark" : "light"}`}
      >
        <div className="achievements-container">
          <h1 className="achievements-title">
            My Achievements & Certifications
          </h1>
          <p className="achievements-subtitle">
            Recognitions and certifications that showcase my skills and
            dedication
          </p>

          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${darkMode ? "dark" : "light"}`}
                onClick={(e) => openAchievementDetails(achievement, e)}
              >
                <div className="achievement-image-container">
                  <img
                    src={achievement.images[0]}
                    alt={achievement.title}
                    className="achievement-image"
                    onClick={(e) => openImageGallery(achievement, 0, e)}
                  />
                  {achievement.images.length > 1 && (
                    <div className="image-counter">
                      +{achievement.images.length - 1}
                    </div>
                  )}
                  <div className="achievement-badge">
                    <FaTrophy className="trophy-icon" />
                  </div>
                </div>
                <div className="achievement-content">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <div className="achievement-meta">
                    <span className="achievement-issuer">
                      <FaAward className="meta-icon" />
                      {achievement.issuer}
                    </span>
                    <span className="achievement-date">
                      <FaCalendarAlt className="meta-icon" />
                      {achievement.date}
                    </span>
                  </div>
                  <p className="achievement-description">
                    {achievement.description}
                  </p>
                  <div className="achievement-skills">
                    {achievement.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Details Popup */}
        {selectedAchievement && (
          <div className="project-popup">
            <div
              className={`popup-content-achieve achievement-popup ${
                darkMode ? "dark" : "light"
              }`}
            >
              <button className="close-btn" onClick={closeAchievementDetails}>
                <FaTimes />
              </button>

              <div className="image-gallery-section">
                <div className="main-image-container">
                  <img
                    src={selectedAchievement.images[selectedImageIndex]}
                    alt={`${selectedAchievement.title} - Image ${
                      selectedImageIndex + 1
                    }`}
                    className="main-popup-image"
                  />
                </div>
              </div>

              {selectedAchievement.images.length > 1 && (
                <div className="image-navigation-controls">
                  <button className="nav-btn prev-btn" onClick={prevImage}>
                    <FaChevronLeft />
                  </button>
                  <div className="image-counter-popup">
                    {selectedImageIndex + 1} /{" "}
                    {selectedAchievement.images.length}
                  </div>
                  <button className="nav-btn next-btn" onClick={nextImage}>
                    <FaChevronRight />
                  </button>
                </div>
              )}

              <div className="achievement-details-section">
                <div className="achievement-header">
                  <div className="achievement-header-content">
                    <h2>{selectedAchievement.title}</h2>
                    <div className="achievement-meta">
                      <span className="achievement-issuer">
                        <FaAward className="meta-icon" />
                        {selectedAchievement.issuer}
                      </span>
                      <span className="achievement-date">
                        <FaCalendarAlt className="meta-icon" />
                        {selectedAchievement.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="about-section-achv">
                  <h4>About This Achievement</h4>
                  <p className="achievement-about">
                    {selectedAchievement.about}
                  </p>
                </div>

                <p className="achievement-full-description">
                  {selectedAchievement.description}
                </p>

                <div className="technologies">
                  <h4>Skills Validated:</h4>
                  <div className="tech-tags">
                    {selectedAchievement.skills.map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="popup-links">
                  <a
                    href={selectedAchievement.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt /> View Credential
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Achievements;
