import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const CreateSpaceModal: React.FC<{ isOpen: boolean; onClose: () => void, userData: any, userRole: String, onSubmitComplete: (status: number | null) => void }> = ({ isOpen, onClose, userData, userRole, onSubmitComplete }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // For entry transition
    const [formData, setFormData] = useState<{
        name: string;
        surname?: string;
        cellphone?: string;
        telephone?: string;
        vatNumber?: string;
    }>({
        name: userData.name || '',
        surname: userRole === 'CLIENT' ? userData.surname || '' : undefined,
        cellphone: userRole === 'CLIENT' ? userData.cellphone || '' : undefined,
        telephone: userRole === 'AGENCY' ? userData.telephone || '' : undefined,
        vatNumber: userRole === 'AGENCY' ? userData.vatNumber || '' : undefined,
    });

    // Error state for required fields
    const [errors, setErrors] = useState<{
        name?: boolean;
        surname?: boolean;
        cellphone?: boolean;
        telephone?: boolean;
        vatNumber?: boolean;
    }>({});

    const handleClearFields = () => {
        setErrors({});
        console.log("Clearing fields");
        // Reset all fields to empty
        setFormData({
            name: '',
            surname: userRole === 'CLIENT' ? '' : undefined,
            cellphone: userRole === 'CLIENT' ? '' : undefined,
            telephone: userRole === 'AGENCY' ? '' : undefined,
            vatNumber: userRole === 'AGENCY' ? '' : undefined,
        });
    }

    // Validate required fields, set error state as boolean
    // TODO: Add more validation rules as needed
    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (formData.name.trim() === '') newErrors.name = true;
        if (formData.surname?.trim() === '') newErrors.surname = true;
        if (formData.cellphone?.trim() === '') newErrors.cellphone = true;
        if (formData.telephone?.trim() === '') newErrors.telephone = true;
        if (formData.vatNumber?.trim() === '') newErrors.vatNumber = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return; // Prevent submission if validation fails
        }
        console.log("Submitting form with data:", formData);
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const result = await response.json();
            onSubmitComplete(result.status || null); // Indicate success
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            toast.error("Failed to update profile. Please try again later.");
        }
    }

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
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className='flex flex-col lg:flex-row gap-5'>
                        <div className="w-full flex flex-col">
                            <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                Name
                                {errors.name && errorDot}
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                            />
                        </div>

                        {userRole === 'CLIENT' && (
                            <div className="w-full flex flex-col">
                                <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                    Surname
                                    {errors.name && errorDot}
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    value={formData.surname}
                                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                    className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                />
                            </div>
                        )}
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                            {userRole === 'CLIENT' ? 'Cellphone' : 'Telephone'}
                            {userRole === 'CLIENT' ? errors.cellphone && errorDot : errors.telephone && errorDot}
                        </label>
                        <input
                            type="tel"
                            id="telephone"
                            value={userRole === 'CLIENT' ? formData.cellphone : formData.telephone}
                            onChange={(e) => setFormData({ ...formData, [userRole === 'CLIENT' ? 'cellphone' : 'telephone']: e.target.value })}
                            pattern='[0-9\s]+'
                            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                        />
                    </div>

                    {userRole === 'AGENCY' && (
                        <div className="w-full flex flex-col">
                            <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                VAT
                                {errors.vatNumber && errorDot}
                            </label>
                            <input
                                type="tel"
                                id="vatNumber"
                                value={formData.vatNumber}
                                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                                pattern="^[A-Z]{2}\d{11}$"
                                className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    target.value = target.value.toUpperCase();
                                }}
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <button type='button'
                            onClick={handleClearFields}
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