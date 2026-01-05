
import { useState, useEffect } from 'react';
import { exams as initialExams } from '../data/exams';

export function useExams() {
    const [exams, setExams] = useState(() => {
        const saved = localStorage.getItem('examSchedule_v1');
        if (saved) {
            const parsedFn = JSON.parse(saved);
            // Merge saved completion status with initial data structure (in case data changed)
            return initialExams.map(exam => {
                const savedExam = parsedFn.find(e => e.id === exam.id);
                return savedExam ? { ...exam, completed: savedExam.completed } : exam;
            });
        }
        return initialExams;
    });

    const [stats, setStats] = useState({ total: 0, completed: 0, remaining: 0 });

    useEffect(() => {
        // Update stats whenever exams change
        const total = exams.length;
        const completed = exams.filter(e => e.completed).reduce((acc, curr) => acc + 1, 0); // safe count
        const remaining = total - completed;
        setStats({ total, completed, remaining });

        // Persist to local storage
        localStorage.setItem('examSchedule_v1', JSON.stringify(exams));
    }, [exams]);

    const toggleExam = (id) => {
        setExams(prev => prev.map(exam =>
            exam.id === id ? { ...exam, completed: !exam.completed } : exam
        ));
    };

    return { exams, stats, toggleExam };
}
