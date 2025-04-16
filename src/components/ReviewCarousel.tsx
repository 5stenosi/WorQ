import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faArrowLeftLong, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

// Definiamo i tipi
type Review = {
    name: string;
    text: string;
};

type Spacer = {
    id: string;
    isSpacer: true;
    width: string;
};

type ReviewItem = {
    id: string;
    isSpacer: false;
    width: string;
} & Review;

type CarouselItem = Spacer | ReviewItem;

const reviews = Array.from({ length: 10 }, (_, i) => ({
    name: `Reviewer ${i + 1}`,
    text: `This is a sample review text for reviewer ${i + 1}. The coworking space is amazing!`,
}));

const ReviewCarousel = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [centeredReviewIndex, setCenteredReviewIndex] = useState<number | null>(null);
    const [leftArrowClicked, setLeftArrowClicked] = useState(false);
    const [rightArrowClicked, setRightArrowClicked] = useState(false);

    // Dimensions
    const reviewWidth = 500; // Width of a review in px
    const gap = 20; // Gap between reviews in px

    // Add virtual padding with invisible elements
    const paddedReviews: CarouselItem[] = [
        { id: 'start-spacer', isSpacer: true, width: `calc(50% - ${reviewWidth / 2}px)` },
        ...reviews.map((review, index) => ({
            ...review,
            id: `review-${index}`,
            isSpacer: false,
            width: `${reviewWidth}px`
        })),
        { id: 'end-spacer', isSpacer: true, width: `calc(50% - ${reviewWidth / 2}px)` }
    ];

    const updateCenteredReview = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerWidth = container.clientWidth;
            const scrollPosition = container.scrollLeft + containerWidth / 2;

            // Calcola l'indice della recensione centrata
            const reviewElements = Array.from(container.querySelectorAll('[data-is-review="true"]'));
            let centeredIndex = null;

            for (let i = 0; i < reviewElements.length; i++) {
                const element = reviewElements[i] as HTMLElement;
                const elementLeft = element.offsetLeft;
                const elementRight = elementLeft + element.offsetWidth;

                if (scrollPosition >= elementLeft && scrollPosition <= elementRight) {
                    centeredIndex = parseInt(element.dataset.index || '0', 10);
                    break;
                }
            }

            setCenteredReviewIndex(centeredIndex);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current && centeredReviewIndex !== null && centeredReviewIndex > 0) {
            setLeftArrowClicked(true);
            const scrollAmount = reviewWidth + gap;
            scrollContainerRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(() => setLeftArrowClicked(false), 250); // Resetta dopo l'animazione
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current && centeredReviewIndex !== null && centeredReviewIndex < reviews.length - 1) {
            setRightArrowClicked(true);
            const scrollAmount = reviewWidth + gap;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(() => setRightArrowClicked(false), 250); // Resetta dopo l'animazione
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        const initialReviewNumber = Math.ceil(reviews.length / 2); // Numero della recensione iniziale (recensione centrale)
        const initialReviewIndex = initialReviewNumber - 1; // Convertiamo il numero in indice
        if (container) {
            const initialScrollPosition = (reviewWidth + gap) * initialReviewIndex;
            container.scrollTo({
                left: initialScrollPosition,
                behavior: 'auto',
            });
            // Aggiorna lo stato dopo un breve ritardo per permettere il rendering
            setTimeout(updateCenteredReview, 100);
        }

        if (container) {
            container.addEventListener('scroll', updateCenteredReview);
            return () => container.removeEventListener('scroll', updateCenteredReview);
        }
    }, []);

    const isAtStart = centeredReviewIndex === 0;
    const isAtEnd = centeredReviewIndex === reviews.length - 1;

    return (
        <div className="relative w-full">
            <div
                ref={scrollContainerRef}
                className="w-full overflow-x-scroll no-scrollbar snap-x snap-mandatory">
                <div className="flex gap-x-10">
                    {paddedReviews.map((item, index) => (
                        <div
                            key={item.id}
                            style={{ width: item.width }}
                            className={`flex-shrink-0 ${item.isSpacer ? '' : 'p-10 bg-stone-900 text-stone-100 rounded-4xl snap-center'}`}
                            data-is-review={!item.isSpacer}
                            data-index={!item.isSpacer ? index - 1 : undefined}>
                            {!item.isSpacer && (
                                <div className='flex flex-col gap-10'>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            {[...Array(5)].map((_, index) => (
                                                <FontAwesomeIcon
                                                    key={index}
                                                    icon={index < 4 ? faStar : faStarHalf}
                                                    className="text-yellow-400 mr-1" />
                                            ))}
                                        </div>
                                        <p className="text-lg italic mb-4">"{item.text}"</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <h3 className="text-xl font-bold">- {item.name}</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-5 gap-x-10">
                <button
                    onClick={scrollLeft}
                    disabled={isAtStart}
                    className={`p-8 text-2xl rounded-full aspect-square size-10 flex items-center justify-center transition-all duration-200 group ${isAtStart
                        ? 'text-stone-500 cursor-not-allowed'
                        : 'text-stone-800 hover:bg-stone-900 hover:text-stone-100'
                        }`}>
                    <FontAwesomeIcon
                        className={`transition-transform duration-250 ${leftArrowClicked ? '-translate-x-2' : ''
                            }`}
                        icon={faArrowLeftLong} />
                </button>
                <button
                    onClick={scrollRight}
                    disabled={isAtEnd}
                    className={`p-8 text-2xl rounded-full aspect-square size-10 flex items-center justify-center transition-all duration-200 group ${isAtEnd
                        ? 'text-stone-500 cursor-not-allowed'
                        : 'text-stone-800 hover:bg-stone-900 hover:text-stone-100'
                        }`}>
                    <FontAwesomeIcon
                        className={`transition-transform duration-250 ${rightArrowClicked ? 'translate-x-2' : ''
                            }`}
                        icon={faArrowRightLong} />
                </button>
            </div>
        </div>
    );
};

export default ReviewCarousel;