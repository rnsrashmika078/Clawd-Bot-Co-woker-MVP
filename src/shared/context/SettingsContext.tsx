import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type SettingsContext = {
  selection: string | null;
  setSelection: React.Dispatch<React.SetStateAction<string | null>>;
};
const SettingsContext = createContext<SettingsContext | null>(null);

export const SettingsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selection, setSelection] = useState<string | null>(null);
  const values = useMemo(
    () => ({
      selection,
      setSelection,
    }),
    [selection],
  );

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error("error on use useSettingsContext");
  return context;
};
