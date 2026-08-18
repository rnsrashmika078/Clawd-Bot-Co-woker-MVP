import { motion, AnimatePresence } from "framer-motion";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { FiSidebar } from "react-icons/fi";

// type
type SideBarType = {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};
// context
const SideBarContext = createContext<SideBarType | null>(null);

// provider
export function SideBarProvider({ children }: { children: ReactNode }) {
  const [toggle, setToggle] = useState<boolean>(false);

  const values = useMemo(
    () => ({
      toggle,
      setToggle,
    }),
    [toggle],
  );
  return (
    <SideBarContext.Provider value={values}>{children}</SideBarContext.Provider>
  );
}

export const useSideBar = () => {
  const context = useContext(SideBarContext);

  if (!context)
    throw new Error("useSidebar hook must be use within SideBarProvider");

  return context;
};
export function SideBarLayout({ children }: { children: ReactNode }) {
  return <SideBarProvider>{children}</SideBarProvider>;
}
export function SideBarBody({ children }: { children: ReactNode }) {
  const { toggle } = useSideBar();
  return (
    <AnimatePresence>
      <motion.div
        animate={{
          x: toggle ? `-100%` : `0%`,
          transition: { damping: 30, stiffness: 300, type: "spring" },
        }}
        className="w-64 z-[9999] h-screen fixed top-0 left-0 bg-red-500"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
export function SideBarContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
export function SideBarHeader({ children }: { children: ReactNode }) {
  return <div className="sticky top-0">{children}</div>;
}
export function SideBarFooter({ children }: { children: ReactNode }) {
  return <div className="sticky bottom-0">{children}</div>;
}

export function SidebarToggler() {
  const { setToggle, toggle } = useSideBar();

  return (
    <div className="fixed top-2 left-2 z-[99999]">
      {toggle && (
        <FiSidebar
          className="z-100"
          size={15}
          onClick={() => {
            setToggle((prev) => !prev);
          }}
        />
      )}
    </div>
  );
}
