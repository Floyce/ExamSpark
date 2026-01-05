
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hypeMessages } from '../data/exams';

export default function HypeSection({ remaining }) {
    const [currentMessage, setCurrentMessage] = useState(hypeMessages[0]);

    useEffect(() => {
        // Change message every 10 seconds or on interactions ideally, but timer is good
        const interval = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * hypeMessages.length);
            setCurrentMessage(hypeMessages[randomIdx]);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

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
