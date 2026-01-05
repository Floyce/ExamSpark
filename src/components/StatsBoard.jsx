
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHourglassHalf, FaListAlt } from 'react-icons/fa';

export default function StatsBoard({ stats }) {
    const statItems = [
        { label: 'Total Exams', value: stats.total, icon: FaListAlt, color: 'text-purple-700', bg: 'bg-purple-100' },
        { label: 'Completed', value: stats.completed, icon: FaCheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Remaining', value: stats.remaining, icon: FaHourglassHalf, color: 'text-pink-600', bg: 'bg-pink-100' },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {statItems.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-4 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform"
                >
                    <div className={`p-3 rounded-full mb-2 ${item.bg}`}>
                        <item.icon className={`text-2xl ${item.color}`} />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{item.value}</span>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{item.label}</span>
                </motion.div>
            ))}
        </div>
    );
}
