export type ScheduleItem = {
    name: string,
    start: number,
    startString: string,
    end: number,
    endString: string,
    isFinal: boolean, // is this period a final exam?
}

export type CalendarEvent = {
    start: string,
    end: string,
    summary: string,
    description: string
}