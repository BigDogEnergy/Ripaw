export function splitDateTime(dateTimeString) {

    if (!dateTimeString) {
        return { date: 'Incomplete', time: 'Incomplete' };
    }
    const [date, fullTime] = dateTimeString.split('T');
    const time = fullTime.split('.')[0]
    return { date, time };
};

export function convertToAMPM(timeString) {
    const [hour, minute] = timeString.split(':');
    let adjustedHour = parseInt(hour, 10);

    return `${adjustedHour}:${minute}`;
};