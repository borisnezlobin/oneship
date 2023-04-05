import React, { useContext, useState } from 'react'
import { DEFAULT_PAGE_STYLES } from '../util/config'
import { CalendarContext } from '../util/contexts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { Calendar } from 'phosphor-react';

const CalendarPage = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { calendar } = useContext(CalendarContext);

    if(calendar == null){
        return (
            <div className='flex' style={DEFAULT_PAGE_STYLES}>
                <Calendar size={128} color="var(--green)" weight='thin' />
                <p className='mediumText'>
                    Loading calendar data...
                </p>
            </div>
        )
    }

    var events = [];
    for(var i = 0; i < calendar.length; i++){
        if(calendar[i].summary === "Schedule") continue;
        var start = calendar[i].start.dateTime === undefined ? calendar[i].start.date : calendar[i].start.dateTime;
        var end = calendar[i].end.dateTime === undefined ? calendar[i].end.date : calendar[i].end.dateTime;

        
        events.push({
            title: calendar[i].summary.split(" - ")[0],
            start: start == end ? "" : start,
            end: start == end ? "": end,
            allDay: start == end,
            extendedProps: {
                url: calendar[i].htmlLink,
                desc: calendar[i].description
            }
        })
    }

    return (
        <div style={DEFAULT_PAGE_STYLES}>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={events}
                eventContent={renderEventContent}
                eventClick={(e) => {
                    setSelectedEvent(e);
                    console.log(e)
                }}
            />
        </div>
    )
}

function renderEventContent(eventInfo) {
    console.log(eventInfo);
    var timeToDisplay = eventInfo.timeText == "12a" ? "" : eventInfo.timeText + "m";
    return (
        <div style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "10.8vw",
            padding: 4,
            cursor: "pointer"
        }}>
            <b style={{ fontWeight: "bold" }}>
                {timeToDisplay}
            </b>
            <span>
                {" "}{eventInfo.event.title}
            </span>
        </div>
    )
}

export default CalendarPage