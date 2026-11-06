import React from "react";

interface MarkdownContentProps {
    content: string;
    className?: string;
}

// Inline renderer for **bold**, `code`, and *italic*
function renderInline(text: string): React.ReactNode[] {
    // Regex matching **bold**, `code`, or *italic*
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={i} className="font-bold text-slate-900">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code
                    key={i}
                    className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#C9572C] font-bold border border-[#E7DFD5]"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }
        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
            return (
                <em key={i} className="italic text-slate-800">
                    {part.slice(1, -1)}
                </em>
            );
        }
        return part;
    });
}

export default function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
    if (!content) return null;

    const lines = content.split("\n");
    const blocks: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Skip empty lines
        if (!trimmed) {
            i++;
            continue;
        }

        // 2. Markdown Table Detection: line starts with | and contains |
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
                tableLines.push(lines[i].trim());
                i++;
            }

            if (tableLines.length >= 2) {
                // Header row
                const headerCells = tableLines[0]
                    .split("|")
                    .slice(1, -1)
                    .map((c) => c.trim());

                // Skip separator row (tableLines[1] usually | :--- | :--- |)
                const startRow = tableLines[1].includes("---") ? 2 : 1;
                const bodyRows = tableLines.slice(startRow).map((rowLine) =>
                    rowLine
                        .split("|")
                        .slice(1, -1)
                        .map((c) => c.trim())
                );

                blocks.push(
                    <div
                        key={`table-${i}`}
                        className="my-6 overflow-x-auto rounded-2xl border border-[#E7DFD5] bg-white shadow-xs"
                    >
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#FAF7F2] border-b border-[#E7DFD5]">
                                    {headerCells.map((cell, idx) => (
                                        <th
                                            key={idx}
                                            className="px-4 py-3 font-bold text-slate-900 uppercase tracking-wider text-[11px]"
                                        >
                                            {renderInline(cell)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E7DFD5]/60">
                                {bodyRows.map((row, rIdx) => (
                                    <tr
                                        key={rIdx}
                                        className={rIdx % 2 === 1 ? "bg-[#FAF7F2]/40" : "bg-white"}
                                    >
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="px-4 py-3 text-slate-700 leading-normal">
                                                {renderInline(cell)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                continue;
            }
        }

        // 3. Subheadings (### or ####)
        if (trimmed.startsWith("### ")) {
            const text = trimmed.replace(/^###\s+/, "");
            blocks.push(
                <h3
                    key={`h3-${i}`}
                    className="text-lg sm:text-xl font-black text-slate-900 mt-7 mb-3 tracking-tight"
                >
                    {renderInline(text)}
                </h3>
            );
            i++;
            continue;
        }

        if (trimmed.startsWith("#### ")) {
            const text = trimmed.replace(/^####\s+/, "");
            blocks.push(
                <h4
                    key={`h4-${i}`}
                    className="text-base font-bold text-slate-900 mt-5 mb-2"
                >
                    {renderInline(text)}
                </h4>
            );
            i++;
            continue;
        }

        // 4. Unordered List Items (* or -)
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            const listItems: string[] = [];
            while (
                i < lines.length &&
                (lines[i].trim().startsWith("* ") || lines[i].trim().startsWith("- "))
            ) {
                listItems.push(lines[i].trim().replace(/^[\*\-]\s+/, ""));
                i++;
            }

            blocks.push(
                <ul key={`ul-${i}`} className="space-y-3 my-4 pl-1">
                    {listItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9572C] mt-2 shrink-0"></span>
                            <div className="flex-1">{renderInline(item)}</div>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // 5. Standard Paragraphs
        const paragraphLines: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() &&
            !lines[i].trim().startsWith("|") &&
            !lines[i].trim().startsWith("#") &&
            !lines[i].trim().startsWith("* ") &&
            !lines[i].trim().startsWith("- ")
        ) {
            paragraphLines.push(lines[i].trim());
            i++;
        }

        if (paragraphLines.length > 0) {
            const pText = paragraphLines.join(" ");
            blocks.push(
                <p
                    key={`p-${i}`}
                    className="leading-relaxed text-slate-700 my-3 text-xs sm:text-sm md:text-base"
                >
                    {renderInline(pText)}
                </p>
            );
        }
    }

    return <div className={`markdown-body space-y-1 ${className}`}>{blocks}</div>;
}
