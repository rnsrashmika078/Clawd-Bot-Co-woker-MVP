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
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import { getThreads } from "@/features/chat/services/threadList";
import ThreadList from "./ThreadList";

const Sidebar = () => {
  const { setThread, setThreads, threads } = useAppContext();
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

  useEffect(() => {
    const storeThread = async () => {
      const allThreads = await getThreads();
      setThreads(allThreads);
    };
    storeThread();
  }, []);

  const handleAction = (item: string) => {
    if (item.startsWith("New chat")) {
      const threadId = uuid();
      setThread(threadId);
    }
  };

  return (
    <SideBarLayout>
      <SideBarBody className="bg-accent text-xs">
        <SideBarHeader>
          <Logo />
          <SideBarGroup className="px-2">
            {items.map((i) => {
              const Icon = i.icon;
              return (
                <div
                  key={i.name}
                  onClick={() => handleAction(i.name)}
                  className="flex hover:bg-background gap-2 items-center justify-start hover:bg-hover p-2 rounded-md"
                >
                  <Icon size={15} />
                  {i.name}
                </div>
              );
            })}
          </SideBarGroup>
          <SideBarGroup className="h-[calc(100%-5rem)] overflow-y-auto custom-scrollbar-y p-2">
            <ThreadList threads={threads} />
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
