import { ListData } from "../../types";
import Link from "./Link";

function List({ data, search }: { data: ListData, search?: string }) {
  const renderItem = (item: string) => {
    if (!search) {
      return item.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<<[^>]+>>)/).map((text, index) => {
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
    const plainText = item
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

    if (matches.length === 0) {
      return item.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<<[^>]+>>)/).map((text, index) => {
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

    // Split the content into parts
    const parts = item.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<<[^>]+>>)/);
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
    <ul>
      {data.content.map((item, index) => (
        <li key={index}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

export default List;
