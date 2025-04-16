'use client';

import React, { useEffect } from 'react';
import ReviewCarousel from '@/components/ReviewCarousel';
import MapComponent from '@/components/MapComponent';
import ObserverProvider from '@/components/ObserverProvider';

const HomePage = () => {

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const scrollTo = params.get("scrollTo");
      if (scrollTo) {
        const targetElement = document.getElementById(scrollTo);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }
    }
  }, []);

  // OSSERVAZIONI
  // Come gestiamo i tag <h1>, <h2>, <h3> ecc.? Chiediamo a DeepSeek alla fine.
  // Facciamo i filtri sticky?

  // Bisogna creare un component, una funzione o prendere dal DB, è troppo grosso come blocco secondo me

  // Per le animazioni le dobbiamo mettere solo per le persone che le vogliono vedere o per tutti?
  // Bisogna togliere i <br /> al testo nella prima schermata
  // Quando clicco un/a servizio/feature, devo essere reindirizzato alla sezione degli spazi e deve essere cercato nella barra di ricerca il servizio/feature corrispodente
  // Quando clicco la categoria/tipologia di uno spazio, devo essere reindirizzato alla sezione degli spazi e deve essere cercato nella barra di ricerca la categoria/tipologia corrispondente
  // Scegliere la skin per la mappa e i marker
  // Facciamo che cliccando una qualsiasi location, vieni reindirizzato alla sezione della mappa nella home con la location dello spazio nella mappa?

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
                          justify-end items-start sm:text-start inset-5 sm:inset-10 xl:inset-20">
            {/* Titolo */}
            <h1 className='font-medium
                         text-4xl md:text-7xl w-full md:w-4/5 lg:w-3/5 text-center sm:text-start
                         intersect-once intersect:motion-preset-slide-right motion-duration-1000'>Locate A Cozy Workspace</h1>
            {/* Sottotitolo */}
            <p className='text-balance
                        text-base sm:text-lg w-full md:w-4/5 lg:w-3/5 text-center sm:text-start
                        intersect-once intersect:motion-preset-slide-right motion-duration-1000 motion-delay-500'>From cost savings to increased collaboration opportunities, coworking spaces can make for idea offices, especially for small and growing businesses.</p>
          </div>
        </section>

        {/* Griglia Features/Services */}
        <section className="w-full p-5 md:p-20 flex flex-col mt-10 md:mt-0 gap-20">

          <div className='flex flex-col gap-5 md:gap-20 overflow-clip'>
            <h1 className='text-center sm:text-start text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold
                     intersect-once intersect:motion-preset-slide-right-lg'>Key Services</h1>
            <p className='text-center sm:text-start text-lg lg:text-4xl font-medium w-full lg:w-2/3 pb-1
                    intersect-once intersect:motion-preset-slide-right-lg'>Discover the perfect workspace tailored to your needs by exploring our key services and amenities.</p>
          </div>

          <div className='w-full h-[300vh] grid grid-cols-10 grid-rows-14 gap-10 text-stone-100 *:rounded-3xl *:transition-shadow *:shadow-sm *:hover:shadow-md'>
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
              <img src="/features/stationery/stationery4.jpg" alt="stationery" className="w-full h-full object-cover origin-bottom object-top group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
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
              <img src="/features/printer/printer1.jpg" alt="Gabibbo" className="w-full h-full object-cover object-top origin-bottom group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
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
              <img src="/features/projector/projector1.jpg" alt="projector" className="w-full h-full object-cover origin-left group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
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
              <img src="/features/kids/kids4.jpg" alt="kids" className="w-full h-full object-cover object-right-bottom origin-bottom group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
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
              <img src="/features/whiteboard/whiteboard3.png" alt="whiteboard" className="w-full h-full object-cover object-right origin-bottom-right group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
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
              <img src="/features/videoConference/videoConference3.png" alt="video conference" className="w-full h-full object-cover object-right origin-right group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
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
              <img src="/features/printer/printer2.jpeg" alt="Gabibbo" className="w-full h-full object-cover object-bottom origin-bottom-right group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
          </div>
        </section>

        {/* Slider Reviews */}
        <section className="w-full flex justify-center items-center mt-10">
          <ReviewCarousel />
        </section>

        {/* Griglia SpaceTypes */}
        <section className="w-full p-5 md:p-20 flex flex-col mt-10 md:mt-0 gap-20">

          <div className='flex flex-col gap-5 md:gap-20 overflow-clip'>
            <h1 className='text-center sm:text-start text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold
                     intersect-once intersect:motion-preset-slide-right-lg'>Space Types</h1>
            <p className='text-center sm:text-start text-lg lg:text-4xl font-medium w-full lg:w-2/3 pb-1
                intersect-once intersect:motion-preset-slide-right-lg'>Explore our diverse spaces to find the ideal environment for your work, meetings, or events.</p>
          </div>

          <div className='w-full h-screen grid grid-cols-11 grid-rows-2 gap-10 text-stone-100 *:rounded-3xl *:transition-shadow *:shadow-sm *:hover:shadow-md'>
            {/* Meeting Rooms */}
            <div className='w-full h-full col-span-6 row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Meeting Rooms</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Find the perfect space for your meetings, equipped with all the necessary amenities.</p>
              </div>
              <img src="/spaceTypes/meetingRooms/meetingRoom4.jpg" alt="meeting rooms" className="w-full h-full object-cover origin-bottom-right group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Private Offices */}
            <div className='w-full h-full col-span-5 row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Private Offices</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Enjoy a quiet and private workspace tailored to your professional needs.</p>
              </div>
              <img src="/spaceTypes/offices/office9.jpg" alt="private offices" className="w-full h-full object-cover origin-left group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Common Areas */}
            <div className='w-full h-full col-span-5 row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Common Areas</h1>
                <p className='w-3/4 text-balance
              translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Relax or collaborate in our shared spaces designed for comfort and productivity.</p>
              </div>
              <img src="/spaceTypes/offices/office8.jpg" alt="common areas" className="w-full h-full object-cover group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
            {/* Outdoor Spaces */}
            <div className='w-full h-full col-span-6 row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-up-lg intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h1 className='text-6xl font-bold
               translate-y-full group-hover:translate-y-0 transition ease-out duration-1000'>Outdoor Spaces</h1>
                <p className='w-3/4 text-balance
                translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-1000 delay-0 group-hover:delay-100'>Relax or work in our outdoor areas, designed to inspire creativity and provide a serene environment.
                </p>
              </div>
              <img src="/spaceTypes/offices/office7.jpg" alt="outdoor spaces" className="w-full h-full object-cover object-bottom origin-left group-hover:scale-125 transition duration-1000 group-hover:duration-10000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 group-hover:from-stone-900 to-transparent transition duration-500"></div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section id='map-section' className="w-full h-[140vh] flex flex-col gap-20
                                             p-5 md:px-20 md:pb-20 md:pt-0
                                             mt-10 md:mt-0">
          <div className='flex flex-col gap-5 md:gap-20 overflow-clip'>
            <h1 className='text-center sm:text-start text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold
                           intersect-once intersect:motion-preset-slide-right-lg'>Find your Space</h1>
            <p className='text-center text-balance sm:text-start text-lg lg:text-4xl font-medium w-full lg:w-2/3 pb-1
                          intersect-once intersect:motion-preset-slide-right-lg'>Locate our coworking spaces easily with the interactive map below.</p>
          </div>

          <MapComponent />
        </section>
      </div >
    </ObserverProvider >
  );
};

export default HomePage;