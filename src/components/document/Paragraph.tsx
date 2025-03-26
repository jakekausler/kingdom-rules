import { useLayoutEffect } from "react";
import { ParagraphData } from "../../types";
import { notifications } from "@mantine/notifications";
import Link from "./Link";

function Paragraph({ data, search, preview }: { data: ParagraphData, search?: string, preview?: boolean }) {
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

  const renderContent = () => {
    if (!search) {
      return data.content.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<<[^>]+>>)/).map((text, index) => {
        if (text.startsWith("**") && text.endsWith("**")) {
          return <strong key={index}>{text.slice(2, -2)}</strong>;
        } else if (text.startsWith("*") && text.endsWith("*")) {
          return <em key={index}>{text.slice(1, -1)}</em>;
        } else if (text.startsWith("<<") && text.endsWith(">>")) {
          const [label, anchor] = text.slice(2, -2).split("|");
          return <Link key={index} anchor={anchor}>{label}</Link>;
        } else {
          return text;
        }
      });
    }

    // First, create a plain text version to find matches
    const plainText = data.content
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/<<([^|]+)\|[^>]+>>/g, '$1');

    // Find all matches in the plain text
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`(${escapedSearch})`, 'gi');
    const matches: { start: number, end: number }[] = [];
    let match;
    while ((match = searchRegex.exec(plainText)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length });
    }

    // Split the content into parts
    const parts = data.content.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<<[^>]+>>)/);
    let currentPlainIndex = 0;
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let plainLength = 0;
      let content = '';
      let type = 'text';

      if (part.startsWith("**") && part.endsWith("**")) {
        content = part.slice(2, -2);
        plainLength = content.length;
        type = 'bold';
      } else if (part.startsWith("*") && part.endsWith("*")) {
        content = part.slice(1, -1);
        plainLength = content.length;
        type = 'italic';
      } else if (part.startsWith("<<") && part.endsWith(">>")) {
        const label = part.slice(2, -2).split("|")[0];
        content = label;
        plainLength = label.length;
        type = 'link';
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
        const element = (
          type === 'bold' ? <strong key={i}>{highlightedContent}{remaining}</strong> :
            type === 'italic' ? <em key={i}>{highlightedContent}{remaining}</em> :
              type === 'link' ? <Link key={i} anchor={part.slice(2, -2).split("|")[1]}>{highlightedContent}{remaining}</Link> :
                <>{highlightedContent}{remaining}</>
        );
        result.push(element);
      } else {
        const element = (
          type === 'bold' ? <strong key={i}>{content}</strong> :
            type === 'italic' ? <em key={i}>{content}</em> :
              type === 'link' ? <Link key={i} anchor={part.slice(2, -2).split("|")[1]}>{content}</Link> :
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
      <p id={!preview ? data.id : undefined} className={data.content.startsWith("**") ? "hang" : ""}>
        {renderContent()}
      </p>
    </>
  );
}

export default Paragraph;
