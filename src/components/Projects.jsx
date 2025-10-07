import React, { useState, useEffect } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaHeart,
  FaInfoCircle,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Navbar from "./Navbar";
import "./Achievements.css";
import "./Projects.css";

const Projects = ({ darkMode, toggleDarkMode }) => {
  const [likedProjects, setLikedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [ratings, setRatings] = useState({});

  // Effect to control body overflow when popup is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and CSS.",
      technologies: ["React", "CSS", "JavaScript"],
      githubLink: "https://github.com/yourusername/portfolio",
      liveLink: "https://yourportfolio.com",
      image:
        "https://images.unsplash.com/photo-1565687981296-535f09db714e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "E-commerce App",
      description:
        "Full-stack e-commerce application with payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      githubLink: "https://github.com/yourusername/ecommerce",
      liveLink: "https://yourapp.com",
      image:
        "https://images.unsplash.com/photo-1667422380246-3bed910ffae1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2ViJTIwcHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 3,
      title: "Task Management Tool",
      description: "A productivity app for managing daily tasks and projects.",
      technologies: ["React", "Firebase", "Material UI"],
      githubLink: "https://github.com/yourusername/task-manager",
      liveLink: "https://yourtasks.com",
      image:
        "https://plus.unsplash.com/premium_photo-1683288662019-c92caea8276d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2ViJTIwcHJvamVjdHN8ZW58MHx8MHx8fDA%3D/",
    },
  ];

  const toggleLike = (id) => {
    setLikedProjects((prev) =>
      prev.includes(id)
        ? prev.filter((projectId) => projectId !== id)
        : [...prev, id]
    );
  };

  const handleRating = (id, rating) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const openPopup = (project) => {
    setSelectedProject(project);
  };

  const closePopup = () => {
    setSelectedProject(null);
  };

  const navigateToAchievements = () => {
    window.location.href = "/achievements";
  };

  useGSAP(
    () => {
      // Animation for project rows (fade up - your existing animation)
      const projectRows = gsap.utils.toArray(".project-row");
      projectRows.forEach((row, index) => {
        gsap.fromTo(
          row,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              end: "top 30%",
              toggleActions: "play none none none",
              id: `project-row-${index}`,
            },
          }
        );
        // Special X-direction fade for "About This Project" sections
        const aboutSections = row.querySelectorAll(".project-description-text");
        aboutSections.forEach((section) => {
          // Set initial state
          gsap.set(section, { x: index % 2 === 0 ? -100 : 100, opacity: 0 });

          // Create the animation
          gsap.to(section, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });

          // Add exciting code effects
          const codeElements = section.querySelectorAll("p, li, h3");
          codeElements.forEach((el, idx) => {
            gsap.from(el, {
              duration: 0.5,
              opacity: 0,
              scale: 0.8,
              delay: idx * 0.1,
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            });
          });
        });
      });

      // Add blinking cursor effect to code highlights
      const codeHighlights = gsap.utils.toArray(".code-highlight");
      codeHighlights.forEach((highlight) => {
        gsap.to(highlight, {
          duration: 0.5,
          boxShadow: "0 0 10px rgba(100, 255, 100, 0.7)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });
    },
    { scope: ".projects-alternate-layout" }
  );

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <section
        id="projects"
        className={`projects-section ${darkMode ? "dark" : "light"}`}
      >
        <div className="projects-container">
          <h1 className="projects-title">My Projects</h1>
          <p className="projects-subtitle">Here are some of my recent works</p>

          {/* Achievements Button */}

          <div className="achievements-button-container">
            <button
              className={`achievements-btn ${darkMode ? "dark" : "light"}`}
              onClick={navigateToAchievements}
            >
              <FaTrophy className="trophy-icon" />
              View Achievements & Certifications
            </button>
          </div>

          <div className="projects-alternate-layout">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`project-row ${index % 1 !== 0 ? "right" : "left"}`}
              >
                {index % 2 !== 0 ? (
                  <>
                    <div className="project-description-text">
                      <h3>Project Highlights</h3>
                      <p>
                        The {project.title} was built to solve real-world
                        problems using {project.technologies.join(", ")}.
                      </p>
                      <p>
                        Key features include responsive design, clean code
                        architecture, and user-friendly interface.
                      </p>
                    </div>
                    <div
                      className={`project-card ${darkMode ? "dark" : "light"}`}
                    >
                      <div className="project-image-container">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="project-image"
                        />
                        <button
                          className={`like-btn ${
                            likedProjects.includes(project.id) ? "liked" : ""
                          }`}
                          onClick={() => toggleLike(project.id)}
                        >
                          <FaHeart />
                        </button>
                        <button
                          className="info-btn"
                          onClick={() => openPopup(project)}
                        >
                          <FaInfoCircle />
                        </button>
                      </div>
                      <div className="project-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">
                          {project.description}
                        </p>
                        <div className="project-technologies">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="rating-container">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`star ${
                                star <= (ratings[project.id] || 0)
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => handleRating(project.id, star)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="project-links">
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub /> Code
                        </a>
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaExternalLinkAlt /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`project-card ${darkMode ? "dark" : "light"}`}
                    >
                      <div className="project-image-container">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="project-image"
                        />
                        <button
                          className={`like-btn ${
                            likedProjects.includes(project.id) ? "liked" : ""
                          }`}
                          onClick={() => toggleLike(project.id)}
                        >
                          <FaHeart />
                        </button>
                        <button
                          className="info-btn"
                          onClick={() => openPopup(project)}
                        >
                          <FaInfoCircle />
                        </button>
                      </div>
                      <div className="project-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">
                          {project.description}
                        </p>
                        <div className="project-technologies">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="rating-container">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`star ${
                                star <= (ratings[project.id] || 0)
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => handleRating(project.id, star)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="project-links">
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub /> Code
                        </a>
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="project-description-text">
                      <h3>About This Project</h3>
                      <p>
                        This project showcases my skills in{" "}
                        {project.technologies.join(", ")}. It demonstrates my
                        ability to create {project.title.toLowerCase()} with
                        modern web technologies.
                      </p>
                      <p>
                        Click the info button to learn more about the
                        implementation details.
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Project Details Popup */}
        {selectedProject && (
          <div className="project-popup">
            <div className="popup-content">
              <button className="close-btn" onClick={closePopup}>
                ×
              </button>
              <h2>{selectedProject.title}</h2>
              <img src={selectedProject.image} alt={selectedProject.title} />
              <p>{selectedProject.description}</p>
              <div className="technologies">
                <h4>Technologies:</h4>
                <div className="tech-tags">
                  {selectedProject.technologies.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>
              </div>
              <div className="popup-links">
                <a
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub /> View Code
                </a>
                <a
                  href={selectedProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Projects;
