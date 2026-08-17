"use client";
import { HTMLAttributes, memo, ReactNode, useRef } from "react";
import { useSettingsContext } from "@/shared/context/SettingsContext";
import {
  MiniModal,
  MiniModalLayout,
  MiniModalWrapper,
} from "./modals/MiniModal";
import Settings from "./Settings";
import { UserCard } from "@/shared/components/cards/UserCard";

interface UserProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  name?: string;
  additional?: string;
  displayPicture?: string;
}
export const User = memo(({ children, ...rest }: UserProps) => {
  const { selection, setSelection } = useSettingsContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const handleSelection = (select: string | null) => {
    if (typeof window === "undefined") return;
    if (!select) return;
    if (select.toLowerCase().startsWith("settings")) {
      window.location.hash = "settings";
    }
    setSelection(select);
  };

  return (
    <div
      {...rest}
      ref={ref}
      className="flex hover:bg-hover p-2 rounded-xl w-full gap-2 items-center justify-between"
    >
      {children}
      <MiniModalWrapper>
        <MiniModalLayout>
          <UserCard />
          <MiniModal setSelection={(select) => handleSelection(select)} />
          <Settings />
        </MiniModalLayout>
      </MiniModalWrapper>
    </div>
  );
});

User.displayName = "User";
