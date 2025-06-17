import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Carousel from '@/components/Carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faImages, faXmark, faWifi, faDesktop, faPen, faWheelchair, faPrint, faVideo, faUtensils, faChild, faDog, faChalkboard, faVideoCamera, faSnowflake, faCoffee, faParking, faLock, faBolt, faVolumeXmark, faSpinner, faQuestion, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { library, findIconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';

// Add FontAwesome icons to the library for dynamic use
library.add(
    faWifi, faPen, faPrint, faChalkboard, faDesktop, faVideo,
    faWheelchair, faSnowflake, faVolumeXmark, faCoffee, faUtensils,
    faVideoCamera, faChild, faDog, faParking, faLock, faBolt
);

// Modal for creating a new space listing
const CreateSpaceModal: React.FC<{ isOpen: boolean; onClose: () => void, userId: string, onSubmitComplete: (status: number | null) => void }> = ({ isOpen, onClose, userId, onSubmitComplete }) => {
    // State for image previews
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    // State for uploaded image files
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    // State for address suggestions
    const [suggestions, setSuggestions] = useState<any[]>([]);
    // Loading state for address suggestions
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    // Controls visibility of suggestions dropdown
    const [suggestionsVisible, setSuggestionsVisible] = useState(false);
    // State for form data
    const [formData, setFormData] = useState<{
        userId?: string;
        name: string;
        address: string;
        fullAddress?: string;
        seats: number;
        price: number;
        typology: string;
        description: string;
        services?: string[];
        images?: string[];
        files?: File[];
    }>({
        userId: userId,
        name: '',
        address: '',
        seats: 1,
        price: 1,
        typology: 'MEETING_ROOMS',
        description: '',
        services: [],
    });

    // Error state for required fields
    const [errors, setErrors] = useState<{
        name?: boolean;
        address?: boolean;
        seats?: boolean;
        price?: boolean;
        typology?: boolean;
        description?: boolean;
    }>({});

    // Modal transition states
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // For entry transition
    // Dropdown open state for chevron (true = menu open)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Track if select was open to handle toggle on click
    const selectWasOpen = React.useRef(false);

    // State for available services
    const [services, setServices] = useState<{
        id: string;
        detail: string;
        iconName?: IconName;
    }[]>([]);

    // State for selected services
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // Fetch available services from the server
    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();
            setServices(data.map((service: { id: string; detail: string; iconName?: IconName }) => ({
                id: service.id,
                detail: service.detail,
                iconName: service.iconName ? findIconDefinition({ prefix: 'fas', iconName: service.iconName }) : faQuestion,
            })));
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }

    // Handle modal open/close transitions and fetch services on open
    useEffect(() => {
        let openTimeout: NodeJS.Timeout | undefined;
        let closeTimeout: NodeJS.Timeout | undefined;
        if (isOpen) {
            fetchServices(); // Fetch services when the component mounts
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

    // Validate required fields, set error state as boolean
    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (formData.name.trim() === '') newErrors.name = true;
        if (formData.address.trim() === '') newErrors.address = true;
        if (formData.seats <= 0) newErrors.seats = true;
        if (formData.price <= 0) newErrors.price = true;
        if (formData.typology.trim() === '') newErrors.typology = true;
        if (formData.description.trim() === '') newErrors.description = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handles image upload and sets the preview URLs
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
            const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
            setUploadedImages(imageUrls);
            setUploadedFiles(validFiles);
        }
    };

    // Fetches address suggestions from the Nominatim API
    const fetchSuggestions = async (value: string) => {
        if (!value) return;
        setIsLoadingSuggestions(true);
        try {
            const res = await fetch(`/api/nominatim?q=${encodeURIComponent(value)}`);
            const data = await res.json();
            setSuggestions(data);
        } catch (e) {
            setSuggestions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    // Debounce logic for address input
    const [addressInput, setAddressInput] = useState('');
    useEffect(() => {
        if (!suggestionsVisible) return;
        if (!addressInput) {
            setSuggestions([]);
            return;
        }
        const handler = setTimeout(() => {
            fetchSuggestions(addressInput);
        }, 300);
        return () => clearTimeout(handler);
    }, [addressInput, suggestionsVisible]);

    // Handles input changes for form fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: id === 'seats' || id === 'price' ? parseInt(value) : value });
        setErrors({ ...errors, [id]: false }); // Clear error for the field
    };

    // Clears all form fields and resets state
    const handleClearFields = () => {
        setFormData({
            name: '',
            address: '',
            seats: 1,
            price: 1,
            typology: 'MEETING_ROOMS',
            description: '',
        });
        setUploadedImages([]); // Clear uploaded images
        setUploadedFiles([]); // Clear uploaded files
        setSelectedServices([]); // Clear selected services
        setErrors({}); // Clear all errors
    };

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior
        if (!validateForm()) { // Validates the form before proceeding
            console.error('Form validation failed:', errors);
            return;
        }

        try {
            const formDataToSend = new FormData(); // Creates a FormData object to send data
            formDataToSend.append('metadata', JSON.stringify(formData)); // Appends form metadata as JSON
            uploadedFiles.forEach((file) => {
                formDataToSend.append('files', file); // Appends each uploaded file
            });

            // Sends the form data to the server
            const response = await fetch('/api/spaces', {
                method: 'POST',
                body: formDataToSend,
            });

            handleClearFields(); // Clears the form fields after successful submission
            onSubmitComplete(response.status || null); // Calls the callback with the status from the server
            onClose(); // Closes the modal
        }
        catch (error) {
            console.error('Error creating space:', error); // Logs any errors during submission
        }
    };

    // Toggles the selection of a service
    const handleServiceToggle = (serviceId: string) => {
        setSelectedServices((prev) => {
            const updatedServices = prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId) // Removes the service if already selected
                : [...prev, serviceId]; // Adds the service if not selected
            setFormData({ ...formData, services: updatedServices }); // Updates the form data with selected services
            return updatedServices;
        });
    };

    // If modal is not open and not closing, render nothing
    if (!isOpen && !isClosing) return null;

    // Red dot error indicator for required fields
    const errorDot = <div className="w-2 h-2 mx-2 rounded-full bg-red-500 animate-pulse" />;

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-9999 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}
                        px-5 sm:px-10 md:px-15 lg:px-20 py-5`}>
            {/* Modal background overlay */}
            <div
                className="w-screen h-screen bg-stone-900/75 absolute"
                onClick={() => {
                    setIsClosing(true);
                    setTimeout(onClose, 300); // Synchronize with the transition duration
                }}
            ></div>
            <div
                className={`overflow-y-auto bg-stone-100 rounded-l-xl rounded-r-md md:rounded-xl shadow-lg max-w-6xl max-h-full w-full p-5 relative transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-90'}`}>
                <h2 className="text-lg sm:text-2xl font-bold mb-5 pr-10">Publish a New Space</h2>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row gap-5">
                        {/* Left Section: Images and Services */}
                        <div className="flex flex-col w-full sm:w-1/2 lg:w-2/5 gap-5">
                            {/* Image Upload Section */}
                            <div className="flex flex-col">
                                <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                    Images
                                </label>
                                <div className="relative min-h-32 h-0 sm:h-40 border rounded-lg bg-stone-50 border-stone-300 flex items-center justify-center cursor-pointer overflow-hidden group">
                                    {uploadedImages.length === 0 && (
                                        <>
                                            <input
                                                type="file"
                                                id="images"
                                                multiple
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            <FontAwesomeIcon icon={faImages} className="text-stone-600 transition text-6xl group-hover:scale-125" />
                                        </>
                                    )}
                                    {uploadedImages.length === 1 && (
                                        <Image
                                            src={uploadedImages[0]}
                                            alt="Uploaded"
                                            className="absolute inset-0 object-cover w-full h-full rounded-lg"
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                    {uploadedImages.length > 0 && (
                                        <Carousel
                                            images={uploadedImages}
                                            autoPlay={true}
                                            autoPlayInterval={10000}
                                            buttonSize="size-10"
                                            dotSize="size-2"
                                            chevronSize="text-xs"
                                            onClearImages={() => {
                                                setUploadedImages([]);
                                                setUploadedFiles([]);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Services selection */}
                            <div className="h-20 grow overflow-y-auto">
                                <div className='flex flex-wrap gap-1 sm:gap-2'>
                                    {services.map((service) => (
                                        <label
                                            key={service.id}
                                            className={`h-fit flex items-center gap-1 px-2 py-1 text-xs md:text-sm rounded-full border-1 cursor-pointer transition duration-500 hover:duration-150 delay-250 hover:delay-0
                                            ${selectedServices.includes(service.id)
                                                    ? 'bg-west-side-200 border-west-side-900 text-west-side-900'
                                                    : 'hover:bg-west-side-100 hover:border-west-side-300 hover:text-west-side-900 border-stone-300 text-stone-600 bg-stone-50'
                                                }`}>
                                            <input
                                                type="checkbox"
                                                id={service.id}
                                                checked={selectedServices.includes(service.id)}
                                                onChange={() => handleServiceToggle(service.id)}
                                                className="hidden" />
                                            <FontAwesomeIcon icon={service.iconName || faQuestion} />
                                            {service.detail}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Form fields */}
                        <div className="flex flex-col w-full sm:w-1/2 lg:w-3/5 gap-5">
                            {/* Name + Address */}
                            <div className="flex flex-col lg:flex-row gap-5">
                                <div className="w-full flex flex-col">
                                    <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                        Name
                                        {errors.name && errorDot}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                        placeholder="Enter space name" />
                                </div>
                                <div className="w-full flex flex-col relative">
                                    <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                        Address
                                        {errors.address && errorDot}
                                    </label>

                                    <div className='w-full relative'>
                                        <input
                                            type="text"
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setAddressInput(e.currentTarget.value);
                                                setSuggestionsVisible(true);
                                            }}
                                            onFocus={() => setSuggestionsVisible(true)}
                                            onBlur={() => setSuggestionsVisible(false)}
                                            className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                            placeholder="Enter space address"
                                        />
                                        {isLoadingSuggestions && (
                                            <div className='absolute inset-y-0 right-0 aspect-square h-full flex justify-center items-center text-stone-600'>
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                            </div>
                                        )}
                                    </div>

                                    {/* Address suggestions dropdown */}
                                    {suggestions.length > 0 && suggestionsVisible && (
                                        <ul className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {suggestions.map((s, i) => (
                                                <li
                                                    key={i}
                                                    onMouseDown={() => {
                                                        console.log('Suggestion clicked:', s.display_name, s);
                                                        if (!s.address.road || !s.address.country || (!s.address.city && !s.address.town && !s.address.village)) {
                                                            alert('Please select a valid address with street information.');
                                                            return;
                                                        }
                                                        setFormData(prev => {
                                                            const updated = { ...prev, address: s.display_name, fullAddress: s };
                                                            console.log('setFormData', updated);
                                                            return updated;
                                                        });
                                                        setAddressInput(s.display_name);
                                                        console.log('setAddressInput', s.display_name);
                                                        setSuggestions([]);
                                                    }}
                                                    className="p-2 hover:bg-stone-100 cursor-pointer border-b border-stone-100 last:border-b-0"
                                                >
                                                    {s.display_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {/* Seats + Price */}
                            <div className="flex flex-col lg:flex-row gap-5">
                                <div className="w-full flex flex-col">
                                    <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                        Seats
                                        {errors.seats && errorDot}
                                    </label>
                                    <input
                                        type="number"
                                        id="seats"
                                        value={formData.seats}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                        placeholder="Enter number of seats"
                                        min="1" />
                                </div>
                                <div className="w-full flex flex-col">
                                    <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                        Price per day
                                        {errors.price && errorDot}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            id="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                            placeholder="Enter price per day"
                                            min="1" />
                                        <span className="flex justify-center items-center aspect-square h-10 rounded-lg border-1 border-stone-300 bg-stone-50 text-xl">€</span>
                                    </div>
                                </div>
                            </div>
                            {/* Space Type dropdown */}
                            <div className="flex flex-col relative">
                                <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                    Space type
                                    {errors.typology && errorDot}
                                </label>
                                <div className="relative w-full">
                                    <select
                                        id="typology"
                                        value={formData.typology}
                                        className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50 appearance-none pr-10"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                                        onMouseDown={e => {
                                            // Toggle open/close on click
                                            if (isDropdownOpen) {
                                                e.preventDefault(); // Prevent default open
                                                setIsDropdownOpen(false);
                                                selectWasOpen.current = false;
                                            } else {
                                                setIsDropdownOpen(true);
                                                selectWasOpen.current = true;
                                            }
                                        }}
                                        onBlur={() => {
                                            setIsDropdownOpen(false);
                                            selectWasOpen.current = false;
                                        }}
                                        onChange={e => {
                                            handleInputChange(e);
                                            setIsDropdownOpen(false);
                                            selectWasOpen.current = false;
                                        }}
                                    >
                                        <option value="MEETING_ROOMS">Meeting Room</option>
                                        <option value="PRIVATE_OFFICES">Private Office</option>
                                        <option value="COMMON_AREAS">Common Area</option>
                                        <option value="OUTDOOR_SPACES">Outdoor Space</option>
                                    </select>
                                    <span className={`pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-600 transition-transform duration-200 ${isDropdownOpen ? '-scale-y-100' : ''}`}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                </div>
                            </div>
                            {/* Description field */}
                            <div className="flex flex-col">
                                <label className="flex items-center text-sm md:text-base font-medium pl-1 pb-1 text-stone-900">
                                    Description
                                    {errors.description && errorDot}
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="min-h-fit p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50 resize-none"
                                    placeholder="Enter space description"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-between">
                        {/* Clear fields button */}
                        <button type='button' onClick={handleClearFields}
                            className='flex justify-start items-center rounded-md ring-2 ring-red-500 bg-stone-100 hover:bg-red-500 active:bg-red-500 text-red-500 hover:text-stone-100 active:text-stone-100 shadow-sm transition-all duration-150 overflow-hidden
                                            w-10 hover:w-37 active:w-37 ease-out active:scale-90 hover:scale-110 origin-left group'>
                            <div className='aspect-square bg-stone-100 group-hover:bg-red-500 group-active:bg-red-500 size-10 text-2xl rounded-md flex items-center justify-center duration-150'>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div>
                            <p className='whitespace-nowrap text-xl text-start w-full opacity-0 group-hover:opacity-100 group-active:opacity-100 duration-150'>Clear fields</p>
                        </button>

                        {/* Publish space button */}
                        <button type='submit' className='flex justify-end items-center rounded-md ring-2 ring-west-side-500 bg-stone-100 hover:bg-west-side-500 active:bg-west-side-500 text-west-side-500 hover:text-stone-100 active:text-stone-100 shadow-sm transition-all duration-150 overflow-hidden
                                            w-10 hover:w-43 active:w-43 ease-out active:scale-90 hover:scale-110 origin-right group'>
                            <p className='whitespace-nowrap text-xl text-end w-full opacity-0 group-hover:opacity-100 group-active:opacity-100 duration-150'>Publish space</p>
                            <div className='aspect-square bg-stone-100 group-hover:bg-west-side-500 group-active:bg-west-side-500 size-10 text-2xl rounded-md flex items-center justify-center duration-150'>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        </button>
                    </div>
                </form>
                {/* Close button for modal */}
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