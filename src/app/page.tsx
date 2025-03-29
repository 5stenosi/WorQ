'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HorizontalOptions from '@/components/HorizontalOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import WordSlider from '@/components/WordSlider';
import ObserverProvider from '@/components/ObserverProvider';

const HomePage = () => {
  const [searchText, setSearchText] = useState('');

  // OSSERVAZIONI
  // Come gestiamo i tag <h1>, <h2>, <h3> ecc.? Chiediamo a DeepSeek alla fine.
  // Facciamo i filtri sticky?
  // Per le animazioni le dobbiamo mettere solo per le persone che le vogliono vedere o per tutti?
  // Bisogna togliere i <br /> al testo nella prima schermata
  // Quando clicco un/a servizio/feature, devo essere reindirizzato alla sezione degli spazi e deve essere cercato nella navbar il servizio/feature corrispodente
  // Forse è meglio fare in alto a sinistra il carosello, sotto il carosello le recensioni, a destra un'unica sezione con info generali, servizi e sistema di prenotazione?

  return (
    <ObserverProvider>
      <div id='home' className="overflow-y-auto">
        {/* Landing Page */}
        <section className="h-screen w-full relative z-20">
          <img
            src="/spaceTypes/offices/office6-enhanced.png"
            alt="Landing Page"
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-stone-900/75 via-transparent via-60% to-transparent"></div>
          <div className="absolute flex flex-col gap-5 text-stone-100
                          justify-end items-start sm:text-start inset-5 sm:inset-10 xl:inset-20 transition-all duration-500 *:transition-all *:duration-500">
            {/* Titolo */}
            <h1 className='font-medium
                         text-4xl md:text-7xl w-full md:w-4/5 lg:w-3/5
                         intersect-once intersect:motion-preset-slide-right motion-duration-1000'>Locate A Cozy Workspace</h1>
            {/* Sottotitolo */}
            <p className='text-balance
                        text-base sm:text-lg w-full md:w-4/5 lg:w-3/5
                        intersect-once intersect:motion-preset-slide-right motion-duration-1000 motion-delay-500'>From cost savings to increased collaboration opportunities, coworking spaces can make for idea offices, especially for small and growing businesses.</p>
          </div>
        </section>

        {/* Bisogna creare un component, una funzione o prendere dal DB, è troppo grosso come blocco secondo me */}
        {/* Griglia Features */}
        <section className="w-full p-20 flex flex-col gap-20">

          <div className='flex flex-col gap-20 overflow-clip'>
            <h1 className='text-9xl font-bold
                     intersect-once intersect:motion-preset-slide-right-lg'>Key Services</h1>
            <p className='text-4xl font-medium w-2/3 pb-1
                    intersect-once intersect:motion-preset-slide-right-lg'>Discover the perfect workspace tailored to your needs by exploring our key services and amenities.</p>
          </div>

          <div className='w-full h-[300vh] grid grid-cols-10 grid-rows-14 gap-10 text-stone-100 *:rounded-3xl *:shadow-sm'>
            {/* Feature 1 */}
            <div className='w-full h-full col-span-6 row-span-4 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Desktop</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Work seamlessly with our ready-to-use desktop computers, equipped with the latest software.</p>
              </div>
              <img src="/features/desktop/desktop3.jpg" alt="desktop" className="w-full h-full object-cover group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 2 */}
            <div className='w-full h-full col-span-4 row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>WiFi</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Enjoy a fast and reliable WiFi connection to stay connected and productive throughout your day.</p>
              </div>
              <img src="/features/wifi/wifi2.png" alt="wifi" className="w-full h-full object-cover object-[0%_85%] group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 3 */}
            <div className='w-full h-full col-span-4 row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Stationery</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Access all the stationery supplies you need, from pens to notebooks, to support your work and creativity.</p>
              </div>
              <img src="/features/stationery/stationery4.jpg" alt="stationery" className="w-full h-full object-cover object-top group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 4 */}
            <div className='w-full h-full col-span-5 row-span-3 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Disability Access</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Enjoy accessible facilities designed to accommodate people with disabilities, ensuring inclusivity for everyone.</p>
              </div>
              <img src="/features/disability/disability3.jpg" alt="disability access" className="w-full h-full object-cover object-bottom group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 5 */}
            <div className='w-full h-full col-span-5 row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Printer</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Take advantage of high-quality printers for all your printing needs, whether for documents or presentations.</p>
              </div>
              <img src="/features/printer/printer1.jpg" alt="Gabibbo" className="w-full h-full object-cover object-top group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 6 */}
            <div className='w-full h-full col-span-5 row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Projector</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Deliver professional presentations with our high-performance projectors, perfect for meetings and events.</p>
              </div>
              <img src="/features/projector/projector1.jpg" alt="projector" className="w-full h-full object-cover group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 7 */}
            <div className='w-full h-full col-span-5 row-span-3 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Catering</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Enhance your events and meetings with our premium catering services, offering a variety of delicious options.</p>
              </div>
              <img src="/features/catering/catering5.png" alt="catering" className="w-full h-full object-cover group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 8 */}
            <div className='w-full h-full col-span-5 row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Child-friendly</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Relax in our child-friendly areas, providing a safe and engaging environment for families with children.</p>
              </div>
              <img src="/features/kids/kids4.jpg" alt="kids" className="w-full h-full object-cover object-right-bottom group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 9 */}
            <div className='w-full h-full col-span-4 row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Pet-friendly</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Bring your furry friends along to our pet-friendly spaces, designed for comfort and convenience.</p>
              </div>
              <img src="/features/pets/pets2.jpg" alt="pets" className="w-full h-full object-cover object-bottom -scale-x-100 group-hover:-scale-x-125 group-hover:scale-y-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 10 */}
            <div className='w-full h-full col-span-3 row-span-4 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>White-board</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Collaborate and brainstorm effectively using our spacious and versatile whiteboards.</p>
              </div>
              <img src="/features/whiteboard/whiteboard3.png" alt="whiteboard" className="w-full h-full object-cover object-right group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 11 */}
            <div className='w-full h-full col-span-3 row-span-4 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Video conference</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Host virtual meetings with confidence using our top-tier video conferencing equipment.</p>
              </div>
              <img src="/features/videoConference/videoConference3.png" alt="video conference" className="w-full h-full object-cover object-right group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Feature 12 */}
            <div className='w-full h-full col-span-4 row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Scanner</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Easily digitize your documents with our modern and efficient scanners.</p>
              </div>
              <img src="/features/printer/printer2.jpeg" alt="Gabibbo" className="w-full h-full object-cover object-bottom group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
          </div>
        </section>

        {/* Griglia Spazi */}
        <section className="flex flex-col items-center">

          <WordSlider />

          <div className="bg-stone-300 p-2 mt-10 rounded-3xl flex gap-3">
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

          <div className='w-full px-20 py-10 grid grid-cols-4 gap-5 *:rounded-4xl *:cursor-pointer
                          *:hover:scale-105 *:transition-all'>
            {Array.from({ length: 25 }).map((_, index) => (
              <Link href="/spazio_nel_dettaglio" key={index} className='w-full h-100 bg-stone-100 col-span-1 overflow-hidden flex flex-col'>
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
    </ObserverProvider>
  );
};

export default HomePage;