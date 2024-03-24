import { createContext } from "react";
import { StartupDataType, ServerUserDataType } from "../types";

const DataContext = createContext<StartupDataType>(null);
const UserDataContext = createContext<ServerUserDataType>(null);

export { DataContext, UserDataContext };
