'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faArrowsUpDown, faStar, faStarHalf, faChevronLeft, faChevronRight, faPaperPlane, faWifi, faDesktop, faPen, faWheelchair, faPrint, faVideo, faUtensils, faChild, faDog, faChalkboard, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import CalendarComponent from '@/components/CalendarComponent';

const SpazioNelDettaglio = () => {
    const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
    const [isCommentsFullscreen, setIsCommentsFullscreen] = useState(false);

    const [isServicesExpanded, setIsServicesExpanded] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviewText, setReviewText] = useState('');

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

    const toggleCommentsSection = () => {
        if (isCommentsFullscreen) {
            setIsCommentsFullscreen(false); // Disattiva fullscreen se espandi
        }
        setIsCommentsExpanded(!isCommentsExpanded);
    };

    const toggleFullscreenComments = () => {
        if (isCommentsExpanded) {
            setIsCommentsExpanded(false); // Disattiva expanded se vai in fullscreen
        }
        setIsCommentsFullscreen(!isCommentsFullscreen);
    };

    const toggleServicesSection = () => {
        setIsServicesExpanded(!isServicesExpanded);
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div id='spazioNelDettaglio' className={`overflow-y-auto px-10`}>
            <section className={`w-full h-screen pt-24 pb-3`}>
                {/* Space */}
                <div className={`w-full h-full p-5 flex bg-stone-100 rounded-4xl transition-all duration-1000
                    ${isCommentsFullscreen ? 'gap-0' : 'gap-5'}`}>

                    {/* Left Section */}
                    <div className={`flex flex-col gap-5 h-full transition-all duration-1000
                            ${isCommentsFullscreen ? 'w-0 opacity-0' : 'w-2/5'}`}>
                        {/* Carosello */}
                        <div className={`w-full rounded-2xl border-stone-900/10 overflow-hidden transition-all duration-1000
                            ${isCommentsFullscreen ? '' : 'border-1 shadow-sm'}
                            ${isServicesExpanded ? 'h-2/5' : 'h-3/5'}`}>
                            <div className="relative w-full h-full flex overflow-hidden rounded-lg shadow-sm group">
                                <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                                    {images.map((image, index) => (
                                        <img key={index} src={image} alt={`Office ${index + 1}`}
                                            className="w-full object-cover object-center flex-shrink-0" />
                                    ))}
                                </div>
                                <button
                                    onClick={handlePrev}
                                    className="absolute size-12 left-5 inset-y-0 my-auto bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full
                                               -motion-translate-x-out-150 group-hover:-motion-translate-x-in-150">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute size-12 right-5 inset-y-0 my-auto bg-stone-900/25 hover:bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-full
                                               motion-translate-x-out-150 group-hover:motion-translate-x-in-150">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                                {/* Indicatori */}
                                <div className="absolute bottom-5 inset-x-0 mx-auto bg-stone-900/25 backdrop-blur-sm p-2 rounded-full flex gap-2 w-fit *:cursor-pointer
                                            motion-translate-y-out-[200%] group-hover:motion-translate-y-in-[200%] duration-500">
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
                        </div>

                        {/* Services/Features */}
                        <div className={`w-full p-2 flex flex-col gap-2 rounded-2xl bg-stone-100 border-stone-900/10 transition-all overflow-hidden duration-1000
                            ${isCommentsFullscreen ? '' : 'border-1 shadow-sm'}
                            ${isServicesExpanded ? 'h-3/5' : 'h-2/5'}`}>
                            <div className='flex justify-between items-center'>
                                {/* Title */}
                                <h1 className="text-2xl pl-2 font-medium text-stone-900">Services</h1>
                                {/* Expand View */}
                                <button onClick={toggleServicesSection} className={`aspect-square size-10 top-14 rounded-xl bg-stone-100 border-1 border-stone-900/10 shadow-sm transition
                                    ${isServicesExpanded ? 'bg-stone-900 text-stone-100' : 'hover:bg-stone-900 hover:text-stone-100'}`}>

                                    <FontAwesomeIcon icon={faArrowsUpDown} />
                                </button>
                            </div>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {features.map((feature, index) => (
                                    <button
                                        key={index}
                                        className='px-3 py-1 text-xs lg:text-sm rounded-full bg-stone-100 hover:bg-west-side-100 border-2 hover:border-west-side-300 hover:text-west-side-900 transition duration-500 hover:duration-150 delay-250 hover:delay-0'>
                                        <FontAwesomeIcon icon={featureIcons[feature]} className="mr-2" />
                                        {feature}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className={`flex flex-col h-full transition-all duration-1000
                        ${isCommentsFullscreen ? 'w-full gap-0' : 'gap-5 w-3/5'}`}>

                        {/* Info & Reservation */}
                        <div id="infoSection" className={`w-full flex flex-col rounded-2xl overflow-hidden border-stone-900/10 transition-all duration-1000
                            ${isCommentsFullscreen ? 'h-0 opacity-0' : isCommentsExpanded ? 'h-2/5 border-1 shadow-sm' : 'h-3/5 border-1 shadow-sm'}`}>

                            <div className='h-full flex flex-col p-4'>

                                <div className='w-full flex justify-between items-center'>
                                    <h1 className='font-bold text-4xl'>Oxford Artisan</h1>
                                    <div className="flex gap-1 text-2xl text-yellow-400">
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStar} />
                                        <FontAwesomeIcon icon={faStarHalf} />
                                    </div>
                                </div>
                                <p className='text-xl text-stone-500'>Location, Country</p>

                                <CalendarComponent />

                                <p className='ml-auto mt-auto flex font-bold text-4xl'>120€<span className='text-base align-super'>/day</span></p>
                            </div>
                        </div>

                        {/* Review Section */}
                        <div id="commentsSection" className={`w-full flex flex-col overflow-hidden rounded-2xl bg-stone-100 border-1 border-stone-900/10 shadow-sm relative transition-all duration-1000
                            ${isCommentsFullscreen ? 'h-full' : isCommentsExpanded ? 'w-full h-3/5' : 'w-full h-2/5'}`}>

                            <div className='w-full flex justify-between gap-2 overflow-hidden'>
                                {/* Reviews */}
                                <div className='w-full flex flex-col overflow-y-auto gap-2 pl-4 pt-4 h-full no-scrollbar divide-y-1 divide-stone-900/10'>
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <div key={index} className='w-full flex flex-col gap-2 pb-1'>
                                            {/* Stars */}
                                            <div className='flex gap-1 text-yellow-400'>
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStarHalf} />
                                            </div>
                                            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Buttons */}
                                <div className='flex flex-col gap-2 pt-2 pr-2 h-auto'>
                                    {/* Fullscreen View */}
                                    <button onClick={toggleFullscreenComments} className={`aspect-square size-10 top-2 right-2 rounded-xl bg-stone-100 border-1 border-stone-900/10 shadow-sm transition
                                        ${isCommentsFullscreen ? "bg-stone-900 text-stone-100" : "hover:bg-stone-900 hover:text-stone-100"}`}>
                                        <FontAwesomeIcon icon={faExpand} />
                                    </button>

                                    {/* Expand View */}
                                    <button onClick={toggleCommentsSection} className={`aspect-square size-10 top-14 rounded-xl bg-stone-100 border-1 border-stone-900/10 shadow-sm transition
                                        ${isCommentsExpanded ? 'bg-stone-900 text-stone-100' : 'hover:bg-stone-900 hover:text-stone-100'}`}>
                                        <FontAwesomeIcon icon={faArrowsUpDown} />
                                    </button>
                                </div>
                            </div>

                            {/* Write Review */}
                            <div className='flex gap-2 p-2'>
                                <input type="text" id='write-comment' placeholder="Scrivi una recensione..." onChange={(e) => setReviewText(e.target.value)}
                                    className={`w-full p-2 rounded-xl hover:border-west-side-500 focus:border-west-side-500 shadow-sm outline-0 transition
                                        ${reviewText ? 'border-west-side-500 border-2' : 'border-1'}`} />
                                <button className='aspect-square size-10 rounded-xl bg-stone-100 border-1 border-stone-900/10 shadow-sm hover:bg-west-side-500 hover:text-stone-100'>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default SpazioNelDettaglio;