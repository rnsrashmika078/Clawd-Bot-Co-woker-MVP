import { useIsMobile } from "@/shared/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [toggle, setToggle] = useState<boolean>(true);

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
export function SideBarBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { toggle, setToggle } = useSideBar();
  const focusRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      function handleMouseEvent(e: MouseEvent) {
        if (!focusRef.current?.contains(e.target as Node)) {
          setToggle(false);
          // console.log(e.target);
        }
      }

      window.addEventListener("mousedown", handleMouseEvent);
      return () => {
        // focusRef.current = null;
        window.removeEventListener("mousedown", handleMouseEvent);
      };
    }
  }, [isMobile, setToggle]);

  return (
    <AnimatePresence>
      <motion.div
        ref={focusRef}
        animate={{
          x: !toggle ? `-100%` : `0%`,
          transition: { damping: 30, stiffness: 300, type: "spring" },
        }}
        className={`flex  flex-col justify-between w-64 z-[9999] h-screen fixed top-0 left-0 ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
export function SideBarGroup({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
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
    <motion.div
      animate={{ opacity: toggle ? 0 : 1 }}
      className="fixed top-2.5 left-2.5 hover-icon z-[99999]"
    >
      {/* {toggle ? "TOGGLE" : "NOT TOGGLE"} */}
      <FiSidebar
        className="z-100"
        size={18}
        onClick={() => {
          if (toggle) return;
          setToggle((prev) => !prev);
        }}
      />
      {/* <span className="fixed top-0 left-0">
        {visibility ? "visibility" : "NOT visibility"}
      </span> */}
    </motion.div>
  );
}
