import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import React, { useState, useEffect } from 'react';

interface CalendarComponentProps {
    onDateSelection?: (selectedDates: Set<string>) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelection }) => {
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);

    const toggleDateSelection = (date: string) => {
        setSelectedDates((prev) => {
            const newDates = new Set(prev);
            if (newDates.has(date)) {
                newDates.delete(date);
            } else {
                newDates.add(date);
            }
            return newDates;
        });
    };

    useEffect(() => {
        if (onDateSelection) {
            onDateSelection(selectedDates);
        }
    }, [selectedDates, onDateSelection]);

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prevYear) => prevYear - 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prevYear) => prevYear + 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth + 1);
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="">
            <div className="flex justify-between items-center">
                <button onClick={handlePreviousMonth} className="aspect-square size-8 text-sm border-1 border-stone-900/10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className="text-lg font-bold">
                    {monthNames[currentMonth]} {currentYear}
                </div>
                <button onClick={handleNextMonth} className="aspect-square size-8 text-sm border-1 border-stone-900/10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            <div className="grid grid-cols-7">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => (
                    <div key={index} className="text-sm text-center font-bold py-2">
                        {dayName}
                    </div>
                ))}
                {days.map((day) => {
                    const date = `${currentYear}-${currentMonth + 1}-${day}`;
                    const isSelected = selectedDates.has(date);

                    return (
                        <button key={date} onClick={() => toggleDateSelection(date)}
                            className={`flex items-center justify-center h-10 w-10 transition



                                duration-500 hover:duration-150 delay-250 hover:delay-0
                                ${isSelected ? 'bg-west-side-500 text-stone-100 font-medium' : 'hover:bg-west-side-200 hover:text-west-side-900'}
                                ${[1].includes(day) ? 'rounded-tl-md' : ''}
                                ${[7].includes(day) ? 'rounded-tr-md' : ''}
                                ${[29].includes(day) ? 'rounded-bl-md' : ''}`}>
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarComponent;