import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { BsGear } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { IconType } from "react-icons/lib";

// Selection options type for Modal settings ( UNION TYPE )
type SelectOption = "Settings" | "Logout";

// Mini modal Context type
type MiniModal = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectOption: SelectOption | null;
  setSelectOption: React.Dispatch<React.SetStateAction<SelectOption | null>>;
};

// the context of the mini modal
const MiniModalContext = createContext<MiniModal | null>(null);

//mini modal provider
const MiniModalProvider = ({ children }: { children: ReactNode }) => {
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
    <MiniModalContext.Provider value={values}>
      {children}
    </MiniModalContext.Provider>
  );
};
//  use hook for use shared states within the mini modal only
const useMiniModal = () => {
  const context = useContext(MiniModalContext);

  if (!context)
    throw new Error("miniModalContext must use within MiniModalProvider");

  return context;
};
// MiniModalProps
interface MiniModalProps {
  children?: ReactNode;
}

/**
 * ### MiniModal
 * * pops up in corner of the screen
 *
 * ```tsx
 * <MiniModalWrapper>
 *  <MiniModalLayout>
 *   <MiniModal></MiniModal>
 *  <MiniModalLayout>
 * </MiniModalWrapper>
 * ```
 */
// Mini model wrapper ... this is the main component for the mini modal
export const MiniModalWrapper = ({ children }: MiniModalProps) => {
  return <MiniModalProvider>{children}</MiniModalProvider>;
};
MiniModalWrapper.displayName = "MiniModalWrapper";

// mini modal layout props
interface MiniModalLayoutProps {
  children?: ReactNode;
  className?: string;
}
export const MiniModalLayout = ({
  children,
  className,
}: MiniModalLayoutProps) => {
  const child = React.Children.toArray(children);
  const { open, setOpen } = useMiniModal();
  const ref = React.useRef<HTMLDivElement>(null);

  // check weather the user click oustide or not to open and close the modal
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <div
      ref={ref}
      className={`${className} relative w-full `}
      onClick={() => {
        setOpen((prev) => !prev);
      }}
    >
      {child[0]}
      {open && child[1]}
      {child[2]}
    </div>
  );
};

interface MiniModalMainProps {
  setSelection: (select: string | null) => void;
}
export const MiniModal = ({ setSelection }: MiniModalMainProps) => {
  const items: { name: SelectOption; icon: IconType }[] = [
    {
      name: "Settings",
      icon: BsGear,
    },
    {
      name: "Logout",
      icon: IoLogOutOutline,
    },
  ];
  const { setSelectOption, setOpen } = useMiniModal();
  const handleSelect = (option: SelectOption) => {
    setSelectOption(option);
    setSelection(option);
    setOpen(false);
  };
  return (
    <div className="select-none absolute -top-24 border rounded-2xl p-2 w-full h-fit bg-accent">
      {items.map((i) => {
        const Icon = i.icon;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(i.name as SelectOption);

              setOpen(false);
              setSelection(i.name);
            }}
            key={i.name}
            className="flex  gap-2 items-center justify-start hover:bg-hover p-2 rounded-md"
          >
            <Icon size={15} />
            {i.name}
          </div>
        );
      })}
    </div>
  );
};
