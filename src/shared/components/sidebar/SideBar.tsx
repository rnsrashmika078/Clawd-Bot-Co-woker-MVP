import { useAppContext } from "@/shared/context/AppContext";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { IoCreateOutline } from "react-icons/io5";
import { PiImagesSquareLight } from "react-icons/pi";
import {
  SideBarLayout,
  SidebarToggler,
  SideBarBody,
  SideBarHeader,
  SideBarFooter,
  SideBarGroup,
} from "./SideBarElements";
import Logo from "../Logo";
import { User } from "../User";
import { SettingsContextProvider } from "@/shared/context/SettingsContext";

const Sidebar = () => {
  const { thread, setThread } = useAppContext();
  const items = [
    {
      name: "New chat",
      icon: IoCreateOutline,
    },
    {
      name: "Images",
      icon: PiImagesSquareLight,
    },
    {
      name: "Documents",
      icon: HiOutlineDocumentDuplicate,
    },
    {
      name: "MCP",
      icon: HiOutlineDocumentDuplicate,
    },
  ];
  const threads = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
  ];
  return (
    <SideBarLayout>
      <SideBarBody className="bg-accent text-xs">
        {/* <SideBarContent></SideBarContent> */}
        <SideBarHeader>
          <Logo />
          <SideBarGroup className="px-2">
            {items.map((i) => {
              const Icon = i.icon;
              return (
                <div
                  key={i.name}
                  className="flex hover:bg-background gap-2 items-center justify-start hover:bg-hover p-2 rounded-md"
                >
                  <Icon size={15} />
                  {i.name}
                </div>
              );
            })}
          </SideBarGroup>
          <SideBarGroup className="h-[calc(100%-5rem)] overflow-y-auto custom-scrollbar-y p-2">
            {threads.map((t) => (
              <div
                onClick={() => {
                  if (typeof window === "undefined") return;
                  window.location.hash = t;
                  setThread(t);
                }}
                className={`  flex-col px-4 mt-1 cursor-pointer transition-all py-2 hover:bg-background select-none rounded-2xl ${
                  thread === t ? "bg-background" : ""
                } w-full`}
                key={t}
              >
                {t}
              </div>
            ))}
          </SideBarGroup>
        </SideBarHeader>
        <SideBarFooter>
          <SettingsContextProvider>
            <User />
          </SettingsContextProvider>
        </SideBarFooter>
      </SideBarBody>
      <SidebarToggler />
    </SideBarLayout>
  );
};

export default Sidebar;
