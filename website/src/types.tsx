export type ScheduleItem = {
  name: string;
  start: number;
  startString: string;
  end: number;
  endString: string;
  isFinal: boolean; // is this period a final exam?
};

export type CalendarEvent = {
  start: string;
  end: string;
  summary: string;
  description: string;
};

export type SportEvent = {
  date: string;
  teamLink: string;
  result: string;
  opponent: string;
  eventName: string;
  location: string;
  time: string;
  team: string;
  isHomeGame: boolean;
};

export type SportEvents = {
  date: string;
  events: SportEvent;
};

export type StartupDataType = {
  lastUpdate: string;
  schedule: { value: null | ScheduleItem[]; date: string };
  news: any[]; // todo: not be lazy
  calendar: CalendarEvent[];
  sports: SportEvents[];
} | null;

export type UserDataType = any; // todo: figure out how to make this always be in sync with server types

export type ServerUserDataType = {
  data: UserDataType;
  messages: any[]; // todo: not be lazy
  token: string;
  refreshToken: string;
} | null;
