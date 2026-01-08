
import { useState, useEffect } from 'react';
import { useExams } from './hooks/useExams';
import ExamCard from './components/ExamCard';
import StatsBoard from './components/StatsBoard';
import HypeSection from './components/HypeSection';
import StudyTimer from './components/StudyTimer';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { motion } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import AddTask from './components/AddTask';
import { parseTimeRange } from './utils/timeUtils';

function App() {
  const { exams, stats, toggleExam, addExam } = useExams();
  const [ticker, setTicker] = useState(new Date());
  const [currentTask, setCurrentTask] = useState(null);
  const [acknowledgedTaskId, setAcknowledgedTaskId] = useState(null);
  const [isAllDoneToday, setIsAllDoneToday] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTicker(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    // Check if there are tasks for today
    const todayStr = now.toISOString().split('T')[0];
    const todaysTasks = exams.filter(exam => exam.date === todayStr);

    // Check if all of today's tasks are completed
    if (todaysTasks.length > 0) {
      const allCompleted = todaysTasks.every(t => t.completed);
      setIsAllDoneToday(allCompleted);
    } else {
      setIsAllDoneToday(false);
    }

    // Find a task that is happening "now"
    const active = exams.find(exam => {
      if (exam.completed) return false;
      const range = parseTimeRange(exam.date, exam.time);
      if (!range) return false;
      return now >= range.start && now <= range.end;
    });
    setCurrentTask(active || null);
  }, [ticker, exams]);

  const requestNotification = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification("Exam Schedule", { body: "Notifications are enabled Well remind you 1 hour before exams" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          new Notification("Exam Schedule", { body: "Youre all set Good luck 🍀" });
        }
      });
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen p-4 md:p-8 pb-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="mb-8 text-center pt-8 relative">
          <div className="absolute right-0 top-0 pt-4 pr-4">
            <ThemeToggle />
          </div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold pb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-sm"
            style={{ backgroundImage: 'linear-gradient(to right, #7e22ce, #ec4899)' }}
          >
            Shitandi's Planner🌸
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-lg text-purple-800 dark:text-purple-300 font-medium"
          >
            Stay organized, stay fabulous 😍
          </motion.p>
        </header>

        <main className="max-w-3xl mx-auto space-y-8">
          {/* Hype Section */}
          {/* Hype & Timer Section */}
          <section className="grid md:grid-cols-2 gap-6">
            <HypeSection
              remaining={stats.remaining}
              currentTask={currentTask}
              isAcknowledged={currentTask && acknowledgedTaskId === currentTask.id}
              onCheckIn={(id) => setAcknowledgedTaskId(id)}
              isAllDoneToday={isAllDoneToday}
            />
            <StudyTimer />
          </section>

          {/* Stats Board */}
          <section>
            <StatsBoard stats={stats} />
          </section>

          <section className="flex justify-center">
            <button
              onClick={requestNotification}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-full transition"
            >
              <FaBell /> Enable Exam Reminders
            </button>
          </section>

          {/* Exam List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">Your Timeline</h2>
              <span className="text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-semibold">
                {stats.remaining} to go!
              </span>
            </div>

            <div className="grid gap-4">
              {exams.map((exam, index) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onToggle={toggleExam}
                  index={index}
                />
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>You are capable of amazing things. </p>
        </footer>

        <AddTask onAdd={addExam} existingTasks={exams} />
      </div>
    </ThemeProvider>
  )
}

export default App
