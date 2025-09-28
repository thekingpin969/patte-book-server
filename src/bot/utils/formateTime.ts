function formatTime(timestamp: number | string): string {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
}

export default formatTime;
