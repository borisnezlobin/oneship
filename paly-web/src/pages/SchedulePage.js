import React, { useContext, useEffect, useState } from 'react'
import { ScheduleContext } from '../util/contexts'
import ScheduleItem from '../components/ScheduleItem';
import CONFIG from '../util/config';
import { Clock, Confetti } from 'phosphor-react';

const SchedulePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date(Date.now()));
    const { schedule } = useContext(ScheduleContext);

    useEffect(() => {
        setTimeout(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000)
    }, [currentTime])

    if(schedule == null) {
        return (
            <div className="default-page flex">
                <Clock color='var(--green)' size={128} weight="light" />
                <p className='mediumText'>Loading your schedule for today...</p>
            </div>
        )
    }

    if(schedule.data[0].name === "No school"){
        return (
            <div className='flex default-page' style={{ gap: 0 }}>
                <p style={{
                    fontFamily: "monospace",
                    fontSize: "5rem",
                    color: "var(--text)",
                    margin: 0
                }}>
                    {currentTime.getHours() < 10 ? "0" : ""}{currentTime.getHours()}:
                    {currentTime.getMinutes() < 10 ? "0" : ""}{currentTime.getMinutes()}:
                    {currentTime.getSeconds() < 10 ? "0" : ""}{currentTime.getSeconds()}
                </p>
                <p style={{
                    fontFamily: "monospace",
                    fontSize: "1.5rem",
                    color: "var(--green)",
                    margin: 0,
                }}>
                    {currentTime.toLocaleDateString("en-us", {
                        day: "numeric",
                        month: "long",
                        weekday: "long",
                        year: "numeric"
                    })}
                </p>
                <div style={{margin: 64}} />
                <Confetti weight='light' color='var(--green)' size={128} />
                <p className='mediumText'>
                    No school today!
                </p>
            </div>
        )
    }

    const startTime = schedule.data[0].start;
    const endTime = schedule.data[schedule.data.length - 1].end;

    const now = currentTime.getHours() * 60 + currentTime.getMinutes();

    return (
        <div style={{
            backgroundColor: "var(--bg)",
            paddingLeft: CONFIG.NAVBAR_WIDTH,
            height: window.innerHeight
        }}>
            
            {schedule == null ? "loading" : schedule.data.map((e, i) => {
                return (
                    <ScheduleItem key={i} scheduleItem={e} endTime={endTime} startTime={startTime} />
                )
            })}
            <div style={{
                position: "absolute",
                left: 8 + CONFIG.NAVBAR_WIDTH,
                top: window.innerHeight * ((now - startTime) / (endTime - startTime)),
                backgroundColor: "var(--red)",
                color: "var(--text)",
                fontWeight: "bold",
                width: 128,
                textAlign: "center",
                borderRadius: 8,
                height: "48px",
                lineHeight: "48px",
                fontFamily: "monospace",
                fontSize: "x-large"
            }}>
                <div style={{
                    width: window.innerWidth - CONFIG.NAVBAR_WIDTH - 8,
                    height: 1,
                    backgroundColor: "var(--red)",
                    position: "absolute",
                    left: 0,
                    zIndex: 1,
                    top: 23.5,
                }} />
                <p style={{ zIndex: 2, margin: 0, position: "relative", color: "white" }}>
                    {currentTime.getHours()}:
                    {currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes()}:
                    {currentTime.getSeconds() < 10 ? "0" + currentTime.getSeconds() : currentTime.getSeconds()}
                </p>
            </div>
        </div>
    )
}

export default SchedulePage