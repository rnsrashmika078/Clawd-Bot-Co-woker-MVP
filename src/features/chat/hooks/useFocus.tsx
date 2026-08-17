import { useAppContext } from "@/shared/context/AppContext";
import { RefObject, useEffect } from "react";

export const useFocus = (ref: RefObject<HTMLDivElement | null>) => {
  const { setToggle, toggle } = useAppContext();

  useEffect(() => {
    const mouseClick = (e: MouseEvent) => {
      if (!ref.current) return undefined;
      if (!ref.current.contains(e.target as Node)) {
        if (toggle) {
          setToggle(false);
        }
        // return false;
      }
    };
    document.addEventListener("mousedown", mouseClick);
    return () => document.removeEventListener("mousedown", mouseClick);
  }, [ref]);
};
