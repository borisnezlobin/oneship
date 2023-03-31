import React from 'react'
import CONFIG from '../util/config'

const ScheduleItem = ({ scheduleItem, startTime, endTime }) => {
  return (
    <div style={{
        height: window.innerHeight * ((scheduleItem.end - scheduleItem.start) / (endTime - startTime)),
        top: window.innerHeight * ((scheduleItem.start - startTime) / (endTime - startTime)),
        position: "absolute",
        width: window.innerWidth - 128 - 16 - CONFIG.NAVBAR_WIDTH,
        borderRadius: 4,
        marginLeft: 128 + 16,
        justifyContent: "flex-start",
        textAlign: "left",
        backgroundColor: "white"
    }}>
        <p className='mediumText'>
            {scheduleItem.name}
            <span style={{
                color: "grey",
                fontSize: 16,
                marginLeft: 8
            }}>
                {scheduleItem.startString} - {scheduleItem.endString}, {scheduleItem.end - scheduleItem.start} minutes long
            </span>
        </p>
    </div>
  )
}

export default ScheduleItem