import { useEffect, useState } from 'react';
import './Navbar'
import './Intro.css';

const Intro = ({ onIntroComplete }) => {
  const [animationStage, setAnimationStage] = useState('entering');
  const [lettersVisible, setLettersVisible] = useState(0);

  useEffect(() => {
    const letterInterval = setInterval(() => {
      setLettersVisible(prev => (prev < 9 ? prev + 1 : prev));
    }, 100);

    const completionTimer = setTimeout(() => {
      clearInterval(letterInterval);
      setAnimationStage('exiting');
      setTimeout(() => onIntroComplete(), 600);
    }, 2100);

    return () => {
      clearInterval(letterInterval);
      clearTimeout(completionTimer);
    };
  }, [onIntroComplete]);

  // Function to apply special styling to OTOI letters
  const getLetterClass = (index) => {
    const isSpecialLetter = [1, 5, 7].includes(index); // Positions of O, O, I
    return `${index < lettersVisible ? 'visible' : ''} ${isSpecialLetter ? 'special-letter' : ''}`;
  };

  return (
    <div className={`intro-container ${animationStage}`}>
      <div className="portfolio-text">
        {['V', 'I', 'S', 'H', "U's",'-', 'P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O'].map((letter, index) => (
          <span
            key={index}
            className={getLetterClass(index)}
            style={{ '--i': index }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Intro;