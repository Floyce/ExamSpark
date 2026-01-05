
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaCoffee } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function StudyTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'rest'

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (mode === 'focus') {
                new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(e => console.log('Audio blocked'));
                confetti({
                    particleCount: 50,
                    spread: 60,
                    colors: ['#4ade80', '#22c55e']
                });
                setMode('rest');
                setTimeLeft(5 * 60); // 5 min break
            } else {
                setMode('focus');
                setTimeLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setMode('focus');
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-panel p-6 text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
                {mode === 'focus' ? '📚 Focus Time' : '☕ Break Time'}
            </h3>

            <div className="text-5xl font-mono font-bold text-pink-600 mb-6 tracking-wider">
                {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={toggleTimer}
                    className="bg-purple-600 text-white p-4 rounded-full hover:bg-purple-700 transition shadow-lg"
                >
                    {isActive ? <FaPause /> : <FaPlay className="ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="bg-pink-100 text-pink-600 p-4 rounded-full hover:bg-pink-200 transition"
                >
                    <FaRedo />
                </button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
                {mode === 'focus' ? 'Stay locked in, Queen 👑' : 'Hydrate and stretch 🧘‍♀️'}
            </p>
        </div>
    );
}
