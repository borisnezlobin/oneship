import { createContext, useContext } from "react";

class Assignment{
    constructor(assignmentName, description, dueDate, importance){
        this.assignmentName = assignmentName;
        this.dueDate = dueDate;
        this.description = description
        this.importance = importance;
    }
}

class CustomScheduleItem{
    constructor(realName, customName, teacher, room){
        this.realName = realName;
        this.customName = customName ? customName : realName;
        this.teacher = teacher;
        this.room = room;
        this.assignments = [];
        this.finishedAssignments = 0;
    }
    addAssignment(a){
        this.assignments.push(a);
    }
    removeAssignment(a){
        this.assignments.splice(this.assignments.indexOf(a), 1);
        this.finishedAssignments++;
    }
}

const defaultSettings = {
    show0Period: false,
    schedule: {
        "0 Period": new CustomScheduleItem("0 Period", null, null, null),
        "1st Period": new CustomScheduleItem("1st Period", null, null, null),
        "2nd Period": new CustomScheduleItem("2nd Period", null, null, null),
        "3rd Period": new CustomScheduleItem("3rd Period", null, null, null),
        "Lunch": new CustomScheduleItem("Lunch", null, null, null),
        "4th Period": new CustomScheduleItem("4th Period", null, null, null),
        "5th Period": new CustomScheduleItem("5th Period", null, null, null),
        "6th Period": new CustomScheduleItem("6th Period", null, null, null),
        "7th Period": new CustomScheduleItem("7th Period", null, null, null),
        "Advisory": new CustomScheduleItem("Advisory", null, null, null),
        "PRIME": new CustomScheduleItem("PRIME", null, null, null),
    },
    isLightMode: true,
}

const RouteContext = createContext("");
const PublicationsContext = createContext(null);
const UserSettingsContext = createContext(defaultSettings)

export {
    UserSettingsContext,
    RouteContext,
    PublicationsContext,
    defaultSettings,
    CustomScheduleItem,
    Assignment
}