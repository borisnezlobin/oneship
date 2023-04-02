import { Calendar } from 'phosphor-react'
import React from 'react'
import { DEFAULT_PAGE_STYLES } from '../util/config'

const CalendarPage = () => {
    return (
        <div className='flex' style={DEFAULT_PAGE_STYLES}>
            <Calendar color='var(--green)' size={128} weight="thin" />
            <p className='bigText' style={{ fontWeight: "lighter" }}>
                Coming soon!
            </p>
        </div>
    )
}

export default CalendarPage