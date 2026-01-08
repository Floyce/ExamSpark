export const parseTimeRange = (dateStr, timeRangeStr) => {
    if (!timeRangeStr || timeRangeStr === 'All Day') {
        const [y, m, d] = dateStr.split('-').map(Number);
        const start = new Date(y, m - 1, d, 0, 0, 0, 0);
        const end = new Date(y, m - 1, d, 23, 59, 59, 999);
        return { start, end };
    }

    // Expected format: "3:00 PM - 6:00 PM"
    const [startStr, endStr] = timeRangeStr.split(' - ');
    if (!startStr || !endStr) return null;

    const parseTime = (str) => {
        const [time, period] = str.trim().split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d, hours, minutes, 0, 0);
        return date;
    };

    return {
        start: parseTime(startStr),
        end: parseTime(endStr)
    };
};

export const checkConflict = (newTask, existingTasks) => {
    if (newTask.time === 'All Day') return null; // Assume All Day can overlap or we handle differently. Let's ignore for now.

    const newRange = parseTimeRange(newTask.date, newTask.time);
    if (!newRange) return null;

    for (const task of existingTasks) {
        if (task.date !== newTask.date) continue; // Different days
        if (task.time === 'All Day') continue;

        const taskRange = parseTimeRange(task.date, task.time);
        if (!taskRange) continue;

        // Check overlap
        // (StartA < EndB) and (EndA > StartB)
        if (newRange.start < taskRange.end && newRange.end > taskRange.start) {
            return task; // Return the conflicting task
        }
    }
    return null;
};
