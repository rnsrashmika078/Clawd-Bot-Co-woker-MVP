import { Select } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { memo } from "react";

import { cn } from "@/lib/utils";

export interface ModelOption {
	id: string;
	label: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
	{ id: "local", label: "Local" },
	{ id: "groq", label: "Groq" },
];

interface ModelSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	options?: ModelOption[];
	className?: string;
}

export const ModelSelect = memo(
	({
		value,
		onValueChange,
		options = MODEL_OPTIONS,
		className,
	}: ModelSelectProps) => {
		return (
			<Select.Root
				modal={false}
				value={value}
				onValueChange={(next) => onValueChange((next ?? value) as string)}
				items={options.map((option) => ({
					value: option.id,
					label: option.label,
				}))}
			>
				<Select.Trigger
					className={cn(
						"flex h-7 items-center gap-1 rounded-md border border-border bg-transparent px-2 text-xs text-foreground outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
						className,
					)}
				>
					<Select.Value />
					<Select.Icon className="opacity-60">
						<ChevronDownIcon className="size-3.5" />
					</Select.Icon>
				</Select.Trigger>
				<Select.Portal>
					<Select.Positioner
						sideOffset={6}
						alignItemWithTrigger={false}
						className="z-[10000]"
					>
						<Select.Popup className="min-w-28 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none">
							{options.map((option) => (
								<Select.Item
									key={option.id}
									value={option.id}
									className="flex cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1 text-xs outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
								>
									<Select.ItemText>{option.label}</Select.ItemText>
									<Select.ItemIndicator>
										<CheckIcon className="size-3.5" />
									</Select.ItemIndicator>
								</Select.Item>
							))}
						</Select.Popup>
					</Select.Positioner>
				</Select.Portal>
			</Select.Root>
		);
	},
);
ModelSelect.displayName = "ModelSelect";
