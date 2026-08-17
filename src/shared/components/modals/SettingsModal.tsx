import { useSettingsContext } from "@/shared/context/SettingsContext";
import { SelectOption } from "@/shared/types/shared.types";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IoClose } from "react-icons/io5";
import { IconType } from "react-icons/lib";

// Selection options type for Modal settings ( UNION TYPE )

// Mini modal Context type
type SettingsModal = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectOption: SelectOption | null;
  setSelectOption: React.Dispatch<React.SetStateAction<SelectOption | null>>;
};

// the context of the mini modal
const SettingsModalContext = createContext<SettingsModal | null>(null);

//mini modal provider
const SettingsModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<SelectOption | null>(null);
  const values = useMemo(
    () => ({
      open,
      selectOption,
      setOpen,
      setSelectOption,
    }),
    [open, selectOption],
  );

  return (
    <SettingsModalContext.Provider value={values}>
      {children}
    </SettingsModalContext.Provider>
  );
};
//  use hook for use shared states within the mini modal only
const useSettingsModal = () => {
  const context = useContext(SettingsModalContext);

  if (!context)
    throw new Error(
      "SettingsModalContext must use within SettingsModalProvider",
    );

  return context;
};
// SettingsModalProps
interface SettingsModalProps {
  children?: ReactNode;
}

/**
 * ### SettingsModal
 * * pops up in corner of the screen
 *
 * ```tsx
 * <SettingsModalWrapper>
 *  <SettingsModalLayout>
 *   <SettingsModal></SettingsModal>
 *  <SettingsModalLayout>
 * </SettingsModalWrapper>
 * ```
 */
// Mini model wrapper ... this is the main component for the mini modal
export const SettingsModalWrapper = ({ children }: SettingsModalProps) => {
  console.log("WRAPPER");
  return <SettingsModalProvider>{children}</SettingsModalProvider>;
};
SettingsModalWrapper.displayName = "SettingsModalWrapper";

// mini modal layout props
interface SettingsModalLayoutProps {
  children?: ReactNode;
  className?: string;
  forceOpen?: boolean;
}
export const SettingsModalLayout = ({
  children,
  className,
  forceOpen,
}: SettingsModalLayoutProps) => {
  // const child = React.Children.toArray(children);
  const { open, setOpen } = useSettingsModal();
  const ref = React.useRef<HTMLDivElement>(null);
  const { setSelection } = useSettingsContext();

  // check weather the user click outside or not to open and close the modal
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSelection(null);
        const hash = window.location.hash;
        if (hash) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen, setSelection]);

  useEffect(() => {
    if (!forceOpen) return;
    setOpen(true);
  }, [forceOpen, setOpen]);
  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
      }}
    >
      {open && children}
    </div>
  );
};
interface SettingsModalBodyProps {
  children?: ReactNode;
}
export const SettingsModalBody = ({ children }: SettingsModalBodyProps) => {
  return (
    <div
      className={` fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-2xl min-w-[calc(100%-2rem)] w-1/2 h-1/2 bg-accent`}
    >
      <div className="border-r w-fit h-full">{children}</div>;
    </div>
  );
};

interface SettingsModalBarProps {
  items: { name: SelectOption; icon: IconType }[];
  setSelection?: React.Dispatch<React.SetStateAction<string | null>>;
  children?: ReactNode;
}
export const SettingsModalSideBar = ({
  items = [],
  setSelection,
}: SettingsModalBarProps) => {
  const { setOpen } = useSettingsModal();
  const handleSelect = (option: SelectOption) => {
    // setSelectOption(option);
    setSelection?.(option);
    // setOpen(false);
  };
  return (
    <div className="w-full h-full">
      <div className="px-2 py-2 border-b">
        <IoClose
          size={25}
          className="p-1 hover:bg-hover rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        />
      </div>
      <div className="h max-h-[calc(100%-3rem)] p-2 scrollbar-thin scrollbar-thumb-foreground overflow-y-auto">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <div
              onClick={(e) => {
                e.stopPropagation();
                // handleSelect(i.name as SelectOption);
                // setOpen(false);
                // setSelection(i.name);
              }}
              key={i.name}
              className="flex hover:bg-hover gap-2 items-center justify-start  p-2 rounded-md"
            >
              <Icon size={15} />
              {i.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
