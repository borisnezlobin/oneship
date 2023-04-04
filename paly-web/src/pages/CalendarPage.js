import React, { useContext } from 'react'
import { DEFAULT_PAGE_STYLES } from '../util/config'
import { CalendarContext } from '../util/contexts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { Calendar } from 'phosphor-react';

const CalendarPage = () => {
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
        events.push({
            title: calendar[i].summary,
            start: calendar[i].start.date,
            end: calendar[i].end.date
        })
    }

    return (
        <div style={DEFAULT_PAGE_STYLES}>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={events}
                eventContent={renderEventContent}
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