'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowUpRightFromSquare, faTrashCan, faImages } from '@fortawesome/free-solid-svg-icons';
import Carousel from '@/components/Carousel';

export default function Profile() {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setUploadedImages(imageUrls);
        }
    };

    return (
        <div id='profile' className={`overflow-y-auto px-10`}>
            <section className={`w-full h-screen pt-24 pb-3`}>
                {/* Profile Wrapper */}
                <div className={`w-full h-full p-5 flex bg-stone-100 rounded-4xl transition-all duration-1000 gap-5`}>

                    {/* Left Section */}
                    <div className={`p-4 h-full flex flex-col gap-3 rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden transition-all duration-1000 w-2/5 relative`}>
                        {/* Profile Information */}
                        <h1 className="text-3xl font-bold text-stone-800">Luca Tesei</h1>
                        <p className="text-lg text-stone-600">email@example.com</p>
                        <p className="text-lg text-stone-600">+39 123 456 7890</p>

                        {/* Form per creazione spazio */}
                        <form className="flex flex-col gap-4 border-1 border-stone-900/10 bg-stone-100 p-2 rounded-xl shadow-sm overflow-y-auto max-h-full">
                            <div className='flex justify-between gap-5'>
                                <div className="flex flex-col w-2/5">
                                    <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Images</label>
                                    <div className="relative h-full border rounded-lg border-stone-300 flex items-center justify-center cursor-pointer overflow-hidden group">
                                        {uploadedImages.length === 0 && (
                                            <>
                                                <input
                                                    type="file"
                                                    id="images"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                                <FontAwesomeIcon icon={faImages} className="text-stone-900 transition text-6xl group-hover:scale-125" />
                                            </>
                                        )}
                                        {uploadedImages.length === 1 && (
                                            <img
                                                src={uploadedImages[0]}
                                                alt="Uploaded"
                                                className="absolute inset-0 object-cover w-full h-full rounded-lg"
                                            />
                                        )}
                                        {uploadedImages.length > 1 && (
                                            <Carousel images={uploadedImages} autoPlay={true} autoPlayInterval={10000} buttonSize="size-8" dotSize="size-1" chevronSize='text-xs' />
                                        )}
                                    </div>
                                </div>
                                <div className='flex flex-col w-3/5 gap-3'>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500"
                                            placeholder="Enter space name" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500"
                                            placeholder="Enter address" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Description</label>
                                <textarea
                                    id="description"
                                    className="min-h-12 p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500"
                                    placeholder="Enter description" />
                            </div>
                            <div className='flex justify-between gap-10'>
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Seats</label>
                                    <input
                                        type="number"
                                        id="seats"
                                        className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500"
                                        placeholder="Enter number of spaces" />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Space Type</label>
                                    <select
                                        id="spaceType"
                                        className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500">
                                        <option value="meetingRoom">Meeting Room</option>
                                        <option value="privateOffice">Private Office</option>
                                        <option value="commonArea">Common Area</option>
                                        <option value="outdoorSpace">Outdoor Space</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Services</label>
                                <select
                                    id="services"
                                    multiple
                                    className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500">
                                    <option value="wifi">WiFi</option>
                                    <option value="parking">Parking</option>
                                    <option value="coffee">Coffee</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                    <option value="printer">Printer</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium pl-1 pb-1 text-stone-900">Price Per Day</label>
                                <input
                                    type="number"
                                    id="pricePerDay"
                                    className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500"
                                    placeholder="Enter price per day" />
                            </div>
                            <div className="flex justify-between">
                                {/* Clear Fields Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const form = document.querySelector('form');
                                        if (form) {
                                            form.reset();
                                        }
                                    }}
                                    className='overflow-hidden flex justify-start items-center rounded-xl bg-red-500 text-stone-100 transition-all duration-250
                                    w-12 hover:w-44'>
                                    <div className='aspect-square bg-red-500 size-12 text-2xl rounded-xl flex items-center justify-center'>
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </div>
                                    <p className='whitespace-nowrap text-xl text-left w-full'>Clear fields</p>
                                </button>
                                {/* Submit Button */}
                                <button className='overflow-hidden flex justify-end items-center rounded-xl bg-stone-900 text-stone-100 transition-all duration-250
                                                 w-12 hover:w-44'>
                                    <p className='whitespace-nowrap text-xl text-right w-full'>Publish space</p>
                                    <div className='aspect-square bg-stone-900 size-12 text-2xl rounded-xl flex items-center justify-center'>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Section */}
                    <div className={`gap-5 h-full rounded-2xl border-1 border-stone-900/10 shadow-sm overflow-hidden transition-all duration-1000 w-3/5`}>
                        <div className="grid gap-4 p-4 h-full overflow-y-scroll
                                        grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 30 }).map((_, index) => (
                                <div
                                    key={index} // Add a unique key for each child
                                    className="p-2 rounded-lg shadow-sm border-1 border-stone-900/10 bg-stone-100 transition-shadow flex flex-col justify-between gap-5">
                                    <div>
                                        <h2 className="text-xl font-semibold text-stone-800">Oxford Artisan</h2>
                                        <p className="text-sm text-stone-500">Location, Country</p>
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
        </div >
    );
}