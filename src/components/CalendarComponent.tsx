import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import React, { useState, useEffect, useRef } from 'react';

// Props for the CalendarComponent
interface CalendarComponentProps {
    onDateSelection?: (selectedDates: Set<string>) => void; // Callback when dates are selected
    selectedDates: Set<string>; // Currently selected dates
    setSelectedDates: (dates: Set<string>) => void; // Setter for selected dates
    spaceId: string; // ID of the space for fetching availability
}

// Main CalendarComponent
const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelection, selectedDates, setSelectedDates, spaceId }) => {
    // State for current month and year
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    // State for available dates fetched from API
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    // Easter egg state for snake mode
    const [snake, setSnake] = useState<boolean>(false);
    // Tracks arrow key sequence for snake mode
    const [arrowSequence, setArrowSequence] = useState<string[]>([]);
    // Ref for the calendar grid
    const snakeRef = useRef<HTMLDivElement | null>(null);

    // Returns number of days in a given month/year
    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    // Array of days for the current month
    const days = Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);
    const columns = 7; // Number of columns in the calendar grid

    // Calculates leading empty days for the first week (so Monday is first)
    const getLeadingEmptyDays = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        return (firstDay + 6) % 7; // Shift: Monday = 0
    };

    // Toggles selection of a date
    const toggleDateSelection = (date: string) => {
        const newDates = new Set(selectedDates);
        if (newDates.has(date)) newDates.delete(date);
        else newDates.add(date);
        setSelectedDates(newDates);
    };

    // Calls the callback when selectedDates changes
    useEffect(() => {
        if (onDateSelection) {
            onDateSelection(selectedDates);
        }
        console.log(availableDates);
    }, [selectedDates, onDateSelection]);

    // Fetches available dates from the API when month/year/spaceId changes
    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await fetch(`/api/spaces/${spaceId}/availability?year=${currentYear}&month=${currentMonth + 1}`);
                const data = await response.json();
                console.log('Fetched availability:', data.availableDates);
                setAvailableDates(new Set(data.availableDates));
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        fetchAvailability();
    }, [spaceId, currentYear, currentMonth]);

    // Handles navigation to previous month
    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prevYear) => prevYear - 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth - 1);
        }
        updateArrowSequence('left');
    };

    // Handles navigation to next month
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prevYear) => prevYear + 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth + 1);
        }
        updateArrowSequence('right');
    };

    // Listens for arrow key presses to trigger snake mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                updateArrowSequence('left');
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                updateArrowSequence('right');
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Logs the current arrow key sequence
    const logArrowSequence = (sequence: string[]) => {
        console.log(`%cArrow sequence: ${sequence.join(',')}`, 'color: yellow;');
    };

    // Updates the arrow key sequence and activates snake mode if the secret code is entered
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

    // Triggers the snake animation effect
    const triggerSnakeEffect = () => {
        if (snakeRef.current) {
            const snakeSpeed = 250;
            const snakeLength = 750;

            const buttons = Array.from(snakeRef.current.querySelectorAll('.snake-day'));
            const selectedIndices = buttons
                .map((button, index) => (button.classList.contains('bg-west-side-500') ? index : -1))
                .filter((index) => index !== -1);

            if (selectedIndices.length > 0) {
                // Snake visits all selected days and then clears selection
                const startIndex = Math.floor(Math.random() * buttons.length);
                const visited = new Set<number>();

                const animateRandomSnake = (currentIndex: number) => {
                    if (visited.size === selectedIndices.length) {
                        // When snake has visited all selected, clear selection and hide SNAKE button
                        setTimeout(() => {
                            setSelectedDates(new Set());
                            setSnake(false);
                        }, snakeLength);
                        return;
                    }

                    const button = buttons[currentIndex];
                    button.classList.add('snake-hover');
                    setTimeout(() => button.classList.remove('snake-hover'), snakeLength);

                    if (selectedIndices.includes(currentIndex)) {
                        visited.add(currentIndex);
                        const date = button.getAttribute('data-date');
                        if (date) {
                            setTimeout(() => {
                                const newDates = new Set(selectedDates);
                                newDates.delete(date);
                                setSelectedDates(newDates);
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
                // Classic snake mode: animates through the calendar grid
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

                // Calculate the column of the first day of the month
                const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sunday
                const firstCol = (firstDay + 6) % 7; // Monday=0

                // Find the button for the first day of the month
                const startIndex = buttons.findIndex((btn) => {
                    const dateAttr = btn.getAttribute('data-date');
                    if (!dateAttr) return false;
                    const [y, m, d] = dateAttr.split('-').map(Number);
                    return y === currentYear && m === currentMonth + 1 && d === 1;
                });

                if (startIndex !== -1) {
                    // Go right to the end of the row, then snake down
                    const initialSteps = columns - 1 - firstCol;
                    animateSnake(startIndex, 'right', initialSteps + 1);
                }
            }
        }
    };

    // Month names for display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <>
            {/* Header with navigation and month/year display or SNAKE button */}
            <div className="flex justify-between items-center mb-3">
                <button onClick={handlePreviousMonth} className="aspect-square size-10 border-1 border-stone-900/10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 active:bg-stone-900 active:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {snake ? (
                    <button onClick={triggerSnakeEffect} className="text-2xl text-center px-2 font-bold rounded-lg bg-green-500 text-stone-100 hover:scale-110 active:scale-90 transition-all duration-150 ease-out">
                        SNAKE
                    </button>
                ) : (
                    <div className="text-2xl font-bold">{monthNames[currentMonth]} {currentYear}</div>
                )}

                <button onClick={handleNextMonth} className="aspect-square size-10 border-1 border-stone-900/10 bg-stone-100 shadow-sm hover:bg-stone-900 hover:text-stone-100 active:bg-stone-900 active:text-stone-100 rounded-lg transition">
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            {/* Calendar grid */}
            <div ref={snakeRef} className="grid grid-cols-7">
                {/* Day names header */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => (
                    <div key={index} className="text-center text-sm sm:text-base font-bold py-2 text-stone-900">
                        {dayName}
                    </div>
                ))}

                {/* All days in the calendar (previous, current, next month) */}
                {(() => {
                    const leading = getLeadingEmptyDays(currentMonth, currentYear);
                    let prevMonth = currentMonth - 1;
                    let prevYear = currentYear;
                    if (prevMonth < 0) {
                        prevMonth = 11;
                        prevYear--;
                    }
                    const lastDayPrevMonth = daysInMonth(prevMonth, prevYear);
                    const prevDays = Array.from({ length: leading }, (_, i) => ({
                        year: prevYear,
                        month: prevMonth,
                        day: lastDayPrevMonth - leading + i + 1,
                        type: 'prev' as const
                    }));
                    const currDays = days.map((day) => ({
                        year: currentYear,
                        month: currentMonth,
                        day,
                        type: 'curr' as const
                    }));
                    const totalCells = leading + days.length;
                    const nextDaysCount = 42 - totalCells;
                    let nextMonth = currentMonth + 1;
                    let nextYear = currentYear;
                    if (nextMonth > 11) {
                        nextMonth = 0;
                        nextYear++;
                    }
                    const nextDays = Array.from({ length: nextDaysCount }, (_, i) => ({
                        year: nextYear,
                        month: nextMonth,
                        day: i + 1,
                        type: 'next' as const
                    }));
                    const allDays = [...prevDays, ...currDays, ...nextDays];
                    const pad = (n: number) => n.toString().padStart(2, '0');
                    return allDays.map(({ year, month, day, type }, idx) => {
                        const date = `${year}-${pad(month + 1)}-${pad(day)}`;
                        const isSelected = selectedDates.has(date);
                        const isAvailable = availableDates.has(date);
                        const isCurrentMonth = type === 'curr';
                        // Handles click on a day cell
                        const handleClick = () => {
                            if (!isAvailable) return;
                            if (type === 'prev') {
                                setCurrentMonth(month);
                                setCurrentYear(year);
                                setTimeout(() => {
                                    setSelectedDates(new Set([date]));
                                    if (onDateSelection) onDateSelection(new Set([date]));
                                }, 0);
                            } else if (type === 'next') {
                                setCurrentMonth(month);
                                setCurrentYear(year);
                                setTimeout(() => {
                                    setSelectedDates(new Set([date]));
                                    if (onDateSelection) onDateSelection(new Set([date]));
                                }, 0);
                            } else {
                                toggleDateSelection(date);
                            }
                        };
                        return (
                            <button
                                key={`${type}-${day}-${month}`}
                                onClick={handleClick}
                                className={`snake-day flex items-center justify-center aspect-square transition duration-500 hover:duration-150 active:duration-150 delay-250 hover:delay-0 active:delay-0 
                                    ${isSelected
                                        ? 'bg-west-side-500 text-stone-100 font-medium'
                                        : isAvailable
                                            ? 'text-stone-900 hover:bg-west-side-200 hover:text-west-side-900 active:bg-west-side-200 active:text-west-side-900'
                                            : isCurrentMonth
                                                ? 'text-stone-900 opacity-50 cursor-not-allowed hover:bg-stone-200'
                                                : 'text-stone-900 opacity-25 cursor-not-allowed'}`}
                                data-date={date}
                                disabled={!isAvailable}
                                tabIndex={-1}
                            >
                                {day}
                            </button>
                        );
                    });
                })()}
            </div>
        </>
    );
};

export default CalendarComponent;
