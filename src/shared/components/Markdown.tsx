import React from "react";
import ReactMarkDown from "react-markdown";
const Markdown = ({
  content,
  isHuman = true,
}: {
  content: string;
  isHuman?: boolean;
}) => {
  return (
    <ReactMarkDown
      components={{
        p: ({ children }) => (
          <p className={`leading-relaxed ${isHuman ? "m-0" : "m-1"}`}>
            {children}
          </p>
        ),

        h1: ({ children }) => (
          <h1 className="text-2xl font-bold">{children}</h1>
        ),

        h2: ({ children }) => (
          <h2 className="text-xl font-semibold">{children}</h2>
        ),

        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold mt-2">{children}</h4>
        ),

        strong: ({ children }) => (
          <strong className="font-bold ">{children}</strong>
        ),
        table: ({ children }) => (
          <table border={1} className=" mt-5 mb-5">
            {children}
          </table>
        ),
        th: ({ children }) => (
          <th className=" border-blue-500 px-0 bg-white text-black">
            {children}
          </th>
        ),
        tr: ({ children }) => (
          <tr className=" border-blue-500  px-0 md:p-3">{children}</tr>
        ),
        td: ({ children }) => (
          <td className="  border-blue-500 px-0 md:p-3">{children}</td>
        ),
        br: ({ children }) => <br className="">{children}</br>,

        ul: ({ children }) => <ul className="list-disc ">{children}</ul>,

        ol: ({ children }) => <ol className="list-decimal">{children}</ol>,

        li: ({ children }) => <li className="ml-5 ">{children}</li>,

        blockquote: ({ children }) => (
          <blockquote className="">{children}</blockquote>
        ),

        hr: () => <hr className="border-gray-600 my-4" />,

        pre: ({ children }) => (
          <div className=" max-w-full border mt-2 mb-2 overflow-auto scrollbar-thumb-accent scroll- max-h-72 p-5 rounded-2xl">
            <pre className="">{children}</pre>
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkDown>
  );
};

export default Markdown;
