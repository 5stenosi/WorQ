import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTrashCan } from '@fortawesome/free-solid-svg-icons';

// Aggiunto supporto per un bottone opzionale per eliminare le immagini, visibile solo in determinati contesti
interface CarouselProps {
    images: string[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    buttonSize?: string; // Dimensione dei pulsanti di navigazione
    dotSize?: string; // Dimensione dei pallini
    chevronSize?: string; // Dimensione delle frecce
    onClearImages?: () => void; // Funzione opzionale per eliminare le immagini
}

const Carousel: React.FC<CarouselProps> = ({
    images,
    autoPlay = false,
    autoPlayInterval = 10000,
    buttonSize = '', // Valore predefinito per i pulsanti
    dotSize = '', // Valore predefinito per i pallini
    chevronSize = '', // Valore predefinito per le frecce
    onClearImages, // Funzione opzionale per eliminare le immagini
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (autoPlay) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoPlayInterval);

            return () => clearInterval(interval);
        }
    }, [autoPlay, autoPlayInterval, images.length]);

    return (
        <div className="w-full overflow-hidden h-full group">
            {/* Contenitore principale del carosello */}
            <div className="relative w-full h-full flex overflow-hidden group">
                {/* Contenitore delle immagini con transizione */}
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {images.map((image, index) => (
                        // Ogni immagine del carosello
                        <img
                            key={index}
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full object-cover object-center flex-shrink-0" />
                    ))}
                </div>
                {/* Pulsante per immagine precedente */}
                <button
                    type='button'
                    onClick={handlePrev}
                    className={`absolute ${buttonSize} ${chevronSize} -left-full group-hover:left-[5%] inset-y-0 my-auto bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-90`}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {/* Pulsante per immagine successiva */}
                <button
                    type='button'
                    onClick={handleNext}
                    className={`absolute ${buttonSize} ${chevronSize} -right-full group-hover:right-[5%] inset-y-0 my-auto bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-90`}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                {/* Bottone per eliminare tutte le immagini */}
                {onClearImages && (
                    <button
                        onClick={onClearImages}
                        className={`absolute ${buttonSize} -top-full group-hover:top-[5%] inset-x-0 mx-auto bg-stone-900/25 hover:bg-red-500 backdrop-blur-sm text-stone-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-90`}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                )}
                {/* Indicatori di navigazione (pallini) */}
                <div className="absolute -bottom-full group-hover:bottom-[5%] transition-all duration-300 inset-x-0 mx-auto bg-stone-900/25 backdrop-blur-sm p-2 rounded-full flex gap-2 w-fit">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`${dotSize} cursor-pointer rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-stone-100 scale-125' : 'bg-stone-100/25 hover:bg-stone-100/50'}`}>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;