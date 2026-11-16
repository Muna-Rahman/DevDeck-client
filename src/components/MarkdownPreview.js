"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Custom components for ReactMarkdown to apply Tailwind styles to the rendered markdown.
const components = {
  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 pb-1 border-b border-black/10 dark:border-white/10" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2 pb-1 border-b border-black/5 dark:border-white/5" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-3 mb-1.5" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mt-3 mb-1" {...props} />,
  p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#0FB8A6] dark:text-[#3FE0C5] underline underline-offset-2 hover:opacity-80"
    />
  ),
  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="my-2 pl-3 border-l-2 border-[#0FB8A6] dark:border-[#3FE0C5] opacity-80 italic" {...props} />
  ),
  hr: ({ node }) => <hr className="my-4 border-black/10 dark:border-white/10" />,
  table: ({ node, ...props }) => (
    <div className="my-3 overflow-x-auto">
      <table className="min-w-full text-xs border-collapse" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th className="px-3 py-1.5 text-left font-semibold border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.06]" {...props} />
  ),
  td: ({ node, ...props }) => <td className="px-3 py-1.5 border border-black/10 dark:border-white/10" {...props} />,
  // Fenced blocks arrive as <pre><code class="language-x">, inline code is a bare <code>
  pre: ({ node, ...props }) => (
    <pre className="my-3 p-3 rounded-lg overflow-x-auto text-xs font-mono bg-[#EBEDF5] dark:bg-[#0B0E14] border border-black/5 dark:border-white/10 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[#0FB8A6] dark:[&>code]:text-[#3FE0C5]" {...props} />
  ),
  code: ({ node, className, children, ...rest }) =>
    className ? (
      <code className={`${className} font-mono text-[#0FB8A6] dark:text-[#3FE0C5]`} {...rest}>{children}</code>
    ) : (
      <code className="px-1 py-0.5 rounded text-[0.85em] font-mono bg-black/[0.06] dark:bg-white/10" {...rest}>{children}</code>
    ),
  input: ({ node, ...props }) => <input {...props} disabled className="mr-1.5 align-middle accent-[#0FB8A6]" />,
};

export default function MarkdownPreview({ source = "", emptyText = "Nothing to preview yet.", className = "" }) {
  if (!source.trim()) {
    return <p className={`text-xs italic text-zinc-500 ${className}`}>{emptyText}</p>;
  }

  return (
    <div className={`text-sm break-words ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}