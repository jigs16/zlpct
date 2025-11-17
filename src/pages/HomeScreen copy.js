import React, { useEffect, useState } from 'react';
import '../css/HomePage.css';

const HomeScreen = () => {
  const slides = [
    {
      url: 'https://fastly.picsum.photos/id/76/4912/3264.jpg?hmac=VkFcSa2Rbv0R0ndYnz_FAmw02ON1pPVjuF_iVKbiiV8',
      title: 'Slide 1: Nature Escape',
    },
    {
      url: 'https://fastly.picsum.photos/id/7/4728/3168.jpg?hmac=c5B5tfYFM9blHHMhuu4UKmhnbZoJqrzNOP9xjkV4w3o',
      title: 'Slide 2: Tech Innovation',
    },
    {
      url: 'https://fastly.picsum.photos/id/43/1280/831.jpg?hmac=glK-rQ0ppFClW-lvjk9FqEWKog07XkOxJf6Xg_cU9LI',
      title: 'Slide 3: Adventure Awaits',
    },
    // Add more slides as needed
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Manual navigation
  const goToSlide = (index) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);

  return (
    <div
      className="slider-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slider-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img src={slide.url} alt={slide.title} />
          </div>
        ))}
      </div>

      <button className="nav-arrow prev-arrow" onClick={prevSlide}>
        &#8249; {/* Left chevron */}
      </button>
      <button className="nav-arrow next-arrow" onClick={nextSlide}>
        &#8250; {/* Right chevron */}
      </button>
      
      <div className="dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;