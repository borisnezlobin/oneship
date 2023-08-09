import fetch from "node-fetch";

const alternates = [
    {
        date: "20230809",
        schedule: [
            { name: "0 Period", start: "7:50", end: "8:50", },
            { name: "Advisory 9+11", start: "9:00", end: "9:15" },
            { name: "Advisory 10+12", start: "9:20", end: "9:30", },
            { name: "1st Period", start: "9:45", end: "10:25" },
            { name: "Brunch", start: "10:25", end: "10:40" },
            { name: "2nd Period", start: "10:40", end: "11:20" },
            { name: "3rd Period", start: "11:30", end: "12:10" },
            { name: "Lunch", start: "12:10", end: "12:50" },
            { name: "4th Period", start: "12:50", end: "1:30" },
            { name: "5th Period", start: "1:40", end: "2:20" },
            { name: "6th Period", start: "2:30", end: "3:10" },
            { name: "7th Period", start: "3:20", end: "4:00" },
        ],
    },
    {
        date: "20230810",
        schedule: [
            { name: "0 Period", start: "7:50", end: "8:50", },
            { name: "1st Period", start: "9:00", end: "10:00" },
            { name: "Brunch", start: "10:00", end: "10:15" },
            { name: "2nd Period", start: "10:15", end: "11:15" },
            { name: "Lunch", start: "11:15", end: "11:55" },
            { name: "Advisory 9+11", start: "11:55", end: "12:40" },
            { name: "Class Meetings 9+11", start: "12:50", end: "1:35" },
            { name: "3rd Period", start: "1:45", end: "2:45" },
            { name: "4th Period", start: "2:55", end: "3:55" },
        ],
    },
    {
        date: "20230811",
        schedule: [
            { name: "5th Period", start: "9:00", end: "10:30" },
            { name: "Brunch", start: "10:30", end: "10:45" },
            { name: "6th Period", start: "10:45", end: "11:45" },
            { name: "Lunch", start: "11:45", end: "12:35" },
            { name: "7th Period", start: "12:35", end: "1:35" },
            { name: "Assembly", start: "1:45", end: "3:00" },
        ],
    }
]

const getCalendar = async () => {
    var response = await fetch("https://www.paly.net/data/calendar/icalcache/feed_480C4DDD5A484139AC879C9C72FE34B6.ics");
    // the response is an ical file, parse (relaibily)
    response = await response.text();
    // console.log(response);
    var icalEvents = response.split("BEGIN:VEVENT");
    var events = [];
    for(var i = 1; i < icalEvents.length; i++){
        var event = icalEvents[i].replaceAll("\r", "").replaceAll("\\r", "").split("\n");
        var eventObj = {};
        for(var j = 0; j < event.length; j++){
            var line = event[j];
            var key = line.split(":")[0].toLowerCase();

            if(key == "") continue;
            if(key == "end") break;

            var value = line.slice(key.length + 1);

            if(key == "dtstart;value=date") key = "dtstart";
            if(key == "dtstart") key = "start";
            if(key == "dtend;value=date") key = "dtend";
            if(key == "dtend") key = "end";

            if(key == "description") value = value.replaceAll("\\n", "\n");
            eventObj[key] = value;
        }
        if(eventObj.end == undefined) eventObj.end = eventObj.start;
        events.push(eventObj);
    }
    return events;
}

const getScheduleForDay = async (day) => {
    var events = await getCalendar();
    console.log(day);
    for(var i = 0; i < alternates.length; i++){
        var alternate = alternates[i];
        if(alternate.date == day){
            var schedule = [];
            for(var k in alternate.schedule){
                var period = alternate.schedule[k];
                var obj = {
                    startString: period.start,
                    start: calculateMinutesFromTime(period.start),
                    endString: period.end,
                    end: calculateMinutesFromTime(period.end),
                    name: period.name
                };
                if(obj.endString == "" || obj.startString == "" || obj.start == null || obj.end == null || obj.name == "") continue;
                schedule.push(obj);
            }
            return schedule;
        }
    }
    for(var i = 0; i < events.length; i++){
        var event = events[i];
        if(
            !event.summary.includes("Schedule") &&
            !event.summary.includes("Minimum Day") &&
            !event.summary.includes("Finals") &&
            !event.summary.includes("Schdule")
            /* ^ because pausd can't spell */
            /* it happened more than once */
        ) continue;
        if(event.start.trim() == day.trim()){
            var periods = event.description.split("\n");
            var schedule = [];
            for(var k in periods){
                var spaceless = periods[k].replaceAll(" ", "");
                var startTime = spaceless.split("-")[0];
                var goofy = periods[k].replaceAll(startTime, "");
                goofy = goofy.replaceAll("-", "");
                goofy = goofy.trim();
                var endTime = goofy.split(" ")[0];
                var obj = {
                    startString: startTime.trim(),
                    start: calculateMinutesFromTime(startTime),
                    endString: endTime.trim(),
                    end: calculateMinutesFromTime(endTime),
                    name: goofy.replaceAll(endTime, "").trim()
                };
                if(obj.endString == "" || obj.startString == "" || obj.start == null || obj.end == null || obj.name == "") continue;
                schedule.push(obj);
            }
            return schedule;
        }
    }
    return null;
}

const calculateMinutesFromTime = (timeString) => {
    var hour = parseInt(timeString.split(":")[0]);
    var time = (hour < 7 ? hour + 12 : hour) * 60
    time += parseInt(timeString.split(":")[1]);
    return time;
}

export {
    getScheduleForDay,
    getCalendar
}