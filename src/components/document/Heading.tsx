import { useLayoutEffect, useState } from "react";
import { HeadingData } from "../../types";
import Content from "./Content";
import { notifications } from "@mantine/notifications";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import Link from "./Link";

function Heading({ data, search, displayPartial, preview }: { data: HeadingData, search?: string, displayPartial?: boolean, preview?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
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

  const renderHeading = () => {
    if (!search) {
      return data.heading.split(/(<<[^>]+>>)/).map((text, index) => {
        if (text.startsWith("<<") && text.endsWith(">>")) {
          const [label, anchor] = text.slice(2, -2).split("|");
          return <Link key={index} anchor={anchor}>{label}</Link>;
        }
        return text;
      });
    }

    // First, create a plain text version to find matches
    const plainText = data.heading.replace(/<<([^|]+)\|[^>]+>>/g, '$1');

    // Find all matches in the plain text
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`(${escapedSearch})`, 'gi');
    const matches: { start: number, end: number }[] = [];
    let match;
    while ((match = searchRegex.exec(plainText)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length });
    }

    if (matches.length === 0) {
      return data.heading.split(/(<<[^>]+>>)/).map((text, index) => {
        if (text.startsWith("<<") && text.endsWith(">>")) {
          const [label, anchor] = text.slice(2, -2).split("|");
          return <Link key={index} anchor={anchor}>{label}</Link>;
        }
        return text;
      });
    }

    // Split the content into parts
    const parts = data.heading.split(/(<<[^>]+>>)/);
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

  let heading = null;
  switch (data.level) {
    case 1:
      heading = <h1 style={!displayPartial ? { cursor: 'pointer' } : {}} id={!preview ? data.id : undefined}>{renderHeading()}</h1>;
      break;
    case 2:
      heading = <h2 style={!displayPartial ? { cursor: 'pointer' } : {}} id={!preview ? data.id : undefined}>{renderHeading()}</h2>;
      break;
    case 3:
      heading = <h3 style={!displayPartial ? { cursor: 'pointer' } : {}} id={!preview ? data.id : undefined}>{renderHeading()}</h3>;
      break;
    case 4:
      heading = <h4 style={!displayPartial ? { cursor: 'pointer' } : {}} id={!preview ? data.id : undefined}>{renderHeading()}</h4>;
      break;
    case 5:
      heading = <h5 style={!displayPartial ? { cursor: 'pointer' } : {}} id={!preview ? data.id : undefined}>{renderHeading()}</h5>;
      break;
    case 6:
      heading = <h6 style={!displayPartial ? { cursor: 'pointer' } : {}} id={!preview ? data.id : undefined}>{renderHeading()}</h6>;
      break;
    default:
      heading = null;
  }

  return (
    <div style={{ position: "relative" }}>
      {!preview && data.id && (
        <div
          className="anchor"
          onClick={() => {
            window.location.hash = `#${data.id}`
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
      <div className="collapsible">
        <div className="collapsible-header" onClick={() => setCollapsed(!collapsed)}>
          {!preview && (collapsed ? <IconChevronRight /> : <IconChevronDown />)}
          {heading}
        </div>
        {!displayPartial && (
          <div className="collapsible-content" style={{ display: collapsed ? "none" : "block" }}>
            <Content data={data.content} search={search} displayPartial={displayPartial} preview={preview} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Heading;
