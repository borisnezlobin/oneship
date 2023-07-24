// also sets notifications for every period if not set already
const getCurrentScheduleInfo = (schedule, time) => {
    // return "No school today!" if there is no school today
    // return "Period x ending in hh:mm:ss" if there is school today and class is in session
    // return "Period x starting in hh:mm:ss" if there is school today and class is not in session

    if(schedule == null || schedule.value == null) return "No school today!";
    for(var i = 0; i < schedule.value.length; i++){
        // format:
        // {
        //     startString: "8:00",
        //     start: 480,
        //     endString: "9:00",
        //     end: 540,
        //     name: "Period 1"
        // }
        var period = schedule.value[i];
        var periodStart = new Date();
        periodStart.setHours((period.start - (period.start % 60)) / 60);
        periodStart.setMinutes(period.start % 60);
        periodStart.setSeconds(0);
        if(periodStart < time){
            var periodEnd = new Date();
            periodEnd.setHours((period.end - (period.end % 60)) / 60);
            periodEnd.setMinutes(period.end % 60);
            periodEnd.setSeconds(0);
            if(periodEnd < time){
                continue;
            } else {
                return `${period.name} ending in ${timeString(periodEnd - time)}`;
            }
        } else {
            return `${period.name} starting in ${timeString(periodStart - time)}`;
        }
    }
    return "School's over!";
};

const timeString = (time) => {
    var seconds = time / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    seconds = Math.floor(seconds % 60);
    minutes = Math.floor(minutes % 60);
    hours = Math.floor(hours);
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

export { getCurrentScheduleInfo, timeString };