'use client';

// import ScrollMovingElement from "@/components/ScrollMovingElement";
import HorizontalOptions from '../../components/HorizontalOptions';

export default function Home() {

  return (
    <div className="flex flex-col items-center">
      {/* Navbar */}
      <nav className="z-50 w-full px-16 pt-5 pb-10 flex justify-between items-center fixed">
        <button className="bg-stone-100 px-6 py-2 rounded-full">Menu</button>
        <h3>⚙️WorQ</h3>
        <button className="bg-stone-900 text-stone-100 px-6 py-2 rounded-full">Login</button>
      </nav>

      {/* Header e immagine */}
      <div className="flex flex-col items-center">
        {/* Testo */}
        {/* <h2 className="relative top-24 text-xl">Unforgettable stays await on</h2> */}
        <h1 className="relative text-[18rem]">dream stay</h1>
        {/* Rettangolo immagine */}
        <div className="relative w-full -top-34 rounded-[4rem] backdrop-blur-sm h-100 overflow-hidden">

          {/* Search bar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2/3 p-2 pl-6 rounded-3xl flex justify-between items-center bg-stone-100/75 backdrop-blur-sm z-10">
            <div className="flex flex-col">
              <p className="text-sm text-stone-500">🗺️ City or Destination</p>
              <p className="font-medium">Oxford, Great Britain</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-stone-500">📅 Booking Dates</p>
              <p className="font-medium">29 Oct 24-30 Oct 24</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-stone-500">🙍🏻 Guest & Rooms</p>
              <p className="font-medium">2 Adults, 1 Room</p>
            </div>
            <button className="aspect-square size-16 rounded-2xl bg-stone-100 text-2xl">
              🔎
            </button>
          </div>

          <img src="/GreenWall_bottom.png" alt="Green Wall" className="absolute top-0 left-0 w-full h-full object-cover opacity-80 -z-10" />
          <img src="/GreenWall_upper.png" alt="Green Wall" className="absolute top-0 left-0 w-full h-full object-cover -z-10" />
        </div>
      </div>

      {/* Roba di sezioni */}
      <h2 className='font-bold text-2xl mb-10'>Seamless travel & experiences</h2>
      <div className="bg-stone-300 p-2 rounded-3xl flex gap-3">
        <HorizontalOptions
          options={['Meeting Rooms', 'Private Offices', 'Study Rooms', 'Outdoor Spaces']}
          initialSelected={1}
          backgroundColor='bg-stone-100'
          optionClassName='px-5'
          containerClassName='bg-stone-300 rounded-2xl w-full overflow-hidden' />
        <div className='w-80 bg-stone-100 rounded-2xl flex'>
          <input type="text" name="" id="" className="w-full px-3 outline-0" />
          <button className='aspect-square ml-auto size-14 bg-stone-100 text-2xl'>🔎</button>
        </div>
      </div>

      {/* Griglia spazi */}
      <div className='w-full px-20 grid grid-cols-4 gap-2 mt-10 *:rounded-4xl *:cursor-pointer'>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className='w-full h-100 bg-stone-100 col-span-1 overflow-hidden flex flex-col'>
            <div className='h-1/2'>
              <img src="/GreenWall.jpg" alt="Green Wall" className="w-full h-full object-cover" />
            </div>

            {/* Informazioni come titolo e location */}
            <div className='p-5'>
              <h3 className='font-bold text-xl'>Oxford Artisan</h3>
              <p className='text-sm text-stone-500'>Location, Country</p>
            </div>

            {/* Stelle e prezzo in fondo */}
            <div className='p-5 mt-auto flex justify-between items-end'>
              <div className='flex items-center'>⭐⭐⭐⭐⭐</div>
              <p className='font-bold text-4xl'>120€</p>
            </div>
          </div>
        ))}
      </div>






    </div>
  );
}
