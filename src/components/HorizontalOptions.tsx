'use client';

import { useState } from 'react';

// Props for the HorizontalOptions component
interface HorizontalOptionsProps {
    options: string[]; // List of option labels
    initialSelected?: number; // Index of initially selected option
    backgroundColor?: string; // Background color for the moving rectangle
    optionClassName?: string; // Additional class for each option
    containerClassName?: string; // Additional class for the container
    layout?: 'row' | 'grid'; // Layout type: row or grid
    onOptionSelect?: (selectedOption: string) => void; // Callback when an option is selected
}

// HorizontalOptions component for displaying selectable options in a row or grid
const HorizontalOptions: React.FC<HorizontalOptionsProps> = ({
    options,
    initialSelected = 0,
    backgroundColor = 'bg-stone-100',
    optionClassName = '',
    containerClassName = '',
    layout = 'row',
    onOptionSelect,
}) => {
    // State for the currently selected option index
    const [selectedOption, setSelectedOption] = useState<number>(initialSelected);

    // Handles click on an option
    const handleOptionClick = (index: number) => {
        setSelectedOption(index);
        if (onOptionSelect) {
            onOptionSelect(options[index]);
        }
    };

    // Style for the moving rectangle in row layout
    const getRowRectangleStyle = () => ({
        width: `${100 / options.length}%`,
        transform: `translateX(${selectedOption * 100}%)`,
    });

    // Style for the moving rectangle in grid layout
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

    // Render row layout
    if (layout === 'row') {
        return (
            <div className={`relative grid grid-cols-5 items-center ${containerClassName}`}> {/* Uses grid with 5 columns */}
                {/* Colored rectangle that moves under the selected option */}
                <div
                    className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-500 ${backgroundColor}`}
                    style={{
                        width: `${100 / options.length}%`,
                        transform: `translateX(${selectedOption * 100}%)`,
                    }}
                ></div>

                {/* Option labels */}
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

    // Render grid layout
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

    // Fallback if layout is not recognized
    return null;
};

export default HorizontalOptions;