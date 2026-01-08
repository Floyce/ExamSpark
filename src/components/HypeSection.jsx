
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hypeMessages } from '../data/exams';

export default function HypeSection({ remaining, currentTask, onCheckIn, isAcknowledged, isAllDoneToday }) {
    const [currentMessage, setCurrentMessage] = useState(hypeMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * hypeMessages.length);
            setCurrentMessage(hypeMessages[randomIdx]);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    if (isAllDoneToday) {
        return (
            <div className="glass-panel p-6 text-center relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-4"
                >
                    <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                        ✨ YOU SLAYED TODAY! ✨
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        All tasks for today are complete. Take a well-deserved rest! 🛁🍷
                    </p>
                </motion.div>
            </div>
        );
    }

    if (currentTask) {
        return (
            <div className={`glass-panel p-6 text-center relative overflow-hidden transition-all duration-500 ${!isAcknowledged ? 'border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 animate-pulse"></div>

                {!isAcknowledged ? (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-2xl font-extrabold text-pink-600 animate-bounce">
                            🚨 IT'S GO TIME! 🚨
                        </h3>
                        <p className="text-lg text-gray-700 dark:text-gray-200">
                            <span className="font-bold">{currentTask.title}</span> is happening right now!
                        </p>
                        <button
                            onClick={() => onCheckIn(currentTask.id)}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition transform"
                        >
                            I'm on it! 🫡
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                    >
                        <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            In Progress: {currentTask.title}
                        </h3>
                        <p className="text-gray-500 text-sm">You are doing great. Keep going! 🧠</p>
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 animate-pulse"></div>

            <h3 className="text-xl font-bold text-purple-800 mb-2"> Daily Motivation 🌸</h3>

            <div className="h-16 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentMessage}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg md:text-xl text-pink-700 font-medium italic"
                    >
                        "{currentMessage}"
                    </motion.p>
                </AnimatePresence>
            </div>

            {remaining === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-lg inline-block"
                >
                    All Exams Completed! Time to CELEBRATE! 🥳
                </motion.div>
            )}
        </div>
    );
}
