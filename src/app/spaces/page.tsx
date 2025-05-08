'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HorizontalOptions from '@/components/HorizontalOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';

const Spaces = () => {
  const [searchText, setSearchText] = useState('');
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [selectedTypology, setSelectedTypology] = useState<string>('All Spaces');
  const [maxPrice, setMaxPrice] = useState<number>(300);

  interface Space {
    id: string;
    name: string;
    images: string[];
    address: {
      city: string;
      country: string;
    };
    avgRating: number;
    price: number;
  }

  const typologyMapping: Record<string, string> = {
    'All Spaces': '',
    'Meeting Rooms': 'MEETING_ROOMS',
    'Private Offices': 'PRIVATE_OFFICES',
    'Common Areas': 'COMMON_AREAS',
    'Outdoor Spaces': 'OUTDOOR_SPACES',
  };

  useEffect(() => {
    async function fetchSpaces() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        const backendTypology = typologyMapping[selectedTypology];
        if (backendTypology) {
          queryParams.append('typology', backendTypology);
        }
        if (searchText) {
          queryParams.append('q', searchText);
        }
        queryParams.append('maxPrice', maxPrice.toString());
        const res = await fetch(`/api/spaces?${queryParams.toString()}`);
        const data = await res.json();
        setSpaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Errore nella fetch GET:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSpaces();
  }, [selectedTypology, searchText, maxPrice]);

  return (
    <div id='home' className="overflow-y-auto">
      <section className="flex flex-col items-center pt-24">
        <div className='flex gap-5 mt-5'>
          {/* Filter by type + Searchbar */}
          <div className="bg-stone-300 p-2 rounded-3xl flex gap-3">
            <HorizontalOptions
              options={['All Spaces', 'Meeting Rooms', 'Private Offices', 'Common Areas', 'Outdoor Spaces']}
              initialSelected={0}
              backgroundColor="bg-stone-100"
              optionClassName="px-5 h-full flex justify-center items-center"
              containerClassName="bg-stone-300 rounded-2xl w-full overflow-hidden"
              onOptionSelect={(option) => setSelectedTypology(option)} />

            <div className={`${searchText ? 'w-80 pl-3' : 'w-12 hover:w-80 hover:pl-3 focus-within:pl-3 focus-within:w-80'} bg-stone-100 rounded-2xl flex transition-all duration-250`}>
              <input type="text" placeholder="Cerca..." id="search-bar" className="w-full outline-0" onChange={(e) => setSearchText(e.target.value)} />
              <button className="aspect-square size-12 text-2xl rounded-2xl">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>

          {/* Filter by price range (espandibile) */}
          <div className={`bg-stone-300 p-2 gap-0 hover:gap-2 focus-within:gap-2 rounded-3xl items-center flex transition-all duration-250 group`}>
            <div className="w-22 flex justify-center items-center bg-stone-100 text-stone-900 font-medium whitespace-nowrap rounded-2xl px-3 h-12">
              &#8804; {maxPrice}€
            </div>
            <div className='flex items-center h-full overflow-hidden'>
              <input
                type="range"
                id="price-range"
                min={spaces.length > 0 ? Math.min(...spaces.map(space => space.price)) : 0}
                max="300"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-0 group-hover:w-48 group-focus-within:w-48 transition-all duration-250"
              />
            </div>
          </div>
        </div>

        {
          loading && (
            <div className="h-[60vh] text-6xl flex justify-center items-center text-stone-500">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            </div>
          )
        }

        {/* Griglia Spazi */}
        <div className={`w-full px-20 py-10 grid grid-cols-4 gap-5 ${spaces.length === 0 ? 'h-screen' : ''}`}>

          {!loading && spaces.length === 0 && (
            <p className="text-center text-stone-500 col-span-4">
              No spaces available. Please try adjusting your search or typology filter.
            </p>
          )}

          {!loading && spaces.map((space) => (
            <Link href={`/spaces/${space.id}`} key={space.id}
              className='w-full h-100 bg-stone-100 col-span-1 overflow-hidden flex flex-col
                          rounded-4xl cursor-pointer shadow-sm hover:shadow-md 
                          hover:scale-105 active:scale-95 transition-all duration-150 ease-out'>
              <div className='h-1/2'>
                <Image src={space.images[0]} width={1000} height={1000} alt={space.name} className="w-full h-full object-cover" />
              </div>

              {/* Informazioni come titolo e location */}
              <div className='p-5'>
                <h3 className='font-bold text-xl'>{space.name}</h3>
                <p className='text-sm text-stone-500'>{space.address.city}, {space.address.country}</p>
              </div>

              {/* Stelle e prezzo in fondo */}
              <div className='p-5 mt-auto flex justify-between items-center'>
                <div className='flex items-center text-lg text-yellow-400'>
                  {[...Array(Math.floor(space.avgRating))].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                  {space.avgRating % 1 !== 0 && <FontAwesomeIcon icon={faStarHalf} />}
                </div>
                <p className='flex font-bold text-2xl'>{space.price}€<span className='text-base align-super'>/day</span></p>
              </div>
            </Link>
          ))}
        </div>
      </section >
    </div >
  );
};

export default Spaces;