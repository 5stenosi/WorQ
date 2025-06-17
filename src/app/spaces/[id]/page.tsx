'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, findIconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';
import { faStar, faStarHalfStroke, faPaperPlane, faBuilding, faWifi, faPen, faPrint, faChalkboard, faDesktop, faVideo, faWheelchair, faSnowflake, faCoffee, faUtensils, faVideoCamera, faKitchenSet, faChild, faDog, faParking, faLock, faBolt, faVolumeXmark, faSpinner, faLongArrowAltDown, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
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
    // Function to remove a selected date from the list (acts on bookingDates)
    const handleRemoveSelectedDate = (date: string) => {
        // date is in DD/MM/YYYY format, bookingDates is in YYYY-MM-DD format
        const [day, month, year] = date.split('/');
        // Find the corresponding date in bookingDates, handling leading zeros
        let isoDate = '';
        for (const d of bookingDates) {
            const [y, m, dd] = d.split('-');
            if (
                y === year &&
                (m === month || m === month.padStart(2, '0') || m.padStart(2, '0') === month) &&
                (dd === day || dd === day.padStart(2, '0') || dd.padStart(2, '0') === day)
            ) {
                isoDate = d;
                break;
            }
        }
        if (isoDate) {
            const updatedBookingDates = new Set(bookingDates);
            updatedBookingDates.delete(isoDate);
            setBookingDates(updatedBookingDates);
        }
        // selectedDates will be updated automatically by handleDateSelection
    };
    // Extracting the space ID from the URL parameters
    const { id } = use(params);
    // Using NextAuth to get the session data
    const { data: session, status } = useSession();
    // State variables to manage space data, loading state, review text, hover rating, and booking dates
    const [space, setSpace] = useState<Space | null>(null); // Stores the space details
    const [loading, setLoading] = useState(true); // Loading state for data fetch
    const [reviewText, setReviewText] = useState(''); // Stores the review text input
    const [hoverRating, setHoverRating] = useState(0); // Stores the current hover rating for stars
    const [hasReviewed, setHasReviewed] = useState(false); // Tracks if the user has already reviewed
    const [selectedRating, setSelectedRating] = useState(0); // Stores the selected star rating
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set()); // Stores selected dates in DD/MM/YYYY
    const [bookingDates, setBookingDates] = useState<Set<string>>(new Set()); // Stores booking dates in YYYY-MM-DD
    const [userReview, setUserReview] = useState<{ id: string; rating: number; comment: string } | null>(null); // Stores the user's review if present

    // Placeholder images in case the space does not have any images
    const placeholderImages = [
        '/placeholder-image.jpg'
    ];

    // Function to format the typology string for display
    const formatTypology = (typology: string) => {
        return typology
            .toLowerCase()
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    };

    // Function to load space data and reviews from the API
    async function loadData() {
        try {
            const spaceRes = await fetch(`/api/spaces/${id}`);
            if (!spaceRes.ok) {
                setSpace(null);
                return;
            }
            const spaceData = await spaceRes.json();
            setSpace(spaceData);
            // Check if the user has already reviewed the space
            if (session?.user?.role === 'CLIENT' && spaceData.reviews) {
                const userReview = spaceData.reviews.find((review: any) => review.clientId === session.user.id);
                setUserReview(userReview || null);
            }
        } catch (error) {
            console.error("Error in GET fetch:", error);
            setSpace(null);
        } finally {
            setLoading(false);
        }
    }

    // Function to handle review submission
    const handleReviewSubmit = async () => {
        if (selectedRating === 0) {
            toast.error("Please select a rating before submitting your review.");
            return;
        } else if (reviewText.trim() === '') {
            toast.error("Please write a comment before submitting your review.");
            return;
        }
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    spaceId: space?.id,
                    clientId: session?.user.id,
                    rating: selectedRating,
                    comment: reviewText,
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to submit review');
            }
            await loadData();
            setReviewText('');
            setSelectedRating(0);
            toast.success("Review submitted");
        } catch (error) {
            console.error("Error in POST fetch:", error);
            toast.error("An error occurred while submitting your review. Please try again later.");
        }
    }

    // Function to handle booking submission
    const handleBooking = async () => {
        if (selectedDates.size === 0) {
            toast.error("Please select at least one date to book.");
            return;
        }
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingDates: Array.from(bookingDates),
                    spaceId: space?.id,
                    clientId: session?.user.id,
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to book space');
            }
            // Reset selected dates after booking
            setSelectedDates(new Set());
            toast.success("Booking successful!");
        }
        catch (error) {
            console.error("Error in POST fetch for booking:", error);
            toast.error("An error occurred while booking the space. Please try again later.");
        }
    }

    // Function to handle date selection from the calendar component
    const handleDateSelection = (dates: Set<string>) => {
        // Save the selected dates to state
        setBookingDates(dates);
        // Format the dates to DD/MM/YYYY
        const formattedDates = new Set(
            Array.from(dates).map((date) => {
                const [year, month, day] = date.split('-'); // Assuming the date is in YYYY-MM-DD format
                return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`; // Convert to DD/MM/YYYY with leading zeros
            })
        );
        // Update state only if dates have changed
        if (JSON.stringify(Array.from(formattedDates)) !== JSON.stringify(Array.from(selectedDates))) {
            setSelectedDates(formattedDates);
        }
    };

    // Function to scroll to the booking section
    const handleScrollToBooking = () => {
        if (typeof window !== "undefined") {
            const targetId = "booking-section";
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const isSmallScreen = window.innerWidth < 640; // sm breakpoint in Tailwind
                if (isSmallScreen) {
                    // Scroll to top of element, then offset by 100px
                    const rect = targetElement.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const top = rect.top + scrollTop - 120;
                    window.scrollTo({ top, behavior: "smooth" });
                } else {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "end" });
                }
            }
        }
    };

    // Load data when the component mounts or when id/status changes
    useEffect(() => {
        if (status === 'loading') return; // Wait for session to load
        loadData();
    }, [id, status]);

    // Show loading spinner while data is being fetched
    if (loading) return (<div className="h-screen text-6xl flex justify-center items-center text-stone-600">
        <FontAwesomeIcon icon={faSpinner} className='animate-spin' />
    </div>);
    // Show error message if space is not found
    if (!space) return (<p className="h-screen text-2xl flex justify-center items-center text-stone-600">
        Space not found. Please check the ID or try again later.
    </p>);

    // Function to delete the user's review
    const handleDeleteReview = async () => {
        try {
            const res = await fetch(`/api/reviews/${userReview?.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete review');
            }
            await loadData();
            toast.success('Review deleted');
        } catch (error) {
            toast.error('An error occurred while deleting your review. Please try again later.');
        }
    };

    return (
        <div id='spazioNelDettaglio' className={`px-5 sm:px-10 md:px-15 lg:px-20`}>
            <section className={`w-full min-h-screen flex flex-col gap-5 pt-28`}>
                {/* Space Wrapper */}
                <div className={`w-full xl:min-h-[81vh] grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-5 gap-5`}>

                    {/* Carousel */}
                    <div className={`col-span-1 row-span-3 w-full h-full min-h-36 sm:min-h-56 md:min-h-72 rounded-2xl overflow-hidden shadow-sm`}>
                        <Carousel images={space.images || placeholderImages} autoPlay={true} autoPlayInterval={10000} buttonSize="size-12" dotSize="size-3" chevronSize='text-xl' />
                    </div>

                    {/* Info Section */}
                    <div className="col-span-1 row-span-5 w-full h-full flex flex-col justify-between gap-5 p-5 rounded-2xl bg-stone-100 border-stone-900/10 border-1 shadow-sm relative">
                        <div className='flex flex-col gap-5'>
                            {/* Title + Location + Media delle Reviews */}
                            <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-start">
                                {/* Title and Location */}
                                <div className="flex flex-col gap-2">
                                    <h1 className='font-bold text-2xl sm:text-4xl'>{space.name}</h1>
                                    <p className='text-sm sm:text-lg text-stone-600'>
                                        {space.address?.number != null ? `${space.address?.street}, ${space.address.number} - ` : `${space.address?.street} - `}
                                        {space.address?.city}, {space.address?.country}
                                    </p>
                                </div>
                                {/* Media delle Reviews */}
                                <div className='flex text-lg sm:text-2xl text-yellow-400'>
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
                            {/* Services */}
                            <div className="flex flex-wrap gap-2">
                                {/* SpaceType */}
                                <div className='flex justify-center items-center px-3 py-1 max-h-10 text-xs sm:text-sm font-medium rounded-md bg-west-side-200 border-1 border-west-side-300 hover:border-west-side-900 text-west-side-900 transition duration-500 hover:duration-150 delay-250 hover:delay-0'>
                                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                    {formatTypology(space.typology)}
                                </div>
                                {space.services?.map((service, index) => {
                                    const iconDefinition = findIconDefinition({ iconName: service.iconName, prefix: 'fas' });
                                    return (
                                        <div
                                            key={index}
                                            className='h-fit flex items-center gap-1 px-2 py-1 max-h-10 text-xs sm:text-sm rounded-full hover:bg-west-side-100 border-1 border-stone-900 hover:border-west-side-300 hover:text-west-side-900 transition duration-500 hover:duration-150 delay-250 hover:delay-0'>
                                            <FontAwesomeIcon icon={iconDefinition} />
                                            {service.detail}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Description */}
                            <p className='text-xs sm:text-base'>{space.description}</p>
                        </div>
                        <div className='flex justify-between items-center gap-5'>
                            {/* To booking section */}
                            {session?.user.role === 'CLIENT' && (
                                <button type="button" onClick={handleScrollToBooking}
                                    className="flex justify-center items-center text-xs sm:text-base gap-1 origin-bottom-left h-12 px-4 border-2 border-west-side-500 hover:bg-west-side-500 active:bg-west-side-500 text-west-side-500 hover:text-stone-100 active:text-stone-100 font-bold rounded-lg hover:scale-110 active:scale-90 transition-all duration-150 ease-out overflow-hidden group">
                                    <span className="hidden sm:block -translate-y-8 group-hover:translate-y-0 group-active:translate-y-0 transition">
                                        <FontAwesomeIcon icon={faLongArrowAltDown} />
                                    </span>
                                    <p>Proceed to Booking</p>
                                    <span className="hidden sm:block -translate-y-8 group-hover:translate-y-0 group-active:translate-y-0 transition">
                                        <FontAwesomeIcon icon={faLongArrowAltDown} />
                                    </span>
                                </button>
                            )}
                            {/* Price */}
                            <p className='flex font-bold text-xl sm:text-3xl'>{space.price}€<span className='text-sm sm:text-lg align-super'>/day</span></p>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className={`col-span-1 row-span-2 w-full h-full max-h-60 flex flex-col justify-between rounded-2xl bg-stone-100 border-1 border-stone-900/10 shadow-sm relative`}>
                        <div className='w-full flex justify-between gap-2 overflow-hidden'>
                            {/* Reviews */}
                            <div className={`w-full flex flex-col gap-2 px-3 pt-3 ${userReview ? 'pb-3' : ''} h-full divide-y-1 divide-stone-900/10`}>

                                {/* Recensione dell'utente */}
                                {userReview && (
                                    <div className="w-full flex flex-col gap-2 pb-1">
                                        <div className="flex text-sm text-yellow-400">
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                const starValue = index + 1;
                                                if (userReview.rating >= starValue) {
                                                    return <FontAwesomeIcon key={index} icon={faStar} />;
                                                } else if (userReview.rating >= starValue - 0.5) {
                                                    return <FontAwesomeIcon key={index} icon={faStarHalfStroke} />;
                                                } else {
                                                    return <FontAwesomeIcon key={index} icon={faHollowStar} />;
                                                }
                                            })}
                                        </div>
                                        <p className="text-sm">{userReview.comment}</p>
                                        {session?.user && (
                                            <button
                                                className='absolute top-3 right-3 border-2 border-red-500 aspect-square h-8 hover:h-10 flex justify-center items-center rounded-lg text-red-500 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition-all'
                                                onClick={handleDeleteReview}
                                            >
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Other Reviews */}
                                <div className='w-full flex flex-col overflow-y-auto gap-2 h-full divide-y-1 divide-stone-900/10'>
                                    {space.reviews && space.reviews.length > 0 ? (
                                        space.reviews
                                            .filter((review: any) => review.clientId !== session?.user?.id)
                                            .map((review) => (
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
                                                    <p className='text-xs ms:text-sm'>{review.comment}</p>
                                                </div>
                                            ))
                                    ) : (
                                        <p className='text-xs sm:text-sm text-stone-600'>No reviews available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Write Review */}
                        {session?.user && session.user.role === "CLIENT" && !userReview && (
                            <form className='flex justify-between gap-2 p-2'
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleReviewSubmit();
                                }}>
                                <input
                                    type="text"
                                    id='write-comment'
                                    placeholder="Write a review..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className={`w-full p-2 text-xs sm:text-base rounded-xl hover:ring-west-side-500 focus:ring-west-side-500 shadow-sm outline-0 transition
                                            ${reviewText ? 'ring-west-side-500 ring-2' : 'ring-1'}`} />
                                <div className='flex items-center h-8 sm:h-10 sm:text-xl rounded-xl bg-stone-100 ring-1 ring-stone-900/10 shadow-sm px-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setSelectedRating(star)}
                                            className='cursor-pointer transition-transform duration-150 ease-out active:scale-90 hover:scale-110'>
                                            <FontAwesomeIcon icon={star <= (hoverRating || selectedRating) ? faStar : faHollowStar} className={star <= selectedRating ? 'text-yellow-400' : 'text-stone-600'} />
                                        </span>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className='aspect-square size-8 sm:size-10 rounded-xl text-stone-900 hover:bg-west-side-500 active:bg-west-side-500 hover:text-stone-100 active:text-stone-100 ring-1 ring-stone-900/10 shadow-sm hover:scale-110 active:scale-90 transition-all duration-150 ease-out'>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </form>
                        )}

                    </div>
                </div >

                {/* Booking Section */}
                {session?.user.role === 'CLIENT' && (
                    <div id='booking-section' className={`col-span-1 md:col-span-2 row-span-1 pb-5 w-full h-full`}>
                        <div className='rounded-2xl bg-stone-100 border-1 border-stone-900/10 shadow-sm relative'>
                            {/* Recap */}
                            <div className='w-full h-fit mt-auto p-5 rounded-lg flex flex-col sm:flex-row gap-10 transition duration-500'>
                                {/* Calendar */}
                                <div className='min-w-fit sm:w-2/5'>
                                    <CalendarComponent
                                        onDateSelection={handleDateSelection}
                                        selectedDates={bookingDates}
                                        setSelectedDates={setBookingDates}
                                        spaceId={space.id}
                                    />
                                </div>
                                {/* Recap Info */}
                                <div className='w-full flex flex-col justify-between gap-20 sm:gap-10'>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex justify-between items-center gap-5'>
                                            <h3 className='font-bold text-xl md:text-2xl lg:text-3xl text-center md:text-start w-full'>Selected days</h3>
                                            {/* Book now */}
                                            <button
                                                onClick={handleBooking}
                                                className={`
                                                shrink-0 origin-bottom-right h-12 px-6 border-2 bg-stone-100 border-west-side-500 hover:bg-west-side-500 active:bg-west-side-500 text-west-side-500 hover:text-stone-100 active:text-stone-100 font-bold rounded-lg hover:scale-110 active:scale-90 transition-all duration-150 ease-out
                                                fixed right-3 bottom-3 z-50
                                                md:static md:right-auto md:bottom-auto md:z-auto md:origin-top-right
                                            `}
                                            >
                                                Book now
                                            </button>
                                        </div>
                                        {selectedDates.size > 0 ? (
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                                {Array.from(selectedDates).map((date, idx) => {
                                                    const [day, month, year] = date.split('/');
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleRemoveSelectedDate(date)}
                                                            className="relative flex items-center justify-center px-3 py-1 max-h-10 text-sm font-medium rounded-md bg-west-side-200 border-1 border-west-side-300 text-west-side-900 min-w-[90px] transition duration-500 hover:duration-150 delay-250 hover:delay-0 hover:border-west-side-900 cursor-pointer group">
                                                            <span className="font-bold z-10 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-150">{`${day}/${month}/${year}`}</span>
                                                            <span className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-150 pointer-events-none
                                                                                    group-hover:motion-preset-shake group-hover:motion-duration-500 group-hover:motion-delay-100">
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-stone-500">No days selected.</span>
                                        )}
                                    </div>
                                    <div className="flex justify-evenly items-center w-full">
                                        {/* Normal Price */}
                                        <div className="flex flex-col items-center gap-2">
                                            <p className='text-sm md:text-lg'>Daily price</p>
                                            <p className="flex font-bold text-xl md:text-3xl">{space.price}€<span className="text-sm md:text-lg align-super">/day</span></p>
                                        </div>

                                        {/* Divider */}
                                        <div className="flex justify-center items-center h-16 px-4">
                                            <div className="border-l-1 border-r-1 border-stone-300 h-full"></div>
                                        </div>

                                        {/* Dynamic Price */}
                                        <div className="flex flex-col items-center gap-2">
                                            <p className='text-sm md:text-lg'>Total for {selectedDates.size === 1 ? '1 day' : `${selectedDates.size} days`}</p>
                                            <p className="flex font-bold text-xl md:text-3xl">{selectedDates.size > 0 ? space.price * selectedDates.size : 0}€</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }
            </section >
        </div >
    );
}