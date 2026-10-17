import { memo, type ReactNode } from "react";
import ReactMarkDown, { type Components } from "react-markdown";

// Hoisted so the identity is stable across renders. A fresh `components`
// object on every render makes react-markdown re-parse the whole document.
const buildComponents = (isHuman: boolean) => ({
	p: ({ children }: { children?: ReactNode }) => (
		<p className={`leading-relaxed ${isHuman ? "m-0" : "m-1"}`}>{children}</p>
	),

	h1: ({ children }: { children?: ReactNode }) => (
		<h1 className="text-2xl font-bold">{children}</h1>
	),

	h2: ({ children }: { children?: ReactNode }) => (
		<h2 className="text-xl font-semibold">{children}</h2>
	),

	h3: ({ children }: { children?: ReactNode }) => (
		<h3 className="text-lg font-semibold mt-2">{children}</h3>
	),

	h4: ({ children }: { children?: ReactNode }) => (
		<h4 className="text-lg font-semibold mt-2">{children}</h4>
	),

	strong: ({ children }: { children?: ReactNode }) => (
		<strong className="font-bold ">{children}</strong>
	),

	table: ({ children }: { children?: ReactNode }) => (
		<table border={1} className=" mt-5 mb-5">
			{children}
		</table>
	),

	th: ({ children }: { children?: ReactNode }) => (
		<th className=" border-blue-500 px-0 bg-white text-black">{children}</th>
	),

	tr: ({ children }: { children?: ReactNode }) => (
		<tr className=" border-blue-500  px-0 md:p-3">{children}</tr>
	),

	td: ({ children }: { children?: ReactNode }) => (
		<td className="  border-blue-500 px-0 md:p-3">{children}</td>
	),
	br: () => <br className="" />,

	ul: ({ children }: { children?: ReactNode }) => (
		<ul className="list-disc ">{children}</ul>
	),

	ol: ({ children }: { children?: ReactNode }) => (
		<ol className="list-decimal">{children}</ol>
	),

	li: ({ children }: { children?: ReactNode }) => (
		<li className="ml-5 ">{children}</li>
	),

	blockquote: ({ children }: { children?: ReactNode }) => (
		<blockquote className="">{children}</blockquote>
	),

	hr: () => <hr className="border-gray-600 my-4" />,

	pre: ({ children }: { children?: ReactNode }) => (
		<div className=" max-w-full border mt-2 mb-2 overflow-auto scrollbar-thumb-accent scroll- max-h-72 p-5 rounded-2xl">
			<pre className="">{children}</pre>
		</div>
	),
});

// Cast because a stray second copy of @types/react (in the user profile's
// node_modules) makes react-markdown's own ReactNode type incompatible.
const HUMAN_COMPONENTS = buildComponents(true) as unknown as Components;
const AI_COMPONENTS = buildComponents(false) as unknown as Components;

interface MarkdownProps {
	content: string;
	isHuman?: boolean;
}

const Markdown = memo(
	({ content, isHuman = true }: MarkdownProps) => (
		<ReactMarkDown components={isHuman ? HUMAN_COMPONENTS : AI_COMPONENTS}>
			{content}
		</ReactMarkDown>
	),
	(prev, next) =>
		prev.content === next.content && prev.isHuman === next.isHuman,
);

Markdown.displayName = "Markdown";

export default Markdown;
