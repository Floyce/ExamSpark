
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { format, parseISO, isSameDay } from 'date-fns';
import * as Icons from 'react-icons/fa'; // Import all Fa icons

export default function ExamCard({ exam, onToggle, index }) {
    const IconComponent = Icons[exam.icon] || Icons.FaBook; // Fallback icon

    const handleToggle = () => {
        if (!exam.completed) {
            // Trigger confetti only on completion
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffb7b2', '#a855f7', '#ec4899'] // Pink/Purple confetti
            });
        }
        onToggle(exam.id);
    };

    const isToday = isSameDay(parseISO(exam.date), new Date());

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.5 } }
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)' }}
            className={`relative p-6 rounded-2xl border transition-all duration-300 ${exam.completed
                    ? 'bg-green-50 border-green-200 opacity-80'
                    : isToday
                        ? 'glass-panel border-pink-400 ring-2 ring-pink-400 ring-opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                        : 'glass-panel border-white/50'
                }`}
        >
            {/* "Today" Badge */}
            {isToday && !exam.completed && (
                <div className="absolute -top-3 -right-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                    IT'S GO TIME! 
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Date & Time */}
                <div className="flex-shrink-0 text-center md:text-left min-w-[80px]">
                    <div className="text-2xl font-bold text-purple-700 leading-none">
                        {format(parseISO(exam.date), 'dd')}
                    </div>
                    <div className="text-sm font-semibold text-pink-500 uppercase">
                        {format(parseISO(exam.date), 'MMM')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{exam.day}</div>
                </div>

                {/* Exam Details */}
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded">
                            {exam.code}
                        </span>
                        <div className="h-px bg-gray-300 flex-grow"></div>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${exam.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {exam.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Icons.FaClock className="text-pink-400" />
                            {exam.time}
                        </div>
                        <div className="flex items-center gap-1">
                            <Icons.FaMapMarkerAlt className="text-purple-400" />
                            {exam.venue}
                        </div>
                    </div>
                </div>

                {/* Icon & Action */}
                <div className="flex items-center gap-4 self-end md:self-center">
                    <div className={`p-3 rounded-xl ${exam.completed ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600'}`}>
                        <IconComponent className="text-2xl" />
                    </div>

                    <button
                        onClick={handleToggle}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm
                    ${exam.completed
                                ? 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                            }`}
                    >
                        {exam.completed ? 'Undo' : 'Mark Done'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
