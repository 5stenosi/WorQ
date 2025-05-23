import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import React, { useState, useEffect, useRef } from 'react';

interface CalendarComponentProps {
    onDateSelection?: (selectedDates: Set<string>) => void;
    spaceId: string;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelection, spaceId }) => {
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [snake, setSnake] = useState<boolean>(false);
    const [arrowSequence, setArrowSequence] = useState<string[]>([]);
    const snakeRef = useRef<HTMLDivElement | null>(null);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);
    const columns = 7;

    const getLeadingEmptyDays = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        return (firstDay + 6) % 7; // Shift: Monday = 0
    };

    const toggleDateSelection = (date: string) => {
        setSelectedDates((prev) => {
            const newDates = new Set(prev);
            if (newDates.has(date)) newDates.delete(date);
            else newDates.add(date);
            return newDates;
        });
    };

    useEffect(() => {
        if (onDateSelection) {
            onDateSelection(selectedDates);
        }
    }, [selectedDates, onDateSelection]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await fetch(`/api/spaces/${spaceId}/availability?year=${currentYear}&month=${currentMonth + 1}`);
                const data = await response.json();
                console.log('Fetched availability:', data);
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        fetchAvailability();
    }, [spaceId, currentYear, currentMonth]);

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prevYear) => prevYear - 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth - 1);
        }
        updateArrowSequence('left');
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prevYear) => prevYear + 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth + 1);
        }
        updateArrowSequence('right');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePreviousMonth();
            else if (e.key === 'ArrowRight') handleNextMonth();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentMonth, currentYear]);

    const logArrowSequence = (sequence: string[]) => {
        console.log(`%cArrow sequence: ${sequence.join(',')}`, 'color: yellow;');
    };

    const updateArrowSequence = (direction: string) => {
        setArrowSequence((prevSequence) => {
            const newSequence = [...prevSequence, direction].slice(-10);
            logArrowSequence(newSequence);
            if (newSequence.join(',') === 'left,right,right,left,left,left,right,right,right,right') {
                setSnake(true);
                console.log('%cEaster egg activated: snake mode!', 'color: green;');
            }
            return newSequence;
        });
    };

    const triggerSnakeEffect = () => {
        if (snakeRef.current) {
            const snakeSpeed = 250;
            const snakeLength = 750;

            const buttons = Array.from(snakeRef.current.querySelectorAll('.snake-day'));
            const selectedIndices = buttons
                .map((button, index) => (button.classList.contains('bg-west-side-500') ? index : -1))
                .filter((index) => index !== -1);

            if (selectedIndices.length > 0) {
                const startIndex = Math.floor(Math.random() * buttons.length);
                const visited = new Set<number>();

                const animateRandomSnake = (currentIndex: number) => {
                    if (visited.size === selectedIndices.length) return;

                    const button = buttons[currentIndex];
                    button.classList.add('snake-hover');
                    setTimeout(() => button.classList.remove('snake-hover'), snakeLength);

                    if (selectedIndices.includes(currentIndex)) {
                        visited.add(currentIndex);
                        const date = button.getAttribute('data-date');
                        if (date) {
                            setTimeout(() => {
                                setSelectedDates((prev) => {
                                    const newDates = new Set(prev);
                                    newDates.delete(date);
                                    return newDates;
                                });
                            }, snakeLength);
                        }
                    }

                    setTimeout(() => {
                        const neighbors = [
                            currentIndex % columns !== 0 ? currentIndex - 1 : -1,
                            (currentIndex + 1) % columns !== 0 ? currentIndex + 1 : -1,
                            currentIndex - columns,
                            currentIndex + columns,
                        ].filter(
                            (i) =>
                                i >= 0 &&
                                i < buttons.length &&
                                !visited.has(i) &&
                                !buttons[i].classList.contains('snake-hover')
                        );

                        if (neighbors.length > 0) {
                            const nextIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
                            animateRandomSnake(nextIndex);
                        } else {
                            const unvisited = selectedIndices.filter((i) => !visited.has(i));
                            if (unvisited.length > 0) {
                                const nextIndex = unvisited[Math.floor(Math.random() * unvisited.length)];
                                animateRandomSnake(nextIndex);
                            }
                        }
                    }, snakeSpeed);
                };

                animateRandomSnake(startIndex);
            } else {
                // 🐍 Modalità classica con offset corretto per la posizione del primo giorno
                const animateSnake = (index: number, direction: 'right' | 'left', stepsRemaining: number) => {
                    if (index >= buttons.length || index < 0) return;

                    const button = buttons[index];
                    button.classList.add('snake-hover');
                    setTimeout(() => button.classList.remove('snake-hover'), snakeLength);

                    setTimeout(() => {
                        if (stepsRemaining > 1) {
                            const nextIndex = direction === 'right' ? index + 1 : index - 1;
                            animateSnake(nextIndex, direction, stepsRemaining - 1);
                        } else {
                            const downIndex = index + columns;
                            if (downIndex < buttons.length) {
                                const newDirection = direction === 'right' ? 'left' : 'right';
                                animateSnake(downIndex, newDirection, columns);
                            }
                        }
                    }, snakeSpeed);
                };

                // Calcola la colonna del primo giorno del mese
                const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sunday
                const firstCol = (firstDay + 6) % 7; // Monday=0

                // Trova il bottone del primo giorno del mese
                const startIndex = buttons.findIndex((btn) => {
                    const dateAttr = btn.getAttribute('data-date');
                    if (!dateAttr) return false;
                    const [y, m, d] = dateAttr.split('-').map(Number);
                    return y === currentYear && m === currentMonth + 1 && d === 1;
                });

                if (startIndex !== -1) {
                    // Deve andare a destra fino a colonna 6 (inclusa)
                    const initialSteps = columns - 1 - firstCol;
                    animateSnake(startIndex, 'right', initialSteps + 1);
                }
            }
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <>
            <div className="flex justify-between items-center">
                <button onClick={handlePreviousMonth} className="aspect-square size-8 text-sm border-1 border-stone-900/10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {snake ? (
                    <button onClick={triggerSnakeEffect} className="text-lg text-center px-2 font-bold rounded-lg bg-green-500 text-stone-100 hover:scale-110 active:scale-90 transition-all duration-150 ease-out">
                        SNAKE
                    </button>
                ) : (
                    <div className="text-lg font-bold">{monthNames[currentMonth]} {currentYear}</div>
                )}

                <button onClick={handleNextMonth} className="aspect-square size-8 text-sm border-1 border-stone-900/10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            <div ref={snakeRef} className="grid grid-cols-7">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => (
                    <div key={index} className="text-center text-sm font-bold py-2">
                        {dayName}
                    </div>
                ))}

                {/* Giorni vuoti del mese precedente */}
                {(() => {
                    const leading = getLeadingEmptyDays(currentMonth, currentYear);
                    if (leading === 0) return null;
                    let prevMonth = currentMonth - 1;
                    let prevYear = currentYear;
                    if (prevMonth < 0) {
                        prevMonth = 11;
                        prevYear--;
                    }
                    const lastDayPrevMonth = daysInMonth(prevMonth, prevYear);
                    const daysToShow = Array.from({ length: leading }, (_, i) => lastDayPrevMonth - leading + i + 1);
                    const handlePrevDayClick = (day: number) => {
                        setCurrentMonth(prevMonth);
                        setCurrentYear(prevYear);
                        const date = `${prevYear}-${prevMonth + 1}-${day}`;
                        setTimeout(() => {
                            setSelectedDates((prev) => new Set(prev).add(date));
                        }, 0);
                    };
                    return daysToShow.map((day) => {
                        const date = `${prevYear}-${prevMonth + 1}-${day}`;
                        return (
                            <button
                                key={`prev-${day}`}
                                className="h-10 w-10 text-stone-600 opacity-50 cursor-pointer transition"
                                onClick={() => handlePrevDayClick(day)}
                                data-date={date}
                            >
                                {day}
                            </button>
                        );
                    });
                })()}

                {days.map((day) => {
                    const date = `${currentYear}-${currentMonth + 1}-${day}`;
                    const isSelected = selectedDates.has(date);
                    return (
                        <button key={date} onClick={() => toggleDateSelection(date)}
                            className={`snake-day flex items-center justify-center h-10 w-10 transition duration-500 hover:duration-150 delay-250 hover:delay-0
                                ${isSelected ? 'bg-west-side-500 text-stone-100 font-medium' : 'hover:bg-west-side-200 hover:text-west-side-900'}`}
                            data-date={date}>
                            {day}
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default CalendarComponent;
