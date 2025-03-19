export default function Profile() {

    return (
        <div className="flex flex-col items-center">
            <div className="w-full h-screen pt-28 pb-10 grid grid-cols-4 grid-rows-2 gap-5">
                <div className="w-full h-full p-5 rounded-4xl bg-stone-100 col-span-2 row-span-2 overflow-hidden
                                shadow-sm">

                </div>
                <div className="w-full h-full p-5 rounded-4xl bg-stone-100 col-span-2 row-span-1 overflow-hidden shadow-sm">
                    <div className="flex flex-col justify-between h-full gap-3">
                        {/* Zona sopra */}
                        <div className="flex justify-between items-start">
                            {/* Sinistra */}
                            <h3 className="font-bold text-xl">Valuta</h3>
                            {/* Destra */}
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-xl">1.240</h3>
                                <img src="/Icon_VBucks.png" alt="Icona Valuta" className="size-8" />
                            </div>
                        </div>

                        {/* Transazioni */}
                        <div className="flex flex-col overflow-y-auto max-h-40 flex-grow gap-1">
                            {Array(20).fill(null).map((_, index) => (
                                <div key={index} className="flex justify-between items-center pr-2">
                                    <span>Transazione</span>
                                    <span className="text-sm text-gray-500">01/01/2023</span>
                                </div>
                            ))}
                        </div>

                        {/* Zona sotto */}
                        <div className="flex justify-between items-center mt-auto">
                            <button className="bg-stone-900 text-stone-100 px-4 py-2 rounded motion-scale-in-110 hover:motion-scale-out-110">Carica valuta</button>
                            <button className="bg-stone-900 text-stone-100 px-4 py-2 rounded motion-scale-in-110 hover:motion-scale-out-110">Trasferisci</button>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full p-5 rounded-4xl bg-stone-100 col-span-2 row-span-1 overflow-hidden
                                shadow-sm">

                </div>
            </div>





        </div>
    );
}