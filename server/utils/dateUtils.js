export const checkOverlap = (existingStart, existingEnd, newStart, newEnd) => {
    const s1 = new Date(existingStart);
    const e1 = new Date(existingEnd);
    const s2 = new Date(newStart);
    const e2 = new Date(newEnd);

    // Date range overlap logic: (StartA <= EndB) and (EndA >= StartB)
    return s1 <= e2 && e1 >= s2;
};
