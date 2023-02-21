import { createContext, useContext } from "react";

const defaultSettings = {
    show0Period: false,
}

const UserSettingsContext = createContext(defaultSettings)

export { UserSettingsContext, defaultSettings }