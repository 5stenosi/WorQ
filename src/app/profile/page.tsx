'use client';

import { use, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowUpRightFromSquare, faTrashCan, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import CreateSpaceModal from '@/components/CreateSpaceModal';
import { set } from 'date-fns';

export default function Profile() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({
        userId: '',
        name: 'Nome',
        surname: 'Cognome',
        userEmail: 'Email',
        cellphone: 'Phone',
        // bookings: [],
        // spaces: [],
    });

    // Fetch user data from the API
    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();
            setUserData(data);
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
        finally {
            setIsLoading(false);
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
                            <h1 className="text-3xl lg:text-2xl xl:text-3xl font-bold text-stone-800"> {userData?.name} {userData?.surname} </h1>
                            <p className="text-lg lg:text-base xl:text-lg text-stone-600">{userData?.userEmail}</p>
                            <p className="text-lg lg:text-base xl:text-lg text-stone-600">{userData?.cellphone}</p>
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
                            {Array.from({ length: 30 }).map((_, index) => (
                                <div
                                    key={index} // Add a unique key for each child
                                    className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5">
                                    <div>
                                        <h2 className="text-xl font-semibold text-stone-800">Oxford Artisan</h2>
                                        <p className="text-sm text-stone-600">Location, Country</p>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <div className='aspect-square w-full h-8 flex justify-center items-center rounded-sm font-bold text-sm md:text-xs lg:text-sm text-center overflow-hidden bg-west-side-200 border-1 border-west-side-300 text-west-side-900'>28/12/2025</div>

                                        <div className='flex gap-2 items-end'>
                                            <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-red-500 active:bg-red-500 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
                                                                text-sm xl:text-base">
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                            <button className="aspect-square flex justify-center items-center size-8 bg-stone-100 hover:bg-stone-900 active:bg-stone-900 hover:text-stone-100 active:text-stone-100 transition rounded-lg shadow-sm
                                                                text-sm xl:text-base">
                                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Modal */}
            <CreateSpaceModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                agency={userData}
            />

        </div >
    );
}