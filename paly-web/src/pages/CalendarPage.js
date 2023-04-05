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
            <div>
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
            start: start,
            end: end,
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
                    console.log(selectedEvent)
                }}
            />
        </div>
    )
}

function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
}

export default CalendarPage