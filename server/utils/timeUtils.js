/**
 * Helper to convert time object to minutes from midnight
 */
export const timeToMinutes = (time) => {
    let { hour, minute, period } = time;
    let h = parseInt(hour);
    let m = parseInt(minute);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
};

/**
 * Check if a specific time is within a slot
 */
export const isTimeInSlot = (startTime, endTime, currentTimeMinutes) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    return currentTimeMinutes >= start && currentTimeMinutes <= end;
};

/**
 * Get current date string YYYY-MM-DD
 */
export const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0];
};
