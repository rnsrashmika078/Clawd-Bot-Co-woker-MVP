import { HTMLAttributes, memo, ReactNode } from "react";
import DisplayPicture from "@/assets/biome-logo.svg";

interface UserProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  name?: string;
  additional?: string;
  displayPicture?: string;
}
export const UserCard = memo(
  ({ additional, name, displayPicture }: UserProps) => {
    return (
      <div className="flex gap-2 items-center">
        <img
          src={DisplayPicture ?? displayPicture}
          alt="display_picture"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col">
          <span>{`${name ?? "Rashmika Siriwardhana"}`}</span>
          <span className="text-xs">{`${additional ?? "Free"}`}</span>
        </div>
      </div>
    );
  },
);
UserCard.displayName = "UserCard";
