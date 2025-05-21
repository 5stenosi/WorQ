'use client';

import { use, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowUpRightFromSquare, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons';
import CreateSpaceModal from '@/components/CreateSpaceModal';
import { set } from 'date-fns';

export default function Profile() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({
        id: '',
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
            console.log('User data:', data);
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

    if (isLoading) return null;

    return (
        <div id='profile' className={`px-5 sm:px-10 md:px-15 lg:px-20`}>
            <section className={`w-full h-screen pt-28 pb-3`}>
                {/* Profile Wrapper */}
                <div className={`w-full h-full p-5 flex bg-stone-100 rounded-4xl transition-all duration-1000 gap-5`}>

                    {/* Left Section */}
                    <div className={`p-8 h-full overflow-y-auto flex flex-col gap-3 rounded-2xl border-1 border-stone-900/10 shadow-sm transition-all duration-1000 w-1/5`}>
                        {/* Profile Information */}
                        <div className='aspect-square w-full rounded-xl border-8 border-stone-300 flex items-center justify-center'>
                            <FontAwesomeIcon icon={faUser} className='text-stone-600 text-[10rem]' />
                        </div>
                        <h1 className="text-3xl font-bold text-stone-800"> {userData?.name} {userData?.surname} </h1>
                        <p className="text-lg text-stone-600">{userData?.userEmail}</p>
                        <p className="text-lg text-stone-600">{userData?.cellphone}</p>

                        {/* Publish Space Button */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className='mt-auto ml-auto flex justify-end items-center rounded-xl bg-west-side-500 text-stone-100 transition-all duration-150
                                           w-12 hover:w-44 ease-out active:scale-90 hover:scale-110 origin-right delay-1000 hover:delay-0'>
                            <p className='whitespace-nowrap text-xl text-right w-full'>Publish space</p>
                            <div className='aspect-square bg-west-side-500 size-12 text-2xl rounded-xl flex items-center justify-center'>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        </button>
                    </div>

                    {/* Right Section */}
                    <div className={`gap-5 h-full rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden transition-all duration-1000 w-4/5`}>
                        <div className="grid gap-4 p-4 h-full overflow-y-scroll
                                        grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 30 }).map((_, index) => (
                                <div
                                    key={index} // Add a unique key for each child
                                    className="p-2 rounded-lg shadow-sm hover:shadow-md border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5">
                                    <div>
                                        <h2 className="text-xl font-semibold text-stone-800">Oxford Artisan</h2>
                                        <p className="text-sm text-stone-600">Location, Country</p>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <div className='aspect-square w-full h-10 flex justify-center items-center rounded-lg font-bold text-lg text-center overflow-hidden bg-west-side-200 border-1 border-west-side-300 text-west-side-900'>28/12/2025</div>

                                        <div className='flex gap-2 items-end'>
                                            <button className="aspect-square flex justify-center items-center size-10 bg-stone-100 hover:bg-red-500 hover:text-stone-100 transition rounded-lg shadow-sm">
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                            <button className="aspect-square flex justify-center items-center size-10 bg-stone-100 hover:bg-stone-900 hover:text-stone-100 transition rounded-lg shadow-sm">
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