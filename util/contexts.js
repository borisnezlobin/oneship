import { createContext, useContext } from "react";

class CustomScheduleItem{
    constructor(realName, customName, teacher, room){
        this.realName = realName;
        this.customName = customName ? customName : realName;
        this.teacher = teacher;
        this.room = room;
    }
}

const defaultSettings = {
    show0Period: false,
    schedule: [
        new CustomScheduleItem("0 Period", null, null, null),
        new CustomScheduleItem("1st Period", "Biology Honors", "Nicole Loomis", "1706"),
        new CustomScheduleItem("2nd Period", null, null, null),
        new CustomScheduleItem("3rd Period", null, null, null),
        new CustomScheduleItem("Lunch", null, null, null),
        new CustomScheduleItem("4th Period", "Geometry Honors", "Daniel Ngyuen", "810"),
        new CustomScheduleItem("5th Period", "Art Spectrum 1A", null, null),
        new CustomScheduleItem("6th Period", null, null, null),
        new CustomScheduleItem("Advisory", null, null, null),
        new CustomScheduleItem("7th Period", null, null, null),
    ]
}

const UserSettingsContext = createContext(defaultSettings)

export { UserSettingsContext, defaultSettings }