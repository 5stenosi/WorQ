import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import React, { useState } from 'react';

const CalendarComponent: React.FC = () => {
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
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    return (
        <div className="p-2 bg-stone-200 rounded-2xl w-100">
            <div className="flex justify-between items-center mb-2">
                <button onClick={handlePreviousMonth} className="aspect-square size-10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className="text-lg font-bold">
                    {monthNames[currentMonth]} {currentYear}
                </div>
                <button onClick={handleNextMonth} className="aspect-square size-10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((dayName, index) => (
                    <div key={index} className="text-center font-bold">
                        {dayName}
                    </div>
                ))}
                {days.map((day) => {
                    const date = `${currentYear}-${currentMonth + 1}-${day}`;
                    const isSelected = selectedDates.has(date);

                    return (
                        <button key={date} onClick={() => toggleDateSelection(date)}
                            className={`flex items-center justify-center rounded-lg aspect-square hover:bg-blue-100
                                ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border-gray-300'}`}>
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarComponent;