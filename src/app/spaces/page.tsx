'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HorizontalOptions from '@/components/HorizontalOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';

const Spaces = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <div id='home' className="overflow-y-auto">
      <section className="flex flex-col items-center pt-24">
        {/* <WordSlider /> */}

        <div className="bg-stone-300 p-2 mt-5 rounded-3xl flex gap-3">
          <HorizontalOptions
            options={['All Spaces', 'Meeting Rooms', 'Private Offices', 'Study Rooms', 'Outdoor Spaces']}
            initialSelected={0}
            backgroundColor="bg-stone-100"
            optionClassName="px-5 h-full flex justify-center items-center"
            containerClassName="bg-stone-300 rounded-2xl w-full overflow-hidden" />

          <div className={`${searchText ? 'w-80 pl-3' : 'w-12 hover:w-80 hover:pl-3 focus-within:pl-3 focus-within:w-80'} bg-stone-100 rounded-2xl flex transition-all duration-250`}>
            <input type="text" placeholder="Cerca..." id="search-bar" className="w-full outline-0" onChange={(e) => setSearchText(e.target.value)} />
            <button className="aspect-square size-12 text-2xl rounded-2xl">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>

        {/* Griglia Spazi */}
        <div className='w-full px-20 py-10 grid grid-cols-4 gap-5'>
          {Array.from({ length: 25 }).map((_, index) => (
            <Link href="/spazioNelDettaglio" key={index} className='w-full h-100 bg-stone-100 col-span-1 overflow-hidden flex flex-col
                                                                    rounded-4xl cursor-pointer shadow-sm hover:shadow-md hover:scale-105 transition-all'>
              <div className='h-1/2'>
                <img src="/spaceTypes/offices/office2-enhanced.png" alt="example image" className="w-full h-full object-cover" />
              </div>

              {/* Informazioni come titolo e location */}
              <div className='p-5'>
                <h3 className='font-bold text-xl'>Oxford Artisan</h3>
                <p className='text-sm text-stone-500'>Location, Country</p>
              </div>

              {/* Stelle e prezzo in fondo */}
              <div className='p-5 mt-auto flex justify-between items-center'>
                <div className='flex items-center text-lg text-yellow-400'>
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStarHalf} />
                </div>
                <p className='flex font-bold text-2xl'>120€<span className='text-base align-super'>/day</span></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Spaces;