"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type AppContextType = {
  thread: string;
  setThread: React.Dispatch<React.SetStateAction<string>>;

  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};
const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [thread, setThread] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ thread, setThread, toggle, setToggle }}>
      {children}
    </AppContext.Provider>
  );
};
export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be use within AppContextProvider");
  }
  return context;
}
