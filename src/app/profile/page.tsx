'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowUpRightFromSquare, faTrashCan, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import CreateSpaceModal from '@/components/CreateSpaceModal';

export default function Profile() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [userRole, setUserRole] = useState("");
    const [client, setClient] = useState({
        name: 'Name',
        surname: 'Surname',
        cellphone: 'Cellphone',
        bookings: [],
    });
    const [agency, setAgency] = useState({
        userId: '',
        name: 'Agency Name',
        vatNumber: 'VAT Number',
        telephone: 'Telephone',
        spaces: [],
    });

    // Fetch user data from the API
    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();
            setUserEmail(data.email);
            setUserRole(data.role);
            if (data.role === "CLIENT") {
                setClient(data.client);
            }
            else if (data.role === 'AGENCY') {
                setAgency(data.agency);
            }
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleBookingDelete = async (bookingId: string) => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete booking');
            }
            // Optionally, refresh the bookings after deletion
            fetchUserData();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    }

    const handleSpaceDelete = async (spaceId: string) => {
        try {
            const response = await fetch(`/api/spaces/${spaceId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete space');
            }
            // Optionally, refresh the spaces after deletion
            fetchUserData();
        } catch (error) {
            console.error('Error deleting space:', error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    if (isLoading) return (
        <div className="h-screen text-6xl flex justify-center items-center text-stone-600">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        </div>
    );

    // Render different content based on user role
    if (userRole === 'CLIENT' && client) {
        return (
            <div id='profile' className={`px-5 sm:px-10 md:px-15 lg:px-20`}>
                <section className={`w-full min-h-screen  lg:h-screen pt-28 pb-3`}>
                    {/* Profile Wrapper */}
                    <div className={`w-full h-full p-5 flex flex-col lg:flex-row bg-stone-100 rounded-4xl gap-5`}>

                        {/* Left Section */}
                        <div className={`p-3 sm:p-5 xl:p-8 h-full flex flex-col sm:flex-row lg:flex-col gap-5 rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
                                    w-full lg:w-1/5`}>
                            {/* Profile Information */}
                            <div className="w-full aspect-square max-w-[120px] lg:max-w-full rounded-lg border-8 border-stone-300 flex items-center justify-center lg:mx-auto">
                                <FontAwesomeIcon icon={faUser} className="text-stone-600 w-2/3 h-2/3 text-[5rem] lg:text-[8rem]" />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <h1 className="text-3xl lg:text-2xl xl:text-3xl font-bold text-stone-800"> {client?.name} {client?.surname} </h1>
                                <p className="text-lg lg:text-base xl:text-lg text-stone-600">{userEmail}</p>
                                <p className="text-lg lg:text-base xl:text-lg text-stone-600">{client?.cellphone}</p>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className={`gap-5 h-full rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
                                    w-full lg:w-4/5`}>
                            <div className="grid gap-4 p-4 h-full lg:h-full lg:overflow-y-scroll
                                        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">

                                {client.bookings && client.bookings.length > 0 ? (
                                    client.bookings?.map((booking: any, index: number) => (
                                        <div
                                            key={index} // Add a unique key for each child
                                            className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5 h-fit">
                                            <div>
                                                <h2 className="text-xl font-semibold text-stone-800">{booking.space.name}</h2>
                                                <p className="text-sm text-stone-600">{booking?.space.address.city}, {booking?.space.address.country}</p>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <div className='aspect-square w-full h-8 flex justify-center items-center rounded-sm font-bold text-sm md:text-xs lg:text-sm text-center overflow-hidden bg-west-side-200 border-1 border-west-side-300 text-west-side-900'>
                                                    {new Date(booking.bookingDate).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </div>

                                                <div className='flex gap-2 items-end'>
                                                    <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
                                                                text-sm xl:text-base"
                                                        onClick={() => handleBookingDelete(booking.id)}>
                                                        <FontAwesomeIcon icon={faTrashCan} />
                                                    </button>
                                                    <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
                                                                text-sm xl:text-base"
                                                        onClick={() => window.open(`/spaces/${booking.space.id}`, '_blank')}>
                                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-600">
                                        <p className="text-xl">No bookings found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section >
            </div >
        );
    }
    else if (userRole === 'AGENCY' && agency) {
        return (
            <div id='profile' className={`px-5 sm:px-10 md:px-15 lg:px-20`}>
                <section className={`w-full min-h-screen  lg:h-screen pt-28 pb-3`}>
                    {/* Profile Wrapper */}
                    <div className={`w-full h-full p-5 flex flex-col lg:flex-row bg-stone-100 rounded-4xl gap-5`}>

                        {/* Left Section */}
                        <div className={`p-3 sm:p-5 xl:p-8 h-full flex flex-col sm:flex-row lg:flex-col gap-5 rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
                                    w-full lg:w-1/5`}>
                            {/* Profile Information */}
                            <div className="w-full aspect-square max-w-[120px] lg:max-w-full rounded-lg border-8 border-stone-300 flex items-center justify-center lg:mx-auto">
                                <FontAwesomeIcon icon={faUser} className="text-stone-600 w-2/3 h-2/3 text-[5rem] lg:text-[8rem]" />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <h1 className="text-3xl lg:text-2xl xl:text-3xl font-bold text-stone-800"> {agency?.name}</h1>
                                <p className="text-lg lg:text-base xl:text-lg text-stone-600">{userEmail}</p>
                                <p className="text-lg lg:text-base xl:text-lg text-stone-600">{agency?.vatNumber} {agency?.telephone}</p>
                            </div>

                            {/* Publish Space Button */}
                            <button
                                onClick={() => setModalOpen(true)}
                                className='mt-auto ml-auto flex justify-end items-center rounded-xl bg-west-side-500 text-stone-100 transition-all duration-150
                                           w-12 hover:w-44 active:w-44 ease-out active:scale-90 hover:scale-110 origin-right delay-1000 hover:delay-0 active:delay-0'>
                                <p className='whitespace-nowrap text-xl text-right w-full'>Publish space</p>
                                <div className='aspect-square bg-west-side-500 size-12 text-2xl rounded-xl flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                            </button>
                        </div>

                        {/* Right Section */}
                        <div className={`gap-5 h-full rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
                                    w-full lg:w-4/5`}>
                            <div className="grid gap-4 p-4 h-full lg:h-full lg:overflow-y-scroll
                                        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {agency.spaces && agency.spaces.length > 0 ? (
                                    agency.spaces?.map((space: any, index: number) => (
                                        <div
                                            key={index} // Add a unique key for each child
                                            className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5 h-fit">
                                            <div>
                                                <h2 className="text-xl font-semibold text-stone-800">{space.name}</h2>
                                                <p className="text-sm text-stone-600">{space.address.city}, {space.address.country}</p>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <div className='flex gap-2 items-end'>
                                                    <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
                                                                text-sm xl:text-base"
                                                            onClick={() => handleSpaceDelete(space.id)}>
                                                        <FontAwesomeIcon icon={faTrashCan} />
                                                    </button>
                                                    <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
                                                                text-sm xl:text-base"
                                                        onClick={() => window.open(`/spaces/${space.id}`, '_blank')}>
                                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-600">
                                        <p className="text-xl">No spaces found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section >

                {/* Modal */}
                <CreateSpaceModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmitComplete={async (status) => {
                        if (status === 201)
                            console.log('Space created successfully!');
                            await fetchUserData(); // Refresh spaces after successful submission
                        setModalOpen(false);
                    }}
                    userId={agency.userId}
                />

            </div >
        );
    }

}