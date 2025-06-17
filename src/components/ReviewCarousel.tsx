import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStarHalf } from '@fortawesome/free-solid-svg-icons/faStarHalf';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons/faArrowLeftLong';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons/faArrowRightLong';

// Definiamo i tipi
type Review = {
    name: string;
    text: string;
    rating: number;
};

const reviews = [
    { name: "Alice Johnson", text: "The coworking space is fantastic! The environment is so inspiring and the facilities are top-notch. Highly recommend!", rating: 5 },
    { name: "Michael Brown", text: "Great place to work! The meeting rooms are well-equipped and the staff is very friendly. Will definitely come back.", rating: 4.5 },
    { name: "Sophia Davis", text: "I love the flexibility this coworking space offers. The booking process is seamless and the ambiance is perfect for productivity.", rating: 4 },
    { name: "James Wilson", text: "The internet speed is excellent, and the coffee is a nice touch. However, the noise level can be distracting at times.", rating: 3.5 },
    { name: "Emma Martinez", text: "The coworking space is clean, modern, and has everything you need. The community vibe is also a big plus!", rating: 5 },
    { name: "Oliver Garcia", text: "I was able to find and book a private office easily. The space exceeded my expectations. Highly recommend!", rating: 5 },
    { name: "Isabella Rodriguez", text: "The coworking space is very well-organized. The seating options are comfortable, but the lighting could be improved.", rating: 4 },
    { name: "Liam Hernandez", text: "This platform made it so easy to find a space that fits my needs. The coworking space I booked was perfect!", rating: 4.5 },
    { name: "Mia Lopez", text: "I had a good experience booking a meeting room. The process was smooth, but the room lacked some essential equipment.", rating: 3.5 }
];

// Renders star icons based on the rating value
const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    return (
        <div className="flex items-center mb-1 sm:mb-2 md:mb-3">
            {[...Array(fullStars)].map((_, index) => (
                <FontAwesomeIcon
                    key={`full-${index}`}
                    icon={faStar}
                    className="text-yellow-400 mr-0.5 sm:mr-1 md:mr-2"
                />
            ))}
            {halfStar && (
                <FontAwesomeIcon
                    icon={faStarHalf}
                    className="text-yellow-400 mr-0.5 sm:mr-1 md:mr-2"
                />
            )}
        </div>
    );
};

// ReviewCarousel displays a horizontally scrollable carousel of reviews
const ReviewCarousel = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [centeredReviewIndex, setCenteredReviewIndex] = useState<number | null>(null);
    const [leftArrowClicked, setLeftArrowClicked] = useState(false);
    const [rightArrowClicked, setRightArrowClicked] = useState(false);

    // Dimensions for review card and gap
    const reviewWidth = 500;
    const gap = 20;

    // Updates the index of the review currently centered in the viewport
    const updateCenteredReview = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerWidth = container.clientWidth;
            const scrollPosition = container.scrollLeft + containerWidth / 2;

            // Calculate the index of the centered review
            const reviewElements = Array.from(container.querySelectorAll('[data-is-review="true"]'));
            let centeredIndex = null;

            for (let i = 0; i < reviewElements.length; i++) {
                const element = reviewElements[i] as HTMLElement;
                const elementLeft = element.offsetLeft;
                const elementRight = elementLeft + element.offsetWidth;

                if (scrollPosition >= elementLeft && scrollPosition <= elementRight) {
                    centeredIndex = i;
                    break;
                }
            }

            setCenteredReviewIndex(centeredIndex);
        }
    };

    // Scrolls to the previous review
    const scrollLeft = () => {
        if (scrollContainerRef.current && centeredReviewIndex !== null && centeredReviewIndex > 0) {
            setLeftArrowClicked(true);
            const container = scrollContainerRef.current;
            const reviewElements = Array.from(container.querySelectorAll('[data-is-review="true"]'));

            if (reviewElements[centeredReviewIndex - 1]) {
                const targetElement = reviewElements[centeredReviewIndex - 1] as HTMLElement;
                const targetPosition = targetElement.offsetLeft - (container.clientWidth / 2) + (targetElement.offsetWidth / 2);

                container.scrollTo({
                    left: targetPosition,
                    behavior: 'smooth',
                });
            }

            setTimeout(() => setLeftArrowClicked(false), 250); // Reset after animation
        }
    };

    // Scrolls to the next review
    const scrollRight = () => {
        if (scrollContainerRef.current && centeredReviewIndex !== null && centeredReviewIndex < reviews.length - 1) {
            setRightArrowClicked(true);
            const container = scrollContainerRef.current;
            const reviewElements = Array.from(container.querySelectorAll('[data-is-review="true"]'));

            if (reviewElements[centeredReviewIndex + 1]) {
                const targetElement = reviewElements[centeredReviewIndex + 1] as HTMLElement;
                const targetPosition = targetElement.offsetLeft - (container.clientWidth / 2) + (targetElement.offsetWidth / 2);

                container.scrollTo({
                    left: targetPosition,
                    behavior: 'smooth',
                });
            }

            setTimeout(() => setRightArrowClicked(false), 250); // Reset after animation
        }
    };

    // On mount, center the initial review and set up scroll event listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        const initialReviewIndex = Math.floor(reviews.length / 2); // Center review
        if (container) {
            const initialScrollPosition = (reviewWidth + gap) * initialReviewIndex - (container.clientWidth / 2) + (reviewWidth / 2);
            container.scrollTo({
                left: initialScrollPosition,
                behavior: 'auto',
            });
            // Update state after a short delay to allow rendering
            setTimeout(updateCenteredReview, 100);
        }

        if (container) {
            container.addEventListener('scroll', updateCenteredReview);
            return () => container.removeEventListener('scroll', updateCenteredReview);
        }
    }, []);

    // Determine if the carousel is at the start or end
    const isAtStart = centeredReviewIndex === 0;
    const isAtEnd = centeredReviewIndex === reviews.length - 1;

    return (
        <div className="relative w-full">
            {/* Scrollable container for reviews */}
            <div ref={scrollContainerRef} className="w-full overflow-x-scroll no-scrollbar snap-x snap-mandatory pl-5 sm:pl-10 md:pl-15 lg:pl-20">
                <div className="flex gap-x-5 sm:gap-x-10 md:gap-x-15 lg:gap-x-20">
                    {reviews.map((review, index) => (
                        <div
                            key={`review-${index}`}
                            style={{ width: `${reviewWidth}px` }}
                            className="sm:flex-shrink-0 p-5 sm:p-10 md:p-12 lg:p-16 bg-stone-900 text-stone-100 rounded-2xl sm:rounded-3xl lg:rounded-4xl snap-center"
                            data-is-review="true">
                            <div className='flex flex-col gap-3 sm:gap-5 md:gap-8 lg:gap-10'>
                                <div>
                                    {renderStars(review.rating)}
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg italic mb-2 sm:mb-4 md:mb-6">"{review.text}"</p>
                                </div>
                                <div className="flex justify-end">
                                    <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">- {review.name}</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="shrink-0 w-[0.1px]"></div>
                </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex justify-center mt-3 sm:mt-5 md:mt-7 gap-x-5 sm:gap-x-10 md:gap-x-12">
                <button
                    onClick={scrollLeft}
                    disabled={isAtStart}
                    aria-label="Scroll left"
                    className={`p-4 sm:p-6 md:p-8 text-lg sm:text-xl md:text-2xl rounded-full aspect-square flex items-center justify-center transition-all duration-200 group ${isAtStart
                        ? 'text-stone-600 cursor-not-allowed'
                        : 'text-stone-800 hover:bg-stone-900 hover:text-stone-100'
                        }`}>
                    <FontAwesomeIcon
                        className={`transition-transform duration-250 ${leftArrowClicked ? '-translate-x-1 sm:-translate-x-2' : ''}`}
                        icon={faArrowLeftLong} />
                </button>
                <button
                    onClick={scrollRight}
                    disabled={isAtEnd}
                    aria-label="Scroll right"
                    className={`p-4 sm:p-6 md:p-8 text-lg sm:text-xl md:text-2xl rounded-full aspect-square flex items-center justify-center transition-all duration-200 group ${isAtEnd
                        ? 'text-stone-600 cursor-not-allowed'
                        : 'text-stone-800 hover:bg-stone-900 hover:text-stone-100'
                        }`}>
                    <FontAwesomeIcon
                        className={`transition-transform duration-250 ${rightArrowClicked ? 'translate-x-1 sm:translate-x-2' : ''}`}
                        icon={faArrowRightLong} />
                </button>
            </div>
        </div>
    );
};

export default ReviewCarousel;