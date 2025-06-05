import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';

const CreateSpaceModal: React.FC<{ isOpen: boolean; onClose: () => void, onSubmitComplete: (status: number | null) => void }> = ({ isOpen, onClose, onSubmitComplete }) => {

    // TODO: enniente Folc, quetti so pe te


    // const [formData, setFormData] = useState<{
    //     userId?: string;
    //     name: string;
    //     address: string;
    //     fullAddress?: string;
    //     seats: number;
    //     price: number;
    //     typology: string;
    //     description: string;
    //     services?: string[];
    //     images?: string[];
    //     files?: File[];
    // }>({
    //     userId: userId,
    //     name: '',
    //     address: '',
    //     seats: 1,
    //     price: 1,
    //     typology: 'MEETING_ROOMS',
    //     description: '',
    //     services: [],
    // });

    // // Error state for required fields
    // const [errors, setErrors] = useState<{
    //     name?: boolean;
    //     address?: boolean;
    //     seats?: boolean;
    //     price?: boolean;
    //     typology?: boolean;
    //     description?: boolean;
    // }>({});

    // const handleClearFields = () => {
    //     setFormData({
    //         name: '',
    //         address: '',
    //         seats: 1,
    //         price: 1,
    //         typology: 'MEETING_ROOMS',
    //         description: '',
    //     });
    //     setUploadedImages([]); // Clear uploaded images
    //     setUploadedFiles([]); // Clear uploaded files
    //     setSelectedServices([]); // Clear selected services
    //     setErrors({}); // Clear all errors
    // };

    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // For entry transition

    useEffect(() => {
        let openTimeout: NodeJS.Timeout | undefined;
        let closeTimeout: NodeJS.Timeout | undefined;
        if (isOpen) {
            setIsVisible(false); // Reset
            openTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 10); // Wait a tick to trigger transition
        } else {
            setIsClosing(true);
            setIsVisible(false);
            closeTimeout = setTimeout(() => {
                setIsClosing(false);
            }, 300); // Duration of the transition in milliseconds
        }
        return () => {
            if (openTimeout) clearTimeout(openTimeout);
            if (closeTimeout) clearTimeout(closeTimeout);
        };
    }, [isOpen]);

    // // Validate required fields, set error state as boolean
    // const validateForm = () => {
    //     const newErrors: typeof errors = {};
    //     if (formData.name.trim() === '') newErrors.name = true;
    //     if (formData.address.trim() === '') newErrors.address = true;
    //     if (formData.seats <= 0) newErrors.seats = true;
    //     if (formData.price <= 0) newErrors.price = true;
    //     if (formData.typology.trim() === '') newErrors.typology = true;
    //     if (formData.description.trim() === '') newErrors.description = true;
    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    // // Handles form submission
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault(); // Prevents the default form submission behavior
    //     if (!validateForm()) { // Validates the form before proceeding
    //         console.error('Form validation failed:', errors);
    //         return;
    //     }

    //     try {
    //         const formDataToSend = new FormData(); // Creates a FormData object to send data
    //         formDataToSend.append('metadata', JSON.stringify(formData)); // Appends form metadata as JSON
    //         uploadedFiles.forEach((file) => {
    //             formDataToSend.append('files', file); // Appends each uploaded file
    //         });

    //         // Sends the form data to the server
    //         const response = await fetch('/api/spaces', {
    //             method: 'POST',
    //             body: formDataToSend,
    //         });

    //         const result = await response.json(); // Parses the server response

    //         handleClearFields(); // Clears the form fields after successful submission
    //         onSubmitComplete(result.status || null); // Calls the callback with the status from the server
    //         onClose(); // Closes the modal
    //     }
    //     catch (error) {
    //         console.error('Error creating space:', error); // Logs any errors during submission
    //     }
    // };

    if (!isOpen && !isClosing) return null;

    // Red dot error indicator
    const errorDot = <div className="w-2 h-2 mx-2 rounded-full bg-red-500 animate-pulse" />;

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-9999 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}
                        px-5 sm:px-10 md:px-15 lg:px-20 py-5`}>
            <div className="w-screen h-screen bg-stone-900/75 absolute"
                onClick={() => {
                    setIsClosing(true);
                    setTimeout(onClose, 300); // Synchronize with the transition duration
                }}
            ></div>
            <div
                className={`overflow-y-auto bg-stone-100 rounded-l-xl rounded-r-md md:rounded-xl shadow-lg max-w-lg max-h-full w-full p-5 relative transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-90'}`}>
                <h2 className="text-lg sm:text-2xl font-bold mb-5 pr-10">Edit your profile</h2>
                <form className="flex flex-col gap-5">
                    <div className='flex flex-col lg:flex-row gap-5'>
                        <div className="w-full flex flex-col">
                            <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                Name
                                {/* {errors.name && errorDot} */}
                            </label>
                            <input
                                type="text"
                                id="name"
                                // value={formData.name}
                                // onChange={handleInputChange}
                                className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                            />
                        </div>

                        {/* TODO: da mostrare solo se CLIENT */}
                        <div className="w-full flex flex-col">
                            <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                Surname
                                {/* {errors.name && errorDot} */}
                            </label>
                            <input
                                type="text"
                                id="surname"
                                // value={formData.surname}
                                // onChange={handleInputChange}
                                className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                            {/* TODO: con CLIENT si chiama cellphone, con AGENCY si chiama Telephone */}
                            Telephone
                            {/* {errors.telephone && errorDot} */}
                        </label>
                        <input
                            type="tel"
                            id="telephone"
                            // value={formData.telephone}
                            // onChange={handleInputChange}
                            pattern='[0-9\s]+'
                            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                        />
                    </div>
                    {/* TODO: da mostrare solo per AGENCY */}
                    <div className="w-full flex flex-col    ">
                        <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                            VAT
                            {/* {errors.vat && errorDot} */}
                        </label>
                        <input
                            type="tel"
                            id="vatNumber"
                            // value={formData.vatNumber}
                            // onChange={handleInputChange}
                            pattern="^[A-Z]{2}\d{11}$"
                            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                            onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.toUpperCase();
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <button type='button'
                            className='flex justify-start items-center rounded-md ring-2 ring-red-500 bg-stone-100 hover:bg-red-500 active:bg-red-500 text-red-500 hover:text-stone-100 active:text-stone-100 shadow-sm transition-all duration-150 overflow-hidden
                                                                w-10 hover:w-37 active:w-37 ease-out active:scale-90 hover:scale-110 origin-left group'>
                            <div className='aspect-square bg-stone-100 group-hover:bg-red-500 group-active:bg-red-500 size-10 text-2xl rounded-md flex items-center justify-center duration-150'>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div>
                            <p className='whitespace-nowrap text-xl text-start w-full opacity-0 group-hover:opacity-100 group-active:opacity-100 duration-150'>Clear fields</p>
                        </button>

                        <button type='submit' className='flex justify-end items-center rounded-md ring-2 ring-west-side-500 bg-stone-100 hover:bg-west-side-500 active:bg-west-side-500 text-west-side-500 hover:text-stone-100 active:text-stone-100 shadow-sm transition-all duration-150 overflow-hidden
                                                                w-10 hover:w-46 active:w-46 ease-out active:scale-90 hover:scale-110 origin-right group'>
                            <p className='whitespace-nowrap text-xl text-end w-full opacity-0 group-hover:opacity-100 group-active:opacity-100 duration-150'>Confirm profile</p>
                            <div className='aspect-square bg-stone-100 group-hover:bg-west-side-500 group-active:bg-west-side-500 size-10 text-2xl rounded-md flex items-center justify-center duration-150'>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        </button>
                    </div>
                </form>
                {/* Close button */}
                <button
                    className="flex justify-center items-center absolute size-10 top-5 right-5 bg-stone-100 hover:bg-red-500 active:bg-red-500 border-1 border-stone-900/10 rounded-lg shadow-sm text-stone-900 hover:text-stone-100 active:text-stone-100 text-2xl transition"
                    onClick={() => {
                        setIsClosing(true);
                        setTimeout(onClose, 300); // Synchronize with the transition duration
                    }}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
        </div>
    );
};

export default CreateSpaceModal;