"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IoCreateOutline } from "react-icons/io5";
import { PiImagesSquareLight } from "react-icons/pi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { memo } from "react";
import { useAppContext } from "@/shared/context/AppContext";
import Logo from "@/shared/components/Logo";
import { User } from "@/shared/components/User";
import { SettingsContextProvider } from "../context/SettingsContext";

const AppSidebar = memo(() => {
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
    <div className="fixed top-0 left-0 z-100 text-xs ">
      <SidebarProvider >
        <Sidebar>
          <SidebarContent className="text-xs">
            <SidebarHeader className="sticky top-0">
              <Logo />
              {items.map((i) => {
                const Icon = i.icon;
                return (
                  <div
                    key={i.name}
                    className="flex  gap-2 items-center justify-start hover:bg-hover p-2 rounded-md"
                  >
                    <Icon size={15} />
                    {i.name}
                  </div>
                );
              })}
            </SidebarHeader>
            <SidebarHeader className="px-5 font-bold ">Threads</SidebarHeader>
            <SidebarGroup className="max-h-[calc(100%-10rem)] scrollbar">
              {threads.map((t) => (
                <div
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.location.hash = t;
                    setThread(t);
                  }}
                  className={`  flex-col px-4 mt-1 cursor-pointer transition-all py-2 hover:bg-hover select-none rounded-2xl ${
                    thread === t ? "bg-background" : ""
                  } w-full`}
                  key={t}
                >
                  {t}
                </div>
              ))}
            </SidebarGroup>
            <SidebarFooter>
              <SettingsContextProvider>
                <User />
              </SettingsContextProvider>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    </div>
  );
});

AppSidebar.displayName = "AppSidebar";

export default AppSidebar;
