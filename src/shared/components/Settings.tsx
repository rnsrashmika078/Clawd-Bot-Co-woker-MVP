import { memo } from "react";

import { BsGear } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { IconType } from "react-icons/lib";

import {
  SettingsModalBody,
  SettingsModalLayout,
  SettingsModalSideBar,
  SettingsModalWrapper,
} from "./modals/SettingsModal";
import { useSettingsContext } from "@/shared/context/SettingsContext";
import { SelectOption } from "@/shared/types/shared.types";

const Settings = memo(() => {
  const { selection, setSelection } = useSettingsContext();
  //   const [selection, setSelection] = useState<string | null>(null);
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

  return (
    <SettingsModalWrapper>
      <SettingsModalLayout forceOpen={selection === "Settings"}>
        <SettingsModalBody>
          <SettingsModalSideBar items={items} />
        </SettingsModalBody>
      </SettingsModalLayout>
    </SettingsModalWrapper>
  );
});
Settings.displayName = "Settings";

export default Settings;
