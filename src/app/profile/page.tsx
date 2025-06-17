'use client';

import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowUpRightFromSquare, faTrashCan, faUser, faSpinner, faUserPen, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import CreateSpaceModal from '@/components/CreateSpaceModal';
import EditSpaceModal from '@/components/EditSpaceModal';
import EditProfileModal from '@/components/EditProfileModal';
import Link from 'next/link';

export default function Profile() {
    // State variables for modals
    const [isCreateSpaceModalOpen, setCreateSpaceModalOpen] = useState(false); // Controls the visibility of the Create Space modal
    const [isEditSpaceModalOpen, setEditSpaceModalOpen] = useState(false); // Controls the visibility of the Edit Space modal
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false); // Controls the visibility of the Edit Profile modal
    // State variables for user data
    const [isLoading, setIsLoading] = useState(true); // Indicates if user data is being loaded
    const [selectedSpace, setSelectedSpace] = useState<string>(""); // Stores the ID of the selected space for editing
    const [userEmail, setUserEmail] = useState(""); // Stores the user's email
    const [userRole, setUserRole] = useState(""); // Stores the user's role (CLIENT or AGENCY)
    const [client, setClient] = useState({
        name: 'Name',
        surname: 'Surname',
        cellphone: 'Cellphone',
        bookings: [],
    }); // Stores client-specific data
    const [agency, setAgency] = useState({
        userId: '',
        name: 'Agency Name',
        vatNumber: 'VAT Number',
        telephone: 'Telephone',
        spaces: [],
    }); // Stores agency-specific data

    // Fetch user data from the API
    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch('/api/profile'); // Fetch profile data from the API
            const data = await response.json(); // Parse the response as JSON
            setUserEmail(data.email); // Set the user's email
            setUserRole(data.role); // Set the user's role
            if (data.role === "CLIENT") {
                setClient(data.client); // Set client data if user is a client
            }
            else if (data.role === 'AGENCY') {
                setAgency(data.agency); // Set agency data if user is an agency
            }
        }
        catch (error) {
            console.error('Error fetching user data:', error); // Log any errors
            return null;
        }
        finally {
            setIsLoading(false); // Set loading to false after fetching
        }
    }, []);

    // Handle booking deletion
    const handleBookingDelete = async (bookingId: string) => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE', // Send a DELETE request to remove the booking
            });
            if (!response.ok) {
                throw new Error('Failed to delete booking'); // Throw error if deletion fails
            }
            // Optionally, refresh the bookings after deletion
            await fetchUserData(); // Refresh user data after deletion
            toast.success('Booking deleted successfully!'); // Show success message
        } catch (error) {
            console.error('Error deleting booking:', error); // Log any errors
            toast.error('Failed to delete booking. Please try again.'); // Show error message
        }
    }

    // Handle space deletion
    const handleSpaceDelete = async (spaceId: string) => {
        try {
            const response = await fetch(`/api/spaces/${spaceId}`, {
                method: 'DELETE', // Send a DELETE request to remove the space
            });
            if (!response.ok) {
                throw new Error('Failed to delete space'); // Throw error if deletion fails
            }
            // Optionally, refresh the spaces after deletion
            await fetchUserData(); // Refresh user data after deletion
            toast.success('Space deleted successfully!'); // Show success message
        } catch (error) {
            console.error('Error deleting space:', error); // Log any errors
            toast.error('Failed to delete space. Please try again.'); // Show error message
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (isLoading) return (
        <div className="h-screen text-6xl flex justify-center items-center text-stone-600">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        </div>
    );

    // Lock scroll if any modal is open
    if (isCreateSpaceModalOpen || isEditProfileModalOpen || isEditSpaceModalOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }

    return (
        <div id='profile' className={`px-5 sm:px-10 md:px-15 lg:px-20`}>
            <section className={`w-full min-h-screen pt-28`}>
                {/* Profile Wrapper */}
                <div className={`w-full h-full flex flex-col gap-5`}>
                    {/* Top Section */}
                    <div className={`w-full h-full p-5 flex flex-col gap-5 rounded-2xl bg-stone-100 border-1 border-stone-900/10 shadow-sm overflow-hidden
                                    md:grid ${userRole === 'AGENCY' ? 'md:grid-cols-8 lg:grid-cols-9' : 'md:grid-cols-7'}`}>
                        {/* Column 1: Profile picture, name and surname */}
                        <div className="flex items-center col-span-2 md:col-span-3 lg:col-span-2 gap-3">
                            <div className="aspect-square w-24 h-24 rounded-lg border-8 border-stone-300 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="text-stone-600 w-2/3 h-2/3 text-[5rem]" />
                            </div>
                            <h1 className="text-2xl font-bold text-stone-800">
                                {userRole === 'AGENCY' ? agency.name : `${client?.name} ${client?.surname}`}
                            </h1>
                        </div>
                        {/* Columns 2 and 3: Email and Cellphone (stacked on md and up) */}
                        <div className={`flex flex-col sm:flex-row md:flex-col lg:flex-row col-span-4  ${userRole === 'AGENCY' ? 'md:col-span-4 lg:col-span-6' : 'md:col-span-3 lg:col-span-4'} gap-3 sm:gap-10 md:gap-3 lg:gap-0 justify-center items-center`}>
                            {/* Email */}
                            <div className="flex flex-col justify-center items-center gap-1 w-full">
                                <p className="text-sm font-bold w-full lg:w-auto">Email</p>
                                <p className="text-stone-600 break-all w-full lg:w-auto">{userEmail}</p>
                            </div>
                            <div className='flex w-full'>
                                {/* Cellphone / Telephone */}
                                <div className="flex flex-col justify-center items-center gap-1 w-full">
                                    <p className="text-sm font-bold w-full lg:w-auto">{userRole === 'AGENCY' ? "Telephone" : "Cellphone"}</p>
                                    <p className="text-stone-600 break-all w-full lg:w-auto">
                                        {userRole === 'AGENCY' ? agency.telephone : client?.cellphone}
                                    </p>
                                </div>
                                {/* VAT (only for AGENCY) */}
                                {userRole === 'AGENCY' && (
                                    <div className="flex flex-col justify-center items-center gap-1 w-full">
                                        <p className="text-sm font-bold w-full lg:w-auto">VAT</p>
                                        <p className="text-stone-600 break-all w-full lg:w-auto">{agency.vatNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Column 4: Empty */}
                        <div className={`flex md:flex-col items-end text-stone-100 ${userRole === 'AGENCY' ? 'justify-between' : 'justify-end'}`}>
                            {/* Edit Profile Button */}
                            <button onClick={() => setEditProfileModalOpen(true)}
                                className='flex justify-start md:justify-end items-center rounded-lg ring-2 ring-stone-900/10 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 text-stone-900 hover:text-stone-100 active:text-stone-100 shadow-sm transition-all duration-150 overflow-hidden
                                           w-10 hover:w-37 active:w-37 ease-out active:scale-90 hover:scale-110 origin-left md:origin-right group'>
                                <p className='order-2 md:order-1 whitespace-nowrap text-xl text-start md:text-end w-full opacity-0 group-hover:opacity-100 group-active:opacity-100
                                                duration-150'>Edit profile</p>
                                <div className='order-1 md:order-2 aspect-square bg-stone-100 group-hover:bg-stone-900 group-active:bg-stone-900 size-10 text-xl rounded-lg flex items-center justify-center
                                                duration-150'>
                                    <FontAwesomeIcon icon={faUserPen} />
                                </div>
                            </button>
                            {/* Publish Space Button (only for AGENCY) */}
                            {userRole === 'AGENCY' && (
                                <button onClick={() => setCreateSpaceModalOpen(true)}
                                    className='flex justify-end items-center rounded-lg ring-2 ring-west-side-500 bg-stone-100 hover:bg-west-side-500 active:bg-west-side-500 text-west-side-500 hover:text-stone-100 active:text-stone-100 shadow-sm transition-all duration-150 overflow-hidden
                                               w-10 hover:w-43 active:w-43 ease-out active:scale-90 hover:scale-110 origin-right group'>
                                    <p className='whitespace-nowrap text-xl text-end w-full opacity-0 group-hover:opacity-100 group-active:opacity-100
                                                    duration-150'>Publish space</p>
                                    <div className='aspect-square bg-stone-100 group-hover:bg-west-side-500 group-active:bg-west-side-500 size-10 text-2xl rounded-lg flex items-center justify-center
                                                    duration-150'>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className={`w-full h-full gap-5 rounded-2xl bg-stone-100 border-1 border-stone-900/10 shadow-sm overflow-hidden`}>
                        <div className="grid gap-4 p-5 h-full
                                        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                            {userRole === 'CLIENT' && client.bookings && client.bookings.length > 0 ? (
                                [...client.bookings]
                                    .sort((a: any, b: any) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
                                    .map((booking: any, index: number) => (
                                        <div
                                            key={index}
                                            className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5 h-fit">
                                            <div>
                                                <h2 className="text-xl font-semibold text-stone-800">{booking.space?.name}</h2>
                                                <p className="text-sm text-stone-600">{booking.space?.address?.city}, {booking.space?.address?.country}</p>
                                            </div>
                                            <div className={`flex gap-2 justify-between`}>
                                                <button className="aspect-square flex justify-center items-center size-8 text-sm border-1 border-stone-900/10 bg-stone-100 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition rounded-sm shadow-sm"
                                                    onClick={() => handleBookingDelete(booking.id)}>
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button>
                                                <div className='px-2 h-8 flex justify-center items-center rounded-sm font-bold text-center overflow-hidden bg-west-side-200 border-1 border-west-side-300 text-west-side-900'>
                                                    {new Date(booking.bookingDate).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <Link href={`/spaces/${booking.space.id}`}>
                                                    <button className="aspect-square flex justify-center items-center size-8 text-sm border-1 border-stone-900/10 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-sm shadow-sm">
                                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                            ) : userRole === 'AGENCY' && agency.spaces && agency.spaces.length > 0 ? (
                                agency.spaces.map((space: any, index: number) => (
                                    <div
                                        key={index}
                                        className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5 h-fit">
                                        <div>
                                            <h2 className="text-xl font-semibold text-stone-800">{space.name}</h2>
                                            <p className="text-sm text-stone-600">{space.address?.city}, {space.address?.country}</p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <button className="aspect-square flex justify-center items-center size-8 text-sm border-1 border-stone-900/10 bg-stone-100 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition rounded-sm shadow-sm"
                                                onClick={() => handleSpaceDelete(space.id)}>
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                            <div className='flex gap-2'>
                                                <button onClick={() => {
                                                    setEditSpaceModalOpen(true);
                                                    setSelectedSpace(space.id);
                                                }}
                                                    className="aspect-square flex justify-center items-center size-8 text-sm border-1 border-stone-900/10 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-sm shadow-sm">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                                <Link href={`/spaces/${space.id}`}>
                                                    <button className="aspect-square flex justify-center items-center size-8 text-sm border-1 border-stone-900/10 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-sm shadow-sm">
                                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-balance text-stone-600 col-span-full">
                                    {userRole === 'CLIENT' ? 'No bookings found.' : 'No spaces found.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div >
            </section >
            {/* Modals */}
            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setEditProfileModalOpen(false)}
                userData={userRole === 'CLIENT' ? client : agency} // Pass the appropriate user data based on role
                userRole={userRole}
                onSubmitComplete={async (status) => {
                    if (status === 200) {
                        await fetchUserData(); // Refresh user data after successful submission
                        toast.success('Profile updated successfully!');
                    } else
                        toast.error('Failed to update profile. Please try again.');
                    setEditProfileModalOpen(false);
                }}
            />
            <CreateSpaceModal
                isOpen={isCreateSpaceModalOpen}
                onClose={() => setCreateSpaceModalOpen(false)}
                userId={agency.userId}
                onSubmitComplete={async (status) => {
                    if (status === 201) {
                        await fetchUserData(); // Refresh spaces after successful submission
                        toast.success('Space created successfully!');
                    } else
                        toast.error('Failed to create space. Please try again.');
                    setCreateSpaceModalOpen(false);
                }}
            />
            <EditSpaceModal
                isOpen={isEditSpaceModalOpen}
                onClose={() => setEditSpaceModalOpen(false)}
                userId={agency.userId}
                spaceId={selectedSpace}
                onSubmitComplete={async (status) => {
                    if (status === 200) {
                        await fetchUserData(); // Refresh spaces after successful submission
                        toast.success('Space updated successfully!');
                    } else
                        toast.error('Failed to update space. Please try again.');
                    setEditSpaceModalOpen(false);
                }}
            />
        </div >
    );
};

// Render different content based on user role
//     if (userRole === 'CLIENT' && client) {
//         return (
//             <div id='profile' className={`px-5 sm:px-10 md:px-15 lg:px-20`}>
//                 <section className={`w-full min-h-screen  lg:h-screen pt-28 pb-3`}>
//                     {/* Profile Wrapper */}
//                     <div className={`w-full h-full p-5 flex flex-col lg:flex-row bg-stone-100 rounded-4xl gap-5`}>

//                         {/* Left Section */}
//                         <div className={`p-3 sm:p-5 xl:p-8 h-full flex flex-col sm:flex-row lg:flex-col gap-5 rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
//                                     w-full lg:w-1/5`}>
//                             {/* Profile Information */}
//                             <div className="w-full aspect-square max-w-[120px] lg:max-w-full rounded-lg border-8 border-stone-300 flex items-center justify-center lg:mx-auto">
//                                 <FontAwesomeIcon icon={faUser} className="text-stone-600 w-2/3 h-2/3 text-[5rem] lg:text-[8rem]" />
//                             </div>
//                             <div className='flex flex-col gap-3'>
//                                 <h1 className="text-3xl lg:text-2xl xl:text-3xl font-bold text-stone-800"> {client?.name} {client?.surname} </h1>
//                                 <p className="text-lg lg:text-base xl:text-lg text-stone-600">{userEmail}</p>
//                                 <p className="text-lg lg:text-base xl:text-lg text-stone-600">{client?.cellphone}</p>
//                             </div>
//                         </div>

//                         {/* Right Section */}
//                         <div className={`gap-5 h-full rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
//                                     w-full lg:w-4/5`}>
//                             <div className="grid gap-4 p-4 h-full lg:h-full lg:overflow-y-scroll
//                                         grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">

//                                 {client.bookings && client.bookings.length > 0 ? (
//                                     client.bookings?.map((booking: any, index: number) => (
//                                         <div
//                                             key={index} // Add a unique key for each child
//                                             className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5 h-fit">
//                                             <div>
//                                                 <h2 className="text-xl font-semibold text-stone-800">{booking.space.name}</h2>
//                                                 <p className="text-sm text-stone-600">{booking?.space.address.city}, {booking?.space.address.country}</p>
//                                             </div>
//                                             <div className="flex justify-between gap-4">
//                                                 <div className='aspect-square w-full h-8 flex justify-center items-center rounded-sm font-bold text-sm md:text-xs lg:text-sm text-center overflow-hidden bg-west-side-200 border-1 border-west-side-300 text-west-side-900'>
//                                                     {new Date(booking.bookingDate).toLocaleDateString('en-GB', {
//                                                         day: '2-digit',
//                                                         month: '2-digit',
//                                                         year: 'numeric'
//                                                     })}
//                                                 </div>

//                                                 <div className='flex gap-2 items-end'>
//                                                     <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
//                                                                 text-sm xl:text-base"
//                                                         onClick={() => handleBookingDelete(booking.id)}>
//                                                         <FontAwesomeIcon icon={faTrashCan} />
//                                                     </button>
//                                                     <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
//                                                                 text-sm xl:text-base"
//                                                         onClick={() => window.open(`/spaces/${booking.space.id}`, '_blank')}>
//                                                         <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center text-stone-600">
//                                         <p className="text-xl">No bookings found.</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </section >
//             </div >
//         );
//     }
//     else if (userRole === 'AGENCY' && agency) {
//         return (
//             <div id='profile' className={`px-5 sm:px-10 md:px-15 lg:px-20`}>
//                 <section className={`w-full min-h-screen  lg:h-screen pt-28 pb-3`}>
//                     {/* Profile Wrapper */}
//                     <div className={`w-full h-full p-5 flex flex-col bg-stone-100 rounded-4xl gap-5`}>

//                         {/* Left Section */}
//                         <div className={`p-3 sm:p-5 xl:p-8 h-full flex flex-col sm:flex-row lg:flex-col gap-5 rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
//                                     w-full lg:w-1/5`}>
//                             {/* Profile Information */}
//                             <div className="w-full aspect-square max-w-[120px] lg:max-w-full rounded-lg border-8 border-stone-300 flex items-center justify-center lg:mx-auto">
//                                 <FontAwesomeIcon icon={faUser} className="text-stone-600 w-2/3 h-2/3 text-[5rem] lg:text-[8rem]" />
//                             </div>
//                             <div className='flex flex-col gap-3'>
//                                 <h1 className="text-3xl lg:text-2xl xl:text-3xl font-bold text-stone-800"> {agency?.name}</h1>
//                                 <p className="text-lg lg:text-base xl:text-lg text-stone-600">{userEmail}</p>
//                                 <p className="text-lg lg:text-base xl:text-lg text-stone-600">{agency?.vatNumber} {agency?.telephone}</p>
//                             </div>

//                             {/* Publish Space Button */}
//                             <button
//                                 onClick={() => setModalOpen(true)}
//                                 className='mt-auto ml-auto flex justify-end items-center rounded-xl bg-west-side-500 text-stone-100 transition-all duration-150
//                                            w-12 hover:w-44 active:w-44 ease-out active:scale-90 hover:scale-110 origin-right delay-1000 hover:delay-0 active:delay-0'>
//                                 <p className='whitespace-nowrap text-xl text-right w-full'>Publish space</p>
//                                 <div className='aspect-square bg-west-side-500 size-12 text-2xl rounded-xl flex items-center justify-center'>
//                                     <FontAwesomeIcon icon={faPlus} />
//                                 </div>
//                             </button>
//                         </div>

//                         {/* Right Section */}
//                         <div className={`gap-5 h-full rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden
//                                     w-full lg:w-4/5`}>
//                             <div className="grid gap-4 p-4 h-full lg:h-full lg:overflow-y-scroll
//                                         grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
//                                 {agency.spaces && agency.spaces.length > 0 ? (
//                                     agency.spaces?.map((space: any, index: number) => (
//                                         <div
//                                             key={index} // Add a unique key for each child
//                                             className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5 h-fit">
//                                             <div>
//                                                 <h2 className="text-xl font-semibold text-stone-800">{space.name}</h2>
//                                                 <p className="text-sm text-stone-600">{space.address.city}, {space.address.country}</p>
//                                             </div>
//                                             <div className="flex justify-between gap-4">
//                                                 <div className='flex gap-2 items-end'>
//                                                     <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
//                                                                 text-sm xl:text-base"
//                                                         onClick={() => handleSpaceDelete(space.id)}>
//                                                         <FontAwesomeIcon icon={faTrashCan} />
//                                                     </button>
//                                                     <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
//                                                                 text-sm xl:text-base"
//                                                         onClick={() => window.open(`/spaces/${space.id}`, '_blank')}>
//                                                         <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center text-stone-600">
//                                         <p className="text-xl">No spaces found.</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </section >

//                 {/* Modal */}
//                 <CreateSpaceModal
//                     isOpen={isModalOpen}
//                     onClose={() => setModalOpen(false)}
//                     onSubmitComplete={async (status) => {
//                         if (status === 201)
//                             console.log('Space created successfully!');
//                         await fetchUserData(); // Refresh spaces after successful submission
//                         setModalOpen(false);
//                     }}
//                     userId={agency.userId}
//                 />

//             </div >
//         );