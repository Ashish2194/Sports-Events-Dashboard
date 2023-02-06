export const getFormattedTime = (startTime, endTime) => {
    const startingTime = new Date(startTime).getHours();
    const endingTime = new Date(endTime).getHours();
    return `${startingTime}${startingTime<12 ? 'AM':'PM'} - ${endingTime}${endingTime<12 ? 'AM':'PM'}`;
};

export const getEventNameInLowerCase = (name) => {
    return name.toLowerCase();
}

    /**Group all events based on category they fall in 
     * 
        {
            "Swimming": [
                {
                    "id": 1,
                    "event_name": "Butterfly 100M",
                    "start_time": "2022-12-17 13:00:00",
                    "end_time": "2022-12-17 14:00:00"
                },
                ...
            ],
            "Athletics": [
                {
                    "id": 4,
                    "event_name": "High Jump",
                    "start_time": "2022-12-17 13:00:00",
                    "end_time": "2022-12-17 14:00:00"
                },
                ...
            ],
            "Boxing": [
                {
                    "id": 8,
                    "event_name": "Lightweight 60kg",
                    "start_time": "2022-12-17 18:00:00",
                    "end_time": "2022-12-17 19:00:00"
                },
                ...
            ]
        }
    * 
    * **/
export const groupByResults = (results) => {
    return results.reduce((acc, curr) => {
        const { id, event_name, event_category, start_time, end_time } = curr;
        if (acc[event_category]) {
            acc[event_category].push({ id, event_name, start_time, end_time });
        } else {
            acc[event_category] = [{ id, event_name, start_time, end_time }];
        }
        return acc;
    }, {});
};