export const getFormattedTime = (startTime, endTime) => {
    const startingTime = new Date(startTime).getHours();
    const endingTime = new Date(endTime).getHours();
    return `${startingTime}${startingTime<12 ? 'AM':'PM'} - ${endingTime}${endingTime<12 ? 'AM':'PM'}`;
};