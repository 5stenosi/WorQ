'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faStar, faStarHalf, faPaperPlane, faWifi, faDesktop, faPen, faWheelchair, faPrint, faVideo, faUtensils, faChild, faDog, faChalkboard, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';
import CalendarComponent from '@/components/CalendarComponent';
import Carousel from '@/components/Carousel';

const SpazioNelDettaglio = () => {
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [dailyPrice, setDailyPrice] = useState(50);

    const images = [
        '/spaceTypes/offices/office1-enhanced.png',
        '/spaceTypes/offices/office2-enhanced.png',
        '/spaceTypes/offices/office3.jpg',
        '/spaceTypes/offices/office4-enhanced.png',
        '/spaceTypes/offices/office5-enhanced.png',
        '/spaceTypes/offices/office7-enhanced.png',
        '/spaceTypes/offices/office8.jpg',
    ];

    const features: (keyof typeof featureIcons)[] = [
        'wifi',
        'desktop',
        'stationery',
        'disability access',
        'printer',
        'projector',
        'catering',
        'child-friendly',
        'pet-friendly',
        'white-board',
        'video conference',
        'scanner',
    ];

    const featureIcons = {
        'wifi': faWifi,
        'desktop': faDesktop,
        'stationery': faPen,
        'disability access': faWheelchair,
        'printer': faPrint,
        'projector': faVideo,
        'catering': faUtensils,
        'child-friendly': faChild,
        'pet-friendly': faDog,
        'white-board': faChalkboard,
        'video conference': faVideoCamera,
        'scanner': faPrint,
    };

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

    const calculateTotalPrice = () => {
        return selectedDates.size * dailyPrice;
    };

    return (
        <div id='spazioNelDettaglio' className={`overflow-y-auto px-10`}>
            <section className={`w-full h-screen pt-24 pb-3`}>
                {/* Space Wrapper */}
                <div className={`w-full h-full p-5 flex bg-stone-100 rounded-4xl gap-5`}>

                    {/* Left Section */}
                    <div className={`flex flex-col gap-5 h-full w-2/5`}>
                        {/* Carosello */}
                        <div className={`w-full rounded-2xl overflow-hidden h-3/5`}>
                            <Carousel images={images} autoPlay={true} autoPlayInterval={10000} buttonSize="size-12" dotSize="size-3" chevronSize='text-xl' />
                        </div>

                        {/* Review Section */}
                        <div id="commentsSection" className={`w-full flex flex-col overflow-hidden rounded-2xl bg-stone-100 border-1 border-stone-900/10 shadow-sm relative h-2/5`}>

                            <div className='w-full flex justify-between gap-2 overflow-hidden'>
                                {/* Reviews */}
                                <div className='w-full flex flex-col overflow-y-auto gap-2 pl-4 pt-4 h-full divide-y-1 divide-stone-900/10'>
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <div key={index} className='w-full flex flex-col gap-2 pb-1'>
                                            {/* Stars */}
                                            <div className='flex text-sm gap-1 text-yellow-400'>
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStarHalf} />
                                            </div>
                                            <p className='text-sm'> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        </div>
                                    ))}
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
                                                className={star <= (selectedRating) ? 'text-yellow-400' : 'text-stone-500'} />
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
                            <div className="relative h-full flex flex-col p-4 gap-5 overflow-y-auto rounded-2xl">
                                <div className="flex justify-between items-start">
                                    {/* Title and Location */}
                                    <div className="flex flex-col gap-2">
                                        <h1 className='font-bold text-4xl'>Oxford Artisan - Agency Name</h1>
                                        <p className='text-xl text-stone-500'>Location, Country</p>
                                    </div>
                                    {/* Media delle Reviews */}
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-1 text-2xl text-yellow-400">
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStarHalf} />
                                        </div>
                                    </div>
                                </div>
                                {/* Services/Features */}
                                <div className="flex flex-wrap gap-2">
                                    {/* SpaceType */}
                                    <button className='px-3 py-1 text-sm font-medium rounded-md bg-west-side-200 border-1 border-west-side-300 hover:border-west-side-900 text-west-side-900 transition duration-500 hover:duration-150 delay-250 hover:delay-0'>
                                        <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                        Common Area
                                    </button>
                                    {features.map((feature, index) => (
                                        <button
                                            key={index}
                                            className='px-3 py-1 text-sm rounded-full hover:bg-west-side-100 border-1 border-stone-900 hover:border-west-side-300 hover:text-west-side-900 transition duration-500 hover:duration-150 delay-250 hover:delay-0'>
                                            <FontAwesomeIcon icon={featureIcons[feature]} className="mr-1" />
                                            {feature}
                                        </button>
                                    ))}
                                </div>

                                {/* Recap */}
                                <div className='w-full mt-auto p-4 rounded-lg flex gap-5 border-1 border-stone-900/10 bg-stone-100 shadow-sm transition duration-500'>

                                    <div className='min-w-fit w-2/5'>
                                        <CalendarComponent
                                            onDateSelection={handleDateSelection} // Passiamo la funzione per aggiornare le date selezionate
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
                                                className="h-10 px-4 bg-west-side-500 hover:bg-west-side-600 text-stone-100 font-bold rounded-lg hover:scale-110 active:scale-90 transition-transform duration-150 ease-out">
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
};

export default SpazioNelDettaglio;