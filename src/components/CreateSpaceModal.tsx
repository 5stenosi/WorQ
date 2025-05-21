import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Carousel from '@/components/Carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faImages, faXmark, faWifi, faDesktop, faPen, faWheelchair, faPrint, faVideo, faUtensils, faChild, faDog, faChalkboard, faVideoCamera, faSnowflake, faCoffee, faParking, faLock, faBolt, faVolumeXmark, faKitchenSet } from '@fortawesome/free-solid-svg-icons';
import { library, findIconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';

library.add(
    faWifi, faPen, faPrint, faChalkboard, faDesktop, faVideo,
    faWheelchair, faSnowflake, faVolumeXmark, faCoffee, faUtensils,
    faVideoCamera, faKitchenSet, faChild, faDog, faParking, faLock, faBolt
);

const CreateSpaceModal: React.FC<{ isOpen: boolean; onClose: () => void, agency: any }> = ({ isOpen, onClose, agency }) => {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Preview of uploaded images
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Uploaded files
    const [suggestions, setSuggestions] = useState<any[]>([]); // Address suggestions
    const [formData, setFormData] = useState<{
        agencyId?: number;
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
        agencyId: agency.id,
        name: '',
        address: '',
        seats: 1,
        price: 1,
        typology: 'MEETING_ROOMS',
        description: '',
        services: [],
    });

    const [errors, setErrors] = useState<{
        agencyId?: number;
        name?: string;
        address?: string;
        seats?: string;
        price?: string;
        typology?: string;
        description?: string;
        services?: string;
        images?: string;
        files?: File;
    }>({});

    const [isClosing, setIsClosing] = useState(false);

    // State for services
    const [services, setServices] = useState<{
        id: string;
        detail: string;
        iconName?: IconName;
    }[]>([]);

    // State for selected services
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // Fetch services from the server
    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();
            setServices(data.map((service: { id: string; detail: string; iconName?: IconName }) => ({
                id: service.id,
                detail: service.detail,
                iconName: service.iconName ? findIconDefinition({ prefix: 'fas', iconName: service.iconName }) : faVideoCamera,
            })));
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }

    useEffect(() => {
        fetchServices(); // Fetch services when the component mounts
        if (!isOpen) {
            setIsClosing(true);
            const timeout = setTimeout(() => {
                setIsClosing(false);
            }, 300); // Duration of the transition in milliseconds
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (formData.name.trim() === '') newErrors.name = 'Name is required';
        if (formData.address.trim() === '') newErrors.address = 'Address is required';
        if (formData.seats <= 0) newErrors.seats = 'Seats must be greater than 0';
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (formData.typology.trim() === '') newErrors.typology = 'Space type is required';
        if (formData.description.trim() === '') newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
            const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
            const fileNames = validFiles.map((file) => file.name);
            setUploadedImages(imageUrls);
            setUploadedFiles(validFiles);
            setErrors({ ...errors, images: undefined }); // Clear image error if any
            setErrors({ ...errors, files: undefined }); // Clear files error if any
        }
    };

    const fetchSuggestions = async (value: string) => {
        if (!value) return;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&limit=3&addressdetails=1`);
        const data = await res.json();
        setSuggestions(data);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: id === 'seats' || id === 'price' ? parseInt(value) : value });
        setErrors({ ...errors, [id]: undefined }); // Clear error for the field
    };

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

            const result = await response.json(); // Parses the server response

            handleClearFields(); // Clears the form fields after successful submission
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

    if (!isOpen && !isClosing) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-9999 transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className="w-screen h-screen bg-stone-900/75 absolute"
                onClick={() => {
                    setIsClosing(true);
                    setTimeout(onClose, 300); // Synchronize with the transition duration
                }}
            ></div>
            <div
                className={`bg-stone-100 rounded-xl shadow-lg max-w-7xl w-full p-5 relative transition-transform duration-300 ${isOpen && !isClosing ? 'scale-100' : 'scale-90'}`}>
                <h2 className="text-2xl font-bold mb-5">Publish a New Space</h2>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex gap-5">
                        {/* Left Section */}
                        <div className="flex flex-col w-2/5 gap-5">
                            {/* Image Upload Section */}
                            <div className="flex flex-col">
                                <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                    Images
                                </label>
                                <div className="relative h-56 border rounded-lg bg-stone-50 border-stone-300 flex items-center justify-center cursor-pointer overflow-hidden group">
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
                                    {uploadedImages.length > 1 && (
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

                            {/* Services */}
                            <div className="flex flex-wrap gap-2">
                                {services.map((service) => (
                                    <label
                                        key={service.id}
                                        className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full border-1 cursor-pointer transition duration-500 hover:duration-150 delay-250 hover:delay-0
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
                                        <FontAwesomeIcon icon={service.iconName || faVideoCamera} />
                                        {service.detail}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col w-3/5 gap-5">
                            {/* Name + Address */}
                            <div className="flex gap-5">
                                <div className="w-full flex flex-col">
                                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                        Name
                                        {errors.name && <p className="text-red-500">{errors.name}</p>}
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
                                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                        Address
                                        {errors.address && <p className="text-red-500">{errors.address}</p>}
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        onBlur={(e) => fetchSuggestions(e.currentTarget.value)}
                                        className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                        placeholder="Enter space address"
                                    />

                                    {suggestions.length > 0 && (
                                        <ul className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {suggestions.map((s, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, address: s.display_name, fullAddress: s }));
                                                        // Clear suggestions after selection
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
                            <div className="flex gap-5">
                                <div className="w-full flex flex-col">
                                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                        Seats
                                        {errors.seats && <p className="text-red-500">{errors.seats}</p>}
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
                                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                        Price per day
                                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                                    </label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            id="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                            placeholder="Enter price per day"
                                            min="1" />
                                        <span className="flex justify-center items-center aspect-square rounded-lg h-full border-1 border-stone-900 text-xl">€</span>
                                    </div>
                                </div>
                            </div>
                            {/* Space Type */}
                            <div className="flex flex-col">
                                <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                    Space type
                                    {errors.typology && <p className="text-red-500">{errors.typology}</p>}
                                </label>
                                <select
                                    id="typology"
                                    value={formData.typology}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50">
                                    <option value="MEETING_ROOMS">Meeting Room</option>
                                    <option value="PRIVATE_OFFICES">Private Office</option>
                                    <option value="COMMON_AREAS">Common Area</option>
                                    <option value="OUTDOOR_SPACES">Outdoor Space</option>
                                </select>
                            </div>
                            {/* Description */}
                            <div className="flex flex-col h-full">
                                <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                    Description
                                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="h-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                    placeholder="Enter space description" />
                            </div>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleClearFields}
                            className="overflow-hidden flex justify-start items-center rounded-lg bg-red-500 text-stone-100 transition-all duration-150 w-12 hover:w-44 ease-out active:scale-90 hover:scale-110 origin-left">
                            <div className="aspect-square bg-red-500 size-12 text-2xl rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div>
                            <p className="whitespace-nowrap text-xl text-left w-full">Clear fields</p>
                        </button>
                        <button
                            type="submit"
                            className="overflow-hidden flex justify-end items-center rounded-lg bg-stone-900 hover:w-44 hover:scale-110 text-stone-100 transition-all duration-150 w-12 ease-out active:scale-90 origin-right">
                            <p className="whitespace-nowrap text-xl text-right w-full">Publish space</p>
                            <div className="aspect-square bg-stone-900 size-12 text-2xl rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        </button>
                    </div>
                </form>
                <button
                    className="flex justify-center items-center absolute size-10 top-4 right-4 bg-stone-100 hover:bg-red-500 border-1 border-stone-900/10 rounded-lg shadow-sm text-stone-900 hover:text-stone-100 text-2xl transition"
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