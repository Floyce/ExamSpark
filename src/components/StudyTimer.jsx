
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaCoffee, FaVolumeUp, FaCog, FaCheck } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const WARNING_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/03/24/audio_c8c2a9a528.mp3';

export default function StudyTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus', 'rest', 'custom'
    const [timerType, setTimerType] = useState('pomodoro'); // 'pomodoro', 'custom'
    const [customMinutes, setCustomMinutes] = useState(30);
    const [isLooping, setIsLooping] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const next = prev - 1;
                    if (next === 10 && mode === 'focus') {
                        new Audio(WARNING_SOUND_URL).play().catch(e => console.log('Audio blocked'));
                    }
                    return next;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const handleTimerComplete = () => {
        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(e => console.log('Audio blocked'));
        confetti({
            particleCount: 50,
            spread: 60,
            colors: ['#4ade80', '#22c55e']
        });

        if (timerType === 'pomodoro') {
            if (mode === 'focus') {
                setMode('rest');
                setTimeLeft(5 * 60);
                setIsActive(true); // Auto start break? Standard pomodoro usually auto-starts or waits. I'll make it wait for user interaction to start break or just auto start? User asked for loop.
                // If loop is not explicitly mentioned for pomodoro, usually it stops.
                // But user asked "whether it's a loop or the pomodoro".
                // I'll assume standard pomodoro behavior: stop at end of focus, user starts break? 
                // Or maybe just auto-transition. I'll auto-transition for now as it's friendlier.
            } else {
                setMode('focus');
                setTimeLeft(25 * 60);
                setIsActive(false); // Stop after break
            }
        } else {
            // Custom Loop
            if (isLooping) {
                setTimeLeft(customMinutes * 60);
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (timerType === 'pomodoro') {
            setMode('focus');
            setTimeLeft(25 * 60);
        } else {
            setMode('custom');
            setTimeLeft(customMinutes * 60);
        }
    };

    const applySettings = () => {
        if (timerType === 'custom') {
            setMode('custom');
            setTimeLeft(customMinutes * 60);
        } else {
            setMode('focus');
            setTimeLeft(25 * 60);
        }
        setIsActive(false);
        setShowSettings(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const playTestSound = () => {
        new Audio(WARNING_SOUND_URL).play().catch(e => console.log('Audio blocked', e));
    };

    return (
        <div className="glass-panel p-6 text-center relative overflow-hidden">


            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
                {mode === 'focus' ? '📚 Focus Time' : mode === 'rest' ? '☕ Break Time' : '⏱️ Custom Timer'}
            </h3>

            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 bg-purple-50 p-4 rounded-lg text-left text-sm space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700">Timer Mode:</span>
                            <div className="flex bg-white rounded-lg p-1 shadow-sm">
                                <button
                                    onClick={() => setTimerType('pomodoro')}
                                    className={`px-3 py-1 rounded-md transition ${timerType === 'pomodoro' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-500'}`}
                                >
                                    Pomodoro
                                </button>
                                <button
                                    onClick={() => setTimerType('custom')}
                                    className={`px-3 py-1 rounded-md transition ${timerType === 'custom' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-500'}`}
                                >
                                    Custom
                                </button>
                            </div>
                        </div>

                        {timerType === 'custom' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Duration (mins):</span>
                                    <input
                                        type="number"
                                        value={customMinutes}
                                        onChange={(e) => setCustomMinutes(Number(e.target.value))}
                                        className="w-16 p-1 border rounded text-center"
                                        min="1"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Loop Timer:</span>
                                    <button
                                        onClick={() => setIsLooping(!isLooping)}
                                        className={`w-10 h-5 rounded-full flex items-center transition-colors ${isLooping ? 'bg-purple-500 justify-end' : 'bg-gray-300 justify-start'}`}
                                    >
                                        <motion.div layout className="w-4 h-4 bg-white rounded-full mx-0.5" />
                                    </button>
                                </div>
                            </>
                        )}

                        <button
                            onClick={applySettings}
                            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 flex justify-center items-center gap-2"
                        >
                            <FaCheck /> Apply Changes
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-5xl font-mono font-bold text-pink-600 mb-6 tracking-wider">
                {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-4 items-center">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-pink-400 hover:text-pink-600 p-2 transition"
                    title="Timer Settings"
                >
                    <FaCog />
                </button>
                <button
                    onClick={playTestSound}
                    className="text-pink-400 hover:text-pink-600 p-2 transition"
                    title="Test Warning Sound"
                >
                    <FaVolumeUp />
                </button>
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
                {mode === 'rest' ? 'Hydrate and stretch 🧘‍♀️' : 'Stay locked in, Queen 👑'}
            </p>
        </div>
    );
}
