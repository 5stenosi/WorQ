'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
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

  return (
    <ObserverProvider>
      <div id='home' className="overflow-y-auto">
        {/* Landing Page */}
        <section className="h-screen w-full relative z-20">
          <Image
            src="/spaceTypes/offices/office6-enhanced.png"
            alt="Landing Page"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-900/75 to-80% sm:to-60% to-transparent"></div>
          <div className="absolute flex flex-col gap-5 text-stone-100
                          justify-end items-start sm:text-start inset-5 sm:inset-10 md:inset-15 lg:inset-20 mb-5 sm:mb-0">
            {/* Titolo */}
            <h1 className='font-medium text-balance
                         text-4xl md:text-6xl w-full md:w-1/2 text-center sm:text-start'>Locate A Cozy Workspace</h1>
            {/* Sottotitolo */}
            <p className='text-balance text-base sm:text-lg md:text-xl w-full md:w-4/5 text-center sm:text-start
                        md:motion-preset-slide-right md:motion-duration-300 md:motion-delay-300'>From cost savings to increased collaboration opportunities, coworking spaces can make for idea offices, especially for small and growing businesses.</p>
          </div>
        </section>

        {/* Griglia Features/Services */}
        <section className="w-full flex flex-col
                            mt-5 p-5 sm:p-10 md:p-15 lg:p-20 gap-5 sm:gap-10 md:gap-15 lg:gap-20">
          <div className='flex flex-col gap-5 md:gap-20 overflow-clip'>
            <h2 className='text-center sm:text-start text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold
                          intersect-once intersect:motion-preset-slide-right-lg motion-duration-300'>Key <span className='underline decoration-west-side-500'>Services</span></h2>
            <p className='text-balance text-center sm:text-start text-base sm:text-xl md:text-3xl lg:text-4xl font-medium w-full lg:w-2/3
                          intersect-once intersect:motion-preset-slide-right-lg motion-duration-300 pb-1'>Discover the perfect workspace tailored to your needs by exploring our key services and amenities.</p>
          </div>

          {/* Griglia Features */}
          <div className='w-full h-[130rem] text-stone-100 *:rounded-3xl *:transition-all *:shadow-sm *:hover:shadow-lg *:hover:scale-105
                          lg:grid lg:grid-cols-10 lg:grid-rows-14 flex flex-col
                          gap-5 lg:gap-10'>
            {/* Feature 1 */}
            <div className='w-full h-full sm:col-span-6 sm:row-span-4 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Desktop</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Work seamlessly with our ready-to-use desktop computers, equipped with the latest software.</p>
              </div>
              <Image
                src="/features/desktop/desktop3.jpg"
                alt="desktop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 2 */}
            <div className='w-full h-full sm:col-span-4 sm:row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>WiFi</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Enjoy a fast and reliable WiFi connection to stay connected and productive throughout your day.</p>
              </div>
              <Image
                src="/features/wifi/wifi2.png"
                alt="wifi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-[0%_85%] group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 3 */}
            <div className='w-full h-full sm:col-span-4 sm:row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Stationery</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Access all the stationery supplies you need, from pens to notebooks, to support your work and creativity.</p>
              </div>
              <Image
                src="/features/stationery/stationery4.jpg"
                alt="stationery"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover origin-bottom object-top group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 4 */}
            <div className='w-full h-full sm:col-span-5 sm:row-span-3 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Disability Access</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Enjoy accessible facilities designed to accommodate people with disabilities, ensuring inclusivity for everyone.</p>
              </div>
              <Image
                src="/features/disability/disability3.jpg"
                alt="disability access"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-bottom group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 5 */}
            <div className='w-full h-full sm:col-span-5 sm:row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Printer</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Take advantage of high-quality printers for all your printing needs, whether for documents or presentations.</p>
              </div>
              <Image
                src="/features/printer/printer1.jpg"
                alt="printer"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-top origin-bottom group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 6 */}
            <div className='w-full h-full sm:col-span-5 sm:row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Projector</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Deliver professional presentations with our high-performance projectors, perfect for meetings and events.</p>
              </div>
              <Image
                src="/features/projector/projector1.jpg"
                alt="projector"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover origin-left group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 7 */}
            <div className='w-full h-full sm:col-span-5 sm:row-span-3 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Catering</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Enhance your events and meetings with our premium catering services, offering a variety of delicious options.</p>
              </div>
              <Image
                src="/features/catering/catering5.png"
                alt="catering"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 8 */}
            <div className='w-full h-full sm:col-span-5 sm:row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Child-friendly</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Relax in our child-friendly areas, providing a safe and engaging environment for families with children.</p>
              </div>
              <Image
                src="/features/kids/kids4.jpg"
                alt="kids"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-right-bottom origin-bottom group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 9 */}
            <div className='w-full h-full sm:col-span-4 sm:row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Pet-friendly</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Bring your furry friends along to our pet-friendly spaces, designed for comfort and convenience.</p>
              </div>
              <Image
                src="/features/pets/pets2.jpg"
                alt="pets"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-bottom -scale-x-100 group-hover:-scale-x-125 group-hover:scale-y-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 10 */}
            <div className='w-full h-full sm:col-span-3 sm:row-span-4 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>White-board</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Collaborate and brainstorm effectively using our spacious and versatile whiteboards.</p>
              </div>
              <Image
                src="/features/whiteboard/whiteboard3.png"
                alt="whiteboard"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-right origin-bottom-right group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 11 */}
            <div className='w-full h-full sm:col-span-3 sm:row-span-4 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Video conference</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Host virtual meetings with confidence using our top-tier video conferencing equipment.</p>
              </div>
              <Image
                src="/features/videoConference/videoConference3.png"
                alt="video conference"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-right origin-right group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Feature 12 */}
            <div className='w-full h-full sm:col-span-4 sm:row-span-2 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Scanner</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Easily digitize your documents with our modern and efficient scanners.</p>
              </div>
              <Image
                src="/features/printer/printer2.jpeg"
                alt="scanner"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-bottom origin-bottom-right group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
          </div>
        </section>

        {/* Slider Reviews */}
        <section className="w-full flex justify-center items-center mt-10">
          <ReviewCarousel />
        </section>

        {/* Griglia SpaceTypes */}
        <section className="w-full flex flex-col
                            mt-5 p-5 sm:p-10 md:p-15 lg:p-20 gap-5 sm:gap-10 md:gap-15 lg:gap-20">
          <div className='flex flex-col gap-5 md:gap-20 overflow-clip'>
            <h2 className='text-center sm:text-start text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold
                           intersect-once intersect:motion-preset-slide-right-lg motion-duration-300'>Space <span className='underline decoration-west-side-500'>Types</span></h2>
            <p className='text-balance text-center sm:text-start text-base sm:text-xl md:text-3xl lg:text-4xl  font-medium w-full lg:w-2/3
                          intersect-once intersect:motion-preset-slide-right-lg motion-duration-300 pb-1'>Explore our diverse spaces to find the ideal environment for your work, meetings, or events.</p>
          </div>

          {/* Griglia Space Types */}
          <div className='w-full h-[45rem] text-stone-100 *:rounded-3xl *:transition-all *:shadow-sm *:hover:shadow-lg *:hover:scale-105
                          lg:grid lg:grid-cols-11 lg:grid-rows-2 lg:gap-10 flex flex-col gap-5'>
            {/* Meeting Rooms */}
            <div className='w-full h-full sm:col-span-6 sm:row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
                               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Meeting Rooms</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
                              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Find the perfect space for your meetings, equipped with all the necessary amenities.</p>
              </div>
              <Image
                src="/spaceTypes/meetingRooms/meetingRoom4.jpg"
                alt="meeting rooms"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover origin-bottom-right group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Private Offices */}
            <div className='w-full h-full sm:col-span-5 sm:row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Private Offices</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Enjoy a quiet and private workspace tailored to your professional needs.</p>
              </div>
              <Image
                src="/spaceTypes/offices/office9.jpg"
                alt="private offices"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover origin-left group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Common Areas */}
            <div className='w-full h-full sm:col-span-5 sm:row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Common Areas</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
              md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Relax or collaborate in our shared spaces designed for comfort and productivity.</p>
              </div>
              <Image
                src="/spaceTypes/offices/office8.jpg"
                alt="common areas"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
            {/* Outdoor Spaces */}
            <div className='w-full h-full sm:col-span-6 sm:row-span-1 overflow-hidden relative group
              intersect:motion-preset-slide-right-lg lg:intersect:motion-preset-slide-up-lg motion-duration-500 intersect-once'>
              <div className='absolute flex flex-col justify-end gap-5 z-10 inset-10'>
                <h3 className='font-bold text-center lg:text-start
                               md:translate-y-[150%] md:group-hover:translate-y-[150%] lg:group-hover:translate-y-0 md:group-hover:-translate-x-[35%] lg:group-hover:translate-x-0
                               text-2xl sm:text-3xl lg:text-6xl
               lg:translate-y-full group-hover:translate-y-0 transition ease-out duration-300'>Outdoor Spaces</h3>
                <p className='w-3/4 text-balance hidden md:block
                              md:translate-x-[50%] lg:translate-x-0
                md:translate-y-[250%] lg:translate-y-[200%] group-hover:-translate-y-0 transition ease-out duration-300 delay-0 group-hover:delay-100'>Relax or work in our outdoor areas, designed to inspire creativity and provide a serene environment.
                </p>
              </div>
              <Image
                src="/spaceTypes/offices/office7.jpg"
                alt="outdoor spaces"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="w-full h-full object-cover object-bottom origin-left group-hover:scale-125 transition duration-300 group-hover:duration-3000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 from-30% to-transparent group-hover:from-stone-900/75 transition duration-300"></div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section id='map-section' className="w-full flex flex-col
                     h-[45rem] lg:h-[65rem]
                     mt-5 p-5 sm:p-10 md:p-15 lg:p-20 pb-5 sm:pb-5 md:pb-5 lg:pb-5 gap-5 sm:gap-10 md:gap-15 lg:gap-20">
          <div className='flex flex-col gap-5 md:gap-20 overflow-clip'>
            <h3 className='text-center sm:text-start text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold
                           intersect-once md:intersect:motion-preset-slide-right-lg md:motion-duration-300'>
              <span className='underline decoration-west-side-500'>Find</span> your Space
            </h3>
            <p className='text-balance text-center sm:text-start text-base sm:text-xl md:text-3xl lg:text-4xl font-medium w-full lg:w-2/3
                          intersect-once md:intersect:motion-preset-slide-right-lg md:motion-duration-300 pb-1'>
              Locate our coworking spaces easily with the interactive map below.
            </p>
          </div>

          <div className='w-full h-full intersect:motion-preset-focus-lg motion-duration-300 intersect-once'>
            <MapComponent />
          </div>
        </section>
      </div>
    </ObserverProvider >
  );
};

export default HomePage;