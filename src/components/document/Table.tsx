import { useLayoutEffect } from "react";
import { TableData } from "../../types";
import { notifications } from "@mantine/notifications";
import Link from "./Link";

function Table({ data, search, preview }: { data: TableData, search?: string, preview?: boolean }) {
  useLayoutEffect(() => {
    const handleScrollToElement = () => {
      if (window.location.hash === `#${data.id}` && data.id) {
        const element = document.getElementById(data.id);
        if (element) {
          const headerOffset = 40; // Adjust this value to match your header's height

          setTimeout(() => {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }, 100); // Adjust the delay as needed
        }
      }
    };

    handleScrollToElement();
    window.addEventListener("hashchange", handleScrollToElement);
    window.addEventListener("popstate", handleScrollToElement);

    return () => {
      window.removeEventListener("hashchange", handleScrollToElement);
      window.removeEventListener("popstate", handleScrollToElement);
    };
  }, [data.id]);

  const highlightText = (text: string) => {
    if (!search) {
      return text.split(/(<<[^>]+>>)/).map((part, index) => {
        if (part.startsWith("<<") && part.endsWith(">>")) {
          const [label, anchor] = part.slice(2, -2).split("|");
          return <Link key={index} anchor={anchor}>{label}</Link>;
        }
        return part;
      });
    }

    // First, create a plain text version to find matches
    const plainText = text
      .replace(/<<([^|]+)\|[^>]+>>/g, '$1');

    // Find all matches in the plain text
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`(${escapedSearch})`, 'gi');
    const matches: { start: number, end: number }[] = [];
    let match;
    while ((match = searchRegex.exec(plainText)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length });
    }

    if (matches.length === 0) {
      return text.split(/(<<[^>]+>>)/).map((part, index) => {
        if (part.startsWith("<<") && part.endsWith(">>")) {
          const [label, anchor] = part.slice(2, -2).split("|");
          return <Link key={index} anchor={anchor}>{label}</Link>;
        }
        return part;
      });
    }

    // Split the content into parts
    const parts = text.split(/(<<[^>]+>>)/);
    let currentPlainIndex = 0;
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let plainLength = 0;
      let content = '';
      let isLink = false;
      let anchor = '';

      if (part.startsWith("<<") && part.endsWith(">>")) {
        const [label, linkAnchor] = part.slice(2, -2).split("|");
        content = label;
        plainLength = label.length;
        isLink = true;
        anchor = linkAnchor;
      } else {
        content = part;
        plainLength = part.length;
      }

      // Find any matches that overlap with this part
      const partStart = currentPlainIndex;
      const partEnd = currentPlainIndex + plainLength;
      const relevantMatches = matches.filter(m =>
        (m.start >= partStart && m.start < partEnd) ||
        (m.end > partStart && m.end <= partEnd) ||
        (m.start <= partStart && m.end >= partEnd)
      );

      if (relevantMatches.length > 0) {
        let lastIndex = 0;
        const highlightedContent = relevantMatches.map((match, j) => {
          const matchStart = Math.max(match.start - partStart, 0);
          const matchEnd = Math.min(match.end - partStart, plainLength);
          const before = content.slice(lastIndex, matchStart);
          const highlighted = content.slice(matchStart, matchEnd);
          lastIndex = matchEnd;
          return (
            <>
              {before}
              <mark key={`${i}-${j}`}>{highlighted}</mark>
            </>
          );
        });

        const remaining = content.slice(lastIndex);
        const element = isLink ? (
          <Link key={i} anchor={anchor}>{highlightedContent}{remaining}</Link>
        ) : (
          <>{highlightedContent}{remaining}</>
        );
        result.push(element);
      } else {
        const element = isLink ? (
          <Link key={i} anchor={anchor}>{content}</Link>
        ) : (
          content
        );
        result.push(element);
      }

      currentPlainIndex += plainLength;
    }

    return result;
  };

  return (
    <>
      {!preview && data.id && (
        <div
          className="anchor"
          onClick={() => {
            window.location.hash = `#${data.id}`;
            try {
              navigator.clipboard.writeText(window.location.href);
              notifications.show({
                title: "Copied to clipboard",
                message: "Link copied to clipboard",
                color: "green",
              });
            } catch {
              notifications.show({
                title: "Error",
                message: "Failed to copy link to clipboard",
                color: "red",
              });
            }
          }}
        >
          #
        </div>
      )}
      <table id={!preview ? data.id : undefined}>
        <thead>
          <tr>
            {data.columns.map((column, index) => (
              <th key={index} style={{ textAlign: column.align }}>
                {highlightText(column.content)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index} style={{ textAlign: data.columns[index].align }}>
                  {highlightText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Table;
