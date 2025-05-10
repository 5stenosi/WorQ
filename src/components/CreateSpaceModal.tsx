import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faImages, faXmark, faWifi, faDesktop, faPen, faWheelchair, faPrint, faVideo, faUtensils, faChild, faDog, faChalkboard, faVideoCamera, faSnowflake, faCoffee, faParking, faLock, faBolt, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import Carousel from '@/components/Carousel';

const CreateSpaceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [formData, setFormData] = useState<{
        name: string;
        address: string;
        seats: number;
        pricePerDay: number;
        spaceType: string;
        description: string;
        images: string[];
    }>({
        name: '',
        address: '',
        seats: 1,
        pricePerDay: 1,
        spaceType: 'meetingRoom',
        description: '',
        images: [],
    });

    const [errors, setErrors] = useState<{
        name?: string;
        address?: string;
        seats?: string;
        pricePerDay?: string;
        spaceType?: string;
        description?: string;
        images?: string;
    }>({});

    const [isClosing, setIsClosing] = useState(false);

    // Stato per i servizi selezionati
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // Array dei servizi
    const services = [
        { id: 'wifi', name: 'WiFi', icon: faWifi },
        { id: 'desktop', name: 'Desktop', icon: faDesktop },
        { id: 'stationery', name: 'Stationery', icon: faPen },
        { id: 'disabilityAccess', name: 'Disability Access', icon: faWheelchair },
        { id: 'printer', name: 'Printer', icon: faPrint },
        { id: 'projector', name: 'Projector', icon: faVideo },
        { id: 'catering', name: 'Catering', icon: faUtensils },
        { id: 'childFriendly', name: 'Child-Friendly', icon: faChild },
        { id: 'petFriendly', name: 'Pet-Friendly', icon: faDog },
        { id: 'whiteBoard', name: 'White Board', icon: faChalkboard },
        { id: 'videoConference', name: 'Video Conference', icon: faVideoCamera },
        { id: 'scanner', name: 'Scanner', icon: faPrint },
        { id: 'airConditioning', name: 'Air Conditioning', icon: faSnowflake },
        { id: 'quietZones', name: 'Quiet Zones', icon: faVolumeXmark },
        { id: 'vendingMachines', name: 'Vending Machines', icon: faCoffee },
        { id: 'kitchenette', name: 'Kitchenette', icon: faUtensils },
        { id: 'parking', name: 'Parking', icon: faParking },
        { id: 'lockers', name: 'Lockers', icon: faLock },
        { id: 'chargingStations', name: 'Charging Stations', icon: faBolt },
    ];

    useEffect(() => {
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
        if (formData.pricePerDay <= 0) newErrors.pricePerDay = 'Price must be greater than 0';
        if (formData.spaceType.trim() === '') newErrors.spaceType = 'Space type is required';
        if (formData.description.trim() === '') newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setUploadedImages(imageUrls);
            setFormData({ ...formData, images: imageUrls });
            setErrors({ ...errors, images: undefined }); // Clear image error if any
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: id === 'seats' || id === 'pricePerDay' ? parseInt(value) : value });
        setErrors({ ...errors, [id]: undefined }); // Clear error for the field
    };

    const handleClearFields = () => {
        setFormData({
            name: '',
            address: '',
            seats: 1,
            pricePerDay: 1,
            spaceType: 'meetingRoom',
            description: '',
            images: [],
        });
        setUploadedImages([]);
        setErrors({});
        setSelectedServices([]); // Clear selected services
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted successfully:', { ...formData, selectedServices });
            onClose();
        }
    };

    const handleServiceToggle = (serviceId: string) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
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
                                            className="absolute inset-0 object-cover w-full h-full rounded-lg" />
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
                                                setFormData({ ...formData, images: [] });
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
                                        <FontAwesomeIcon icon={service.icon} />
                                        {service.name}
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
                                <div className="w-full flex flex-col">
                                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                                        Address
                                        {errors.address && <p className="text-red-500">{errors.address}</p>}
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                        placeholder="Enter space address" />
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
                                        {errors.pricePerDay && <p className="text-red-500">{errors.pricePerDay}</p>}
                                    </label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            id="pricePerDay"
                                            value={formData.pricePerDay}
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
                                    {errors.spaceType && <p className="text-red-500">{errors.spaceType}</p>}
                                </label>
                                <select
                                    id="spaceType"
                                    value={formData.spaceType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50">
                                    <option value="meetingRoom">Meeting Room</option>
                                    <option value="privateOffice">Private Office</option>
                                    <option value="commonArea">Common Area</option>
                                    <option value="outdoorSpace">Outdoor Space</option>
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