import emailjs from "@emailjs/browser";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";
import {
  FaCheck,
  FaEnvelope,
  FaExclamationCircle,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
import "./Contact.css";
import Navbar from "./Navbar";

const initializeEmailJS = () => {
  if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
    emailjs.init({
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      blockHeadless: true,
    });
  }
};

// Initialize AOS with Y-axis only animations
const initializeAOS = () => {
  AOS.init({
    disable: false,
    startEvent: "DOMContentLoaded",
    initClassName: "aos-init",
    animatedClassName: "aos-animate",
    useClassNames: false,
    disableMutationObserver: false,
    debounceDelay: 50,
    throttleDelay: 99,

    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120,
    delay: 0,
    duration: 400,
    easing: "ease",
    once: true,
    mirror: false,
    anchorPlacement: "top-bottom",
  });
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  // Basic phone validation - allows numbers, +, -, spaces, and parentheses
  return /^[+]?[\s0-9\-\(\)]*$/.test(phone);
};

const Contact = ({ darkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    initializeEmailJS();
    initializeAOS();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!formData.name || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          from_phone: formData.phone,
          message: formData.message,
        }
      );

      if (response.status === 200) {
        setSubmitStatus("success");
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Email delivery failed");
      }
    } catch (err) {
      console.error("Email send failed:", err);
      setSubmitStatus("error");
      setSubmitted(true);
      setError(
        err.text ||
          "Failed to send message. The email may not exist or our server encountered an error."
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setClosing(true);
        setTimeout(() => {
          setShowForm(false);
          setSubmitted(false);
          setClosing(false);
          setSubmitStatus(null);
        }, 300);
      }, 2000);
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setClosing(false);
      setError(null);
      setSubmitted(false);
      setSubmitStatus(null);
    }, 300);
  };

  return (
    <>
      <div className={`app-container ${darkMode ? "dark" : "light"}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <section
          id="contact"
          className={`contact-section ${darkMode ? "dark" : "light"}`}
        >
          <div className="contact-hero">
            <h1 data-aos="fade-up">Get In Touch</h1>
            <button
              className={`cta-button ${darkMode ? "dark" : "light"}`}
              onClick={() => setShowForm(true)}
              aria-label="Contact me"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Contact Me →
            </button>
          </div>

          <div className="contact-grid">
            {[
              { icon: <FaPhone />, title: "Phone", content: "+91 9356091544" },
              {
                icon: <FaEnvelope />,
                title: "Email",
                content: "vishaldevre528@gmail.com",
              },
              {
                icon: <FaMapMarkerAlt />,
                title: "Location",
                content: "Chh.Sambhajinagar, Maharashtra, India",
              },
            ].map((item, index) => (
              <div
                className="contact-card"
                key={index}
                data-aos="fade-up"
                data-aos-delay={150 + index * 50}
              >
                <div className="contact-icon-container">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>

          <div className="lets-talk">
            <h2 data-aos="fade-up">Let's Talk</h2>
            <p data-aos="fade-up" data-aos-delay="50">
              Connect with me on social media
            </p>
            <div className="social-links">
              {[
                {
                  icon: <FaInstagram />,
                  url: "https://www.instagram.com/vishall.1211/",
                },
                {
                  icon: <FaLinkedin />,
                  url: "https://www.linkedin.com/in/vishaldevre/",
                },
                { icon: <FaFacebook />, url: "https://facebook.com" },
              ].map((social, index) => (
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  className="social-link"
                  aria-label={social.icon.type.name}
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 50}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {showForm && (
          <div
            className={`modal-overlay ${closing ? "closing" : ""}`}
            onClick={handleClose}
          >
            <div
              className={`modal-content ${darkMode ? "dark" : "light"} ${
                closing ? "closing" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading ? (
                <div className="loading-container">
                  <div className="dots-loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <p>Sending your message...</p>
                </div>
              ) : !submitted ? (
                <>
                  <button
                    className="close-button"
                    onClick={handleClose}
                    aria-label="Close modal"
                  >
                    <FaTimes />
                  </button>
                  <h2>Get In Touch</h2>
                  <p>
                    Have a project in mind or want to collaborate? Feel free to
                    reach out!
                  </p>
                  {error && (
                    <div className="error-message shake-animation">
                      <FaExclamationCircle className="error-icon" />
                      <span>{error}</span>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        id="name-input"
                        ref={nameInputRef}
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className={`submit-btn ${darkMode ? "dark" : "light"}`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              ) : (
                <div
                  className={`submission-feedback ${
                    submitStatus === "success" ? "success" : "error"
                  } ${submitStatus === "error" ? "shake-animation" : ""}`}
                >
                  <div className="feedback-icon">
                    {submitStatus === "success" ? (
                      <FaCheck />
                    ) : (
                      <FaTimesCircle />
                    )}
                  </div>
                  <h3>
                    {submitStatus === "success"
                      ? "Thank You!"
                      : "Delivery Failed"}
                  </h3>
                  <p>
                    {submitStatus === "success"
                      ? "Your message has been submitted successfully!"
                      : "Failed to deliver your message. Please try again later."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Contact;
