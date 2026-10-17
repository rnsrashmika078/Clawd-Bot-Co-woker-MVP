import { Button } from "@base-ui/react";
import { lazy, useState } from "react";
import { MdSwitchRight } from "react-icons/md";
import Chat from "./features/chat/components/Chat";
import Sidebar from "./shared/components/sidebar/SideBar";

const Preview = lazy(() => import("@/features/preview/components/Preview"));

export default function App() {
	const [showPreview, setShowPreview] = useState(true);

	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<Sidebar />

			<main className="flex h-full min-w-0 flex-1 overflow-hidden">
				<section
					className={`h-full min-w-0 overflow-hidden md:flex md:w-1/2 ${
						showPreview ? "flex w-full" : "hidden"
					}`}
				>
					<Preview />
				</section>

				<section
					className={`h-full min-w-0 overflow-hidden md:flex md:w-1/2 ${
						showPreview ? "hidden" : "flex w-full"
					}`}
				>
					<Chat />
				</section>
			</main>

			<div className="fixed top-2 left-1/2 z-50 -translate-x-1/2 md:hidden">
				<Button
					aria-label={showPreview ? "Show chat" : "Show preview"}
					onClick={() => setShowPreview((prev) => !prev)}
				>
					<MdSwitchRight
						className={`transition-all duration-300 ${
							showPreview ? "rotate-180" : "rotate-0"
						}`}
					/>
				</Button>
			</div>
		</div>
	);
}
