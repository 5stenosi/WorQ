'use client';

import { useEffect, useState, use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, findIconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';
import { faStar, faStarHalfStroke, faPaperPlane, faBuilding, faWifi, faPen, faPrint, faChalkboard, faDesktop, faVideo, faWheelchair, faSnowflake, faCoffee, faUtensils, faVideoCamera, faKitchenSet, faChild, faDog, faParking, faLock, faBolt, faVolumeXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';
import CalendarComponent from '@/components/CalendarComponent';
import Carousel from '@/components/Carousel';

library.add(
    faWifi, faPen, faPrint, faChalkboard, faDesktop, faVideo,
    faWheelchair, faSnowflake, faVolumeXmark, faCoffee, faUtensils,
    faVideoCamera, faKitchenSet, faChild, faDog, faParking, faLock, faBolt
);

type Space = {
    id: string;
    name: string;
    description: string;
    seats: number;
    isFullSpaceBooking: boolean;
    typology: 'MEETING_ROOMS' | 'PRIVATE_OFFICES' | 'COMMON_AREAS' | 'OUTDOOR_SPACES';
    price: number;
    images?: string[];
    avgRating?: number;
    address?: {
        street: string;
        number: string;
        city: string;
        zip: string;
        country: string;
        latitude: number;
        longitude: number;
    };
    services?: { id: number; detail: string; iconName: IconName }[];
    bookings?: { id: number; date: string }[];
    reviews?: { id: number; rating: number; comment: string }[];
};

export default function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [space, setSpace] = useState<Space | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    const placeholderImages = [
        '/placeholder-image.jpg'
    ];

    // Funzione per formattare il testo
    const formatTypology = (typology: string) => {
        return typology
            .toLowerCase()
            .replace(/_/g, ' ') // Sostituisce gli underscore con spazi
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizza ogni parola
    };

    useEffect(() => {
        async function fetchSpace() {
            try {
                setLoading(true);
                const res = await fetch(`/api/spaces/${id}`);
                if (!res.ok) {
                    setSpace(null);
                    return;
                }
                const data = await res.json();
                setSpace(data);
            } catch (err) {
                console.error("Errore nella fetch GET:", err);
                setSpace(null);
            } finally {
                setLoading(false);
            }
        }

        fetchSpace();
    }, [id]);

    const handleDateSelection = (dates: Set<string>) => {
        const formattedDates = new Set(
            Array.from(dates).map((date) => {
                const [year, month, day] = date.split('-'); // Assuming the date is in YYYY-MM-DD format
                return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`; // Convert to DD/MM/YYYY with leading zeros
            })
        );

        // Aggiorna lo stato solo se le date sono cambiate
        if (JSON.stringify(Array.from(formattedDates)) !== JSON.stringify(Array.from(selectedDates))) {
            setSelectedDates(formattedDates);
        }
    };

    if (loading) return (<div className="h-screen text-6xl flex justify-center items-center text-stone-600">
        <FontAwesomeIcon icon={faSpinner} className='animate-spin' />
    </div>);
    if (!space) return (<p className="h-screen text-2xl flex justify-center items-center text-stone-600">
        Space not found. Please check the ID or try again later.
    </p>);

    return (
        <div id='spazioNelDettaglio' className={`overflow-y-auto px-10`}>
            <section className={`w-full h-screen pt-28 pb-3`}>
                {/* Space Wrapper */}
                <div className={`w-full h-full p-5 flex bg-stone-100 rounded-4xl gap-5`}>

                    {/* Left Section */}
                    <div className={`flex flex-col gap-5 h-full w-2/5`}>
                        {/* Carosello */}
                        <div className={`w-full rounded-2xl overflow-hidden h-3/5 shadow-sm`}>
                            <Carousel images={space.images || placeholderImages} autoPlay={true} autoPlayInterval={10000} buttonSize="size-12" dotSize="size-3" chevronSize='text-xl' />
                        </div>

                        {/* Review Section */}
                        <div id="commentsSection" className={`w-full flex flex-col justify-between overflow-hidden rounded-2xl bg-stone-100 border-1 border-stone-900/10 shadow-sm relative h-2/5`}>

                            <div className='w-full flex justify-between gap-2 overflow-hidden'>
                                {/* Reviews */}
                                <div className='w-full flex flex-col overflow-y-auto gap-2 pl-4 pt-4 h-full divide-y-1 divide-stone-900/10'>
                                    {space.reviews && space.reviews.length > 0 ? (
                                        space.reviews.map((review) => (
                                            <div key={review.id} className='w-full flex flex-col gap-2 pb-1'>
                                                {/* Stars */}
                                                <div className='flex text-sm text-yellow-400'>
                                                    {Array.from({ length: 5 }).map((_, index) => {
                                                        const starValue = index + 1;
                                                        if (review.rating >= starValue) {
                                                            return <FontAwesomeIcon key={index} icon={faStar} />;
                                                        } else if (review.rating >= starValue - 0.5) {
                                                            return <FontAwesomeIcon key={index} icon={faStarHalfStroke} />;
                                                        } else {
                                                            return <FontAwesomeIcon key={index} icon={faHollowStar} />;
                                                        }
                                                    })}
                                                </div>
                                                <p className='text-sm'>{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-sm text-stone-600'>No reviews available.</p>
                                    )}
                                </div>
                            </div>

                            {/* Write Review */}
                            <div className='flex justify-between gap-2 p-2'>
                                <input type="text" id='write-comment' placeholder="Write a review..." onChange={(e) => setReviewText(e.target.value)}
                                    className={`w-full p-2 rounded-xl hover:ring-west-side-500 focus:ring-west-side-500 shadow-sm outline-0 transition
                                        ${reviewText ? 'ring-west-side-500 ring-2' : 'ring-1'}`} />

                                <div className='flex items-center h-10 text-xl rounded-xl bg-stone-100 ring-1 ring-stone-900/10 shadow-sm px-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setSelectedRating(star)}
                                            className='cursor-pointer transition-transform duration-150 ease-out active:scale-90 hover:scale-110'>
                                            <FontAwesomeIcon
                                                icon={star <= (hoverRating || selectedRating) ? faStar : faHollowStar}
                                                className={star <= (selectedRating) ? 'text-yellow-400' : 'text-stone-600'} />
                                        </span>
                                    ))}
                                </div>

                                <button className='aspect-square size-10 rounded-xl bg-stone-900 text-stone-100 hover:bg-west-side-500 hover:text-stone-100 hover:scale-110 active:scale-90 transition-transform duration-150 ease-out'>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className={`flex flex-col h-full gap-5 w-3/5`}>

                        {/* Info & Reservation */}
                        <div id="infoSection" className={`w-full flex flex-col rounded-2xl border-stone-900/10 h-full border-1 shadow-sm overflow-hidden`}>
                            <div className="relative h-full flex flex-col p-4 gap-2 overflow-y-auto rounded-2xl">
                                <div className="flex justify-between items-start">
                                    {/* Title and Location */}
                                    <div className="flex flex-col gap-2">
                                        <h1 className='font-bold text-4xl'>{space.name}</h1>
                                        <p className='text-lg text-stone-600'>{space.address?.street}, {space.address?.number} - {space.address?.city}, {space.address?.country}</p>
                                    </div>
                                    {/* Media delle Reviews */}
                                    <div className='flex text-2xl text-yellow-400'>
                                        {Array.from({ length: 5 }).map((_, index) => {
                                            const starValue = index + 1;
                                            if (space.avgRating && space.avgRating >= starValue) {
                                                return <FontAwesomeIcon key={index} icon={faStar} />;
                                            } else if (space.avgRating && space.avgRating >= starValue - 0.5) {
                                                return <FontAwesomeIcon key={index} icon={faStarHalfStroke} />;
                                            } else {
                                                return <FontAwesomeIcon key={index} icon={faHollowStar} />;
                                            }
                                        })}
                                    </div>
                                </div>

                                <div className='w-full h-full flex gap-x-5 overflow-hidden'>
                                    {/* Description */}
                                    <p className="w-1/2 text-sm overflow-y-auto">{space.description}</p>

                                    {/* Services */}
                                    <div className="w-1/2 flex flex-wrap gap-2 overflow-y-auto">
                                        {/* SpaceType */}
                                        <button className='px-3 py-1 max-h-10 text-sm font-medium rounded-md bg-west-side-200 border-1 border-west-side-300 hover:border-west-side-900 text-west-side-900 transition duration-500 hover:duration-150 delay-250 hover:delay-0'>
                                            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                            {formatTypology(space.typology)}
                                        </button>
                                        {space.services?.map((service, index) => {
                                            const iconDefinition = findIconDefinition({ iconName: service.iconName, prefix: 'fas' });
                                            return (
                                                <button
                                                    key={index}
                                                    className='px-3 py-1 max-h-10 text-sm rounded-full hover:bg-west-side-100 border-1 border-stone-900 hover:border-west-side-300 hover:text-west-side-900 transition duration-500 hover:duration-150 delay-250 hover:delay-0'>
                                                    <FontAwesomeIcon icon={iconDefinition} className="mr-1" />
                                                    {service.detail}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recap */}
                                <div className='w-full h-fit mt-auto p-4 rounded-lg flex gap-5 border-1 border-stone-900/10 bg-stone-100 shadow-sm transition duration-500'>
                                    <div className='min-w-fit w-2/5'>
                                        <CalendarComponent
                                            onDateSelection={handleDateSelection}
                                            spaceId="2" // Pass the space ID dynamically if needed
                                        />
                                    </div>

                                    <div className='w-full flex flex-col gap-2 relative'>
                                        <div className='flex justify-between'>
                                            <div>
                                                <p className="text-lg">
                                                    <strong>Selected days</strong>
                                                </p>
                                                <ul className="list-disc pl-5 overflow-y-auto">
                                                    {Array.from(selectedDates).map((date) => (
                                                        <li key={date}>
                                                            {date}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <button
                                                className="h-10 px-4 border-2 border-west-side-500 hover:bg-west-side-500 text-west-side-500 hover:text-stone-100 font-bold rounded-lg hover:scale-110 active:scale-90 transition-transform duration-150 ease-out">
                                                Book now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}