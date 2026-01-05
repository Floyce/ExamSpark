
import { useState, useEffect } from 'react';
import { useExams } from './hooks/useExams';
import ExamCard from './components/ExamCard';
import StatsBoard from './components/StatsBoard';
import HypeSection from './components/HypeSection';
import StudyTimer from './components/StudyTimer';
import { motion } from 'framer-motion';
import { FaBell } from 'react-icons/fa';

function App() {
  const { exams, stats, toggleExam } = useExams();
  const [ticker, setTicker] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTicker(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen p-4 md:p-8 pb-20">
      <header className="mb-8 text-center pt-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-extrabold pb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-sm"
          style={{ backgroundImage: 'linear-gradient(to right, #7e22ce, #ec4899)' }}
        >
          Exam Schedule 2026🌸
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-lg text-purple-800 font-medium"
        >
          Stay organized, stay fabulous 😍
        </motion.p>
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        {/* Hype Section */}
        {/* Hype & Timer Section */}
        <section className="grid md:grid-cols-2 gap-6">
          <HypeSection remaining={stats.remaining} />
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
            <h2 className="text-xl font-bold text-gray-700">Your Timeline</h2>
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

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>You are capable of amazing things. </p>
      </footer>
    </div>
  )
}

export default App
