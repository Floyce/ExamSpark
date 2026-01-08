import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag, FaCheckCircle, FaStar } from 'react-icons/fa';
import { checkConflict } from '../utils/timeUtils';

export default function AddTask({ onAdd, existingTasks }) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        date: '',
        startTime: '',
        endTime: '',
        venue: '',
        icon: 'FaStar' // Default
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const timeString = formData.startTime && formData.endTime
            ? `${convertToAMPM(formData.startTime)} - ${convertToAMPM(formData.endTime)}`
            : formData.startTime || 'All Day';

        const newTask = {
            id: Date.now().toString(), // Simple ID generation
            title: formData.title,
            code: formData.code || 'TASK',
            date: formData.date,
            day: new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' }),
            time: timeString,
            venue: formData.venue || 'Home',
            icon: formData.icon,
            completed: false
        };

        const conflict = checkConflict(newTask, existingTasks || []);
        if (conflict) {
            setError(`Conflict! You already have "${conflict.title}" scheduled then.`);
            return;
        }

        onAdd(newTask);
        setIsOpen(false);
        setFormData({
            title: '',
            code: '',
            date: '',
            startTime: '',
            endTime: '',
            venue: '',
            icon: 'FaStar'
        });
    };

    // Helper to convert 24h input value to 12h format for display consistency
    const convertToAMPM = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${minutes} ${ampm}`;
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 md:bottom-12 md:right-12 bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center gap-2 font-bold"
            >
                <FaPlus /> Add Task
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                                    New Mission 🚀
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Wait! </strong>
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <FaCheckCircle className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="What's the plan?"
                                            className="w-full pl-10 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code/Tag</label>
                                        <div className="relative">
                                            <FaTag className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="e.g. GYM"
                                                className="w-full pl-10 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition"
                                                value={formData.code}
                                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Where?"
                                                className="w-full pl-10 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition"
                                                value={formData.venue}
                                                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            required
                                            type="date"
                                            className="w-full pl-10 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                        <div className="relative">
                                            <FaClock className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="time"
                                                className="w-full pl-10 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition"
                                                value={formData.startTime}
                                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                                        <div className="relative">

                                            <input
                                                type="time"
                                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition"
                                                value={formData.endTime}
                                                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-md transform transition hover:-translate-y-1"
                                >
                                    Add to Schedule ✨
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
