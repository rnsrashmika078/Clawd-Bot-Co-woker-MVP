import Chat from "./features/chat/components/Chat";
import Sidebar from "./shared/components/sidebar/Sidebar";

export default function App() {
  return (
    <div className="bg-gray-950 w-screen h-screen flex flex-col items-center justify-center gap-5 p-5 ">
      <div className="flex w-screen h-screen items-center justify-center ">
        <Sidebar />
        <div className="flex py-5 flex-col w-full h-full items-center justify-center overflow-y-auto">
          <Chat />
        </div>
      </div>
    </div>
  );
}
