import { useAppContext } from "@/shared/context/AppContext";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { IoCreateOutline } from "react-icons/io5";
import { PiImagesSquareLight } from "react-icons/pi";
import {
  SideBarLayout,
  SidebarToggler,
  SideBarContent,
  SideBarBody,
  SideBarHeader,
  SideBarFooter,
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
      <SidebarToggler />
      <SideBarBody>
        {/* <SideBarContent></SideBarContent> */}
        <SideBarHeader>
          <Logo />
        </SideBarHeader>
        <SideBarFooter>
          <SettingsContextProvider>
            <User />
          </SettingsContextProvider>
        </SideBarFooter>
      </SideBarBody>
    </SideBarLayout>
  );
};

export default Sidebar;
