import { useState } from 'react';

interface HorizontalOptionsProps {
    options: string[]; // Array di opzioni
    initialSelected?: number; // Opzione inizialmente selezionata (opzionale)
    backgroundColor?: string; // Colore di sfondo del rettangolo (opzionale)
    optionClassName?: string; // Classe personalizzata per le opzioni (opzionale)
    containerClassName?: string; // Classe personalizzata per il contenitore (opzionale)
}

const HorizontalOptions: React.FC<HorizontalOptionsProps> = ({
    options,
    initialSelected = 0,
    backgroundColor = 'bg-white',
    optionClassName = '',
    containerClassName = '',
}) => {
    const [selectedOption, setSelectedOption] = useState<number>(initialSelected);

    return (
        <div className={`relative grid grid-cols-5 items-center ${containerClassName}`}> {/* Usa grid con 4 colonne */}
            {/* Rettangolo colorato che si sposta */}
            <div
                className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-500 ${backgroundColor}`}
                style={{
                    width: `${100 / options.length}%`,
                    transform: `translateX(${selectedOption * 100}%)`,
                }}
            ></div>

            {/* Opzioni */}
            {options.map((option, index) => (
                <div
                    key={index}
                    className={`relative text-center cursor-pointer z-10 whites ce-nowrap ${optionClassName}`}
                    onClick={() => setSelectedOption(index)}>
                    {option}
                </div>
            ))}
        </div>
    );
};

export default HorizontalOptions;