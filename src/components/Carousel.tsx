import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTrashCan } from '@fortawesome/free-solid-svg-icons';

// Props for the Carousel component
interface CarouselProps {
    images: string[]; // Array of image URLs
    autoPlay?: boolean; // Enable automatic slide
    autoPlayInterval?: number; // Interval for autoPlay in ms
    buttonSize?: string; // Size of navigation buttons
    dotSize?: string; // Size of navigation dots
    chevronSize?: string; // Size of chevron icons
    onClearImages?: () => void; // Optional callback to clear all images
}

// Carousel component for displaying images with navigation and optional auto-play
const Carousel: React.FC<CarouselProps> = ({
    images,
    autoPlay = false,
    autoPlayInterval = 10000,
    buttonSize = '',
    dotSize = '',
    chevronSize = '',
    onClearImages,
}) => {
    // State for the currently displayed image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Go to next image
    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Go to previous image
    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Auto-play effect: advances image at interval if enabled
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
            {/* Main carousel container */}
            <div className="relative w-full h-full flex overflow-hidden group">
                {/* Image container with sliding transition */}
                <div className="flex transition-transform duration-500 w-full h-full" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {images.map((image, index) => (
                        <div key={index} className="relative w-full h-full flex-shrink-0">
                            <Image
                                src={image}
                                alt={`Slide ${index + 1}`}
                                fill
                                sizes="100%"
                                priority={index === 0}
                                className="object-cover object-center"
                            />
                        </div>
                    ))}
                </div>

                {images.length > 1 && (
                    <>
                        {/* Previous image button */}
                        <button
                            type='button'
                            onClick={handlePrev}
                            className={`absolute ${buttonSize} ${chevronSize} -left-full group-hover:left-[5%] inset-y-0 my-auto bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-90`}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        {/* Next image button */}
                        <button
                            type='button'
                            onClick={handleNext}
                            className={`absolute ${buttonSize} ${chevronSize} -right-full group-hover:right-[5%] inset-y-0 my-auto bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-90`}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </>
                )}
                {/* Button to clear all images (if provided) */}
                {onClearImages && (
                    <button
                        onClick={onClearImages}
                        className={`absolute ${buttonSize} -top-full group-hover:top-[5%] inset-x-0 mx-auto bg-stone-900/25 hover:bg-red-500 backdrop-blur-sm text-stone-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-90`}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                )}
                {/* Navigation dots */}
                {images.length > 1 && (
                    <div className="absolute -bottom-full group-hover:bottom-[5%] transition-all duration-300 inset-x-0 mx-auto bg-stone-900/25 backdrop-blur-sm p-2 rounded-full flex gap-2 w-fit">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`${dotSize} cursor-pointer rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-stone-100 scale-125' : 'bg-stone-100/25 hover:bg-stone-100/50'}`}>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carousel;