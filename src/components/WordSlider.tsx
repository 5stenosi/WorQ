import React, { useState, useEffect } from 'react';

const WordSlider = () => {
    const words = ['Pisello🍆', 'Palle🥎🥎', 'Prostata🤘🏻', 'Sottopalla💦'];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const nextWordIndex = (currentWordIndex + 1) % words.length;

    useEffect(() => {
        const currentWord = document.getElementById('current');
        const nextWord = document.getElementById('next');

        const wordMoveInterval = setInterval(() => {
            if (currentWord && nextWord) {
                // Aggiungi classi per animazione
                currentWord.classList.add(...['transition-transform', 'duration-500', 'ease-in-out', '-translate-y-full']);
                nextWord.classList.add(...['transition-transform', 'duration-500', 'ease-in-out', '-translate-y-full']);

                // Dopo la fine dell'animazione (500ms), cambia parola e rimuovi animazione
                setTimeout(() => {
                    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);

                    if (currentWord && nextWord) {
                        currentWord.classList.remove(...['transition-transform', 'duration-500', 'ease-in-out', '-translate-y-full']);
                        nextWord.classList.remove(...['transition-transform', 'duration-500', 'ease-in-out', '-translate-y-full']);
                    }
                }, 600); // Durata dell'animazione
            }
        }, 3000); // Mantieni il rapporto temporale (muovi ogni 6 secondi)

        return () => {
            clearInterval(wordMoveInterval);
        };
    }, [words.length]);

    return (
        <div className="w-full grid grid-cols-2 mb-5 overflow-hidden">
            <p className="text-2xl mr-1 text-right">Filtra per </p>
            <div className="relative flex flex-col items-start ml-1 text-2xl font-medium h-8">
                {/* Parola corrente */}
                <p id='current' className="">
                    {words[currentWordIndex]}
                </p>
                {/* Parola successiva */}
                <p id='next' className="">
                    {words[nextWordIndex]}
                </p>
            </div>
        </div>
    );
};

export default WordSlider;