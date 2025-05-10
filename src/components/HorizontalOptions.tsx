'use client';

import { useState } from 'react';

interface HorizontalOptionsProps {
    options: string[];
    initialSelected?: number;
    backgroundColor?: string;
    optionClassName?: string;
    containerClassName?: string;
    layout?: 'row' | 'grid';
    onOptionSelect?: (selectedOption: string) => void;
}

const HorizontalOptions: React.FC<HorizontalOptionsProps> = ({
    options,
    initialSelected = 0,
    backgroundColor = 'bg-stone-100',
    optionClassName = '',
    containerClassName = '',
    layout = 'row',
    onOptionSelect,
}) => {
    const [selectedOption, setSelectedOption] = useState<number>(initialSelected);

    const handleOptionClick = (index: number) => {
        setSelectedOption(index);
        if (onOptionSelect) {
            onOptionSelect(options[index]);
        }
    };

    const getRowRectangleStyle = () => ({
        width: `${100 / options.length}%`,
        transform: `translateX(${selectedOption * 100}%)`,
    });

    const getGridRectangleStyle = () => {
        let column = selectedOption % 3;
        let row = Math.floor(selectedOption / 3);

        if (selectedOption === 0) {
            column = 0;
            row = 0;
        } else if (selectedOption === 1) {
            column = 1;
            row = 0;
        } else if (selectedOption === 2) {
            column = 2;
            row = 0;
        } else if (selectedOption === 3) {
            column = 1;
            row = 1;
        } else if (selectedOption === 4) {
            column = 2;
            row = 1;
        }

        return {
            width: '33.33%',
            height: selectedOption === 0 ? '100%' : '50%',
            transform: `translate(${column * 100}%, ${row * 100}%)`,
        };
    };

    if (layout === 'row') {
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
                        className={`relative text-center cursor-pointer z-10 ${optionClassName}`}
                        onClick={() => handleOptionClick(index)}>
                        {option}
                    </div>
                ))}
            </div>
        );
    }

    if (layout === 'grid') {
        return (
            <div className={`relative grid grid-cols-3 grid-rows-2 gap-2 items-center ${containerClassName}`}>
                <div
                    className={`absolute top-0 left-0 rounded-2xl transition-all duration-500 ${backgroundColor}`}
                    style={getGridRectangleStyle()}
                ></div>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`relative text-center cursor-pointer z-10 ${optionClassName} 
                        ${index === 0 ? 'row-span-2' : ''}`}
                        onClick={() => handleOptionClick(index)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default HorizontalOptions;