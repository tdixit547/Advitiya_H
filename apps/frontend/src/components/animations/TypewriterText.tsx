// ============================================
// Typewriter Text Effect
// Text appears character by character with cursor
// Cycles through multiple phrases
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';

interface TypewriterTextProps {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
    cursorColor?: string;
}

export default function TypewriterText({
    phrases,
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseDuration = 2000,
    className = '',
    cursorColor = '#00C853',
}: TypewriterTextProps) {
    const [displayText, setDisplayText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const tick = useCallback(() => {
        const currentPhrase = phrases[phraseIndex];

        if (isPaused) return;

        if (!isDeleting) {
            // Typing
            if (displayText.length < currentPhrase.length) {
                setDisplayText(currentPhrase.slice(0, displayText.length + 1));
            } else {
                // Finished typing, pause before deleting
                setIsPaused(true);
                setTimeout(() => {
                    setIsPaused(false);
                    setIsDeleting(true);
                }, pauseDuration);
            }
        } else {
            // Deleting
            if (displayText.length > 0) {
                setDisplayText(currentPhrase.slice(0, displayText.length - 1));
            } else {
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
        }
    }, [displayText, phraseIndex, isDeleting, isPaused, phrases, pauseDuration]);

    useEffect(() => {
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        const timer = setTimeout(tick, speed);
        return () => clearTimeout(timer);
    }, [tick, isDeleting, typingSpeed, deletingSpeed]);

    return (
        <span className={className}>
            {displayText}
            <span
                className="inline-block w-[3px] ml-1 animate-pulse"
                style={{
                    backgroundColor: cursorColor,
                    height: '1em',
                    verticalAlign: 'text-bottom',
                    borderRadius: '1px',
                }}
            />
        </span>
    );
}
