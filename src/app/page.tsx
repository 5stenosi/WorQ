'use client';

import React, { useState, useEffect, useRef } from 'react';

import HorizontalOptions from '../components/HorizontalOptions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MapComponent from '@/components/MapComponent';

const HomePage = () => {

  const [searchText, setSearchText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/offices/office (1).jpg',
    '/offices/office (2).jpg',
    '/offices/office (3).jpg',
    '/offices/office (4).jpg',
    '/offices/office (5).jpg',
    '/offices/office (6).jpg',
    '/offices/office (7).jpg',
    '/offices/office (8).jpg',
  ];

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        return nextIndex;
      });
    }, 15000); // Cambia immagine ogni 15 secondi

    return () => {
      clearInterval(interval); // Pulisce l'intervallo delle immagini
    };
  }, [images.length]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      if (containerRef.current) {
        const delta = e.deltaY;
        containerRef.current.scrollBy({ top: delta, behavior: 'smooth' });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = document.querySelectorAll('section');
        const currentSection = Array.from(sections).find((section) =>
          section.getBoundingClientRect().top >= 0
        );

        if (currentSection) {
          const currentIndex = Array.from(sections).indexOf(currentSection);
          if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
          } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // OSSERVAZIONI
  // Ombre sm: si
  // Come gestiamo i tag <h1>, <h2>, <h3> ecc.? Chiediamo a DeepSeek alla fine.

  // Facciamo i filtri sticky?
  // Provo il typwriter o animazioni Rombo per mostrare tutti i filtri
  // Mettiamo uno sfondo alla navbar?
  // Per le animazioni le dobbiamo mettere solo per le persone che le vogliono vedere o per tutti?
  // IMPORTANTE: come si gestisce la navbar Forc?
  // Potremmo usare Framer Motion per animazioni on scroll
  // Che ombra diamo al carosello?

  return (
    <div id='home' className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar px-10">

      {/* Sezione 1: Navbar e contenuto iniziale */}
      <section className="h-screen pb-5 flex flex-col items-center justify-center snap-start">

        {/* Navbar Placeholder */}
        <nav className="z-50 w-full px-10 py-5 flex justify-between items-center invisible">
          <button className="bg-stone-100">Mappa</button>
        </nav>
        {/* Navbar */}
        <nav className="z-1000 w-full px-10 py-5 flex justify-between items-center fixed top-0">
          <button className="bg-stone-100 shadow-sm">Mappa</button>
          <h3 className="font-bold text-3xl absolute left-1/2 transform -translate-x-1/2">WorQ</h3>
          <div className="flex gap-5">
            <button className="bg-stone-900 text-stone-100 shadow-sm">Register</button>
            <button className="bg-stone-900 text-stone-100 shadow-sm">Login</button>
          </div>
        </nav>

        {/* Carosello */}
        <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Office ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="absolute size-12 left-5 top-1/2 transform -translate-y-1/2 bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full transition"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={handleNext}
            className="absolute size-12 right-5 top-1/2 transform -translate-y-1/2 bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full transition"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          {/* Indicatori */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-stone-900/25 backdrop-blur-sm p-2 rounded-full flex gap-2 *:cursor-pointer">
            {/* Palline opache */}
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentImageIndex(index)} // Cambia immagine al click
                className={`w-3 h-3 rounded-full bg-stone-100/25 hover:bg-stone-100/50 transition`}
              ></div>
            ))}
            {/* Pallina principale */}
            <div
              className="w-3 h-3 rounded-full bg-stone-100 absolute transition-transform duration-500"
              style={{ transform: `translateX(${currentImageIndex * 1.25}rem)` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Sezione 2: Contenuto aggiuntivo */}
      <section className="h-screen pb-5 flex flex-col items-center justify-center snap-start">
        {/* Navbar Placeholder */}
        <nav className="z-50 w-full px-10 py-5 flex justify-between items-center invisible">
          <button className="bg-stone-100">Mappa</button>
        </nav>
        <MapComponent />
      </section>

      {/* Sezione 3: Altra sezione */}
      <section className="h-[200vh] flex items-center justify-center bg-green-100 snap-start">
        <div className="bg-stone-300 p-2 rounded-3xl flex gap-3">
          <HorizontalOptions
            options={['Meeting Rooms', 'Private Offices', 'Study Rooms', 'Outdoor Spaces']}
            initialSelected={0}
            backgroundColor="bg-stone-100"
            optionClassName="px-5 h-full flex justify-center items-center"
            containerClassName="bg-stone-300 rounded-2xl w-full overflow-hidden" />
          <div className={`w-14 ${searchText ? 'w-80 pl-3' : 'hover:w-80 hover:pl-3 focus-within:pl-3 focus-within:w-80'} bg-stone-100 rounded-2xl flex transition-all`}>
            <input type="text" placeholder="Cerca..." id="search-bar" className="w-full outline-0" onChange={(e) => setSearchText(e.target.value)} />
            <button className="aspect-square size-14 bg-stone-100 text-2xl">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;