import { ListData } from "../../types";
import React from "react";


function List({ data, search }: { data: ListData, search?: string }) {
  return (
    <ul>
      {data.content.map((item, index) => (
        <li key={index}>
          {item.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((text, index) => {
            let formattedText;
            if (text.startsWith("**") && text.endsWith("**")) {
              formattedText = <strong key={index}>{text.slice(2, -2)}</strong>;
            } else if (text.startsWith("*") && text.endsWith("*")) {
              formattedText = <em key={index}>{text.slice(1, -1)}</em>;
            } else {
              formattedText = text;
            }

            if (search) {
              if (typeof formattedText === 'string') {
                return formattedText.split(new RegExp(`(${search})`, 'i')).map((part: string, i: number) =>
                  part.toLowerCase() === search.toLowerCase() ? (
                    <mark key={i}>{part}</mark>
                  ) : (
                    part
                  )
                );
              } else {
                return React.cloneElement(formattedText, {},
                  (formattedText.props.children || '').split(new RegExp(`(${search})`, 'i')).map((part: string, i: number) =>
                    part.toLowerCase() === search.toLowerCase() ? (
                      <mark key={i}>{part}</mark>
                    ) : (
                      part
                    )
                  )
                );
              }
            }

            return formattedText;
          })}
        </li>
      ))}
    </ul>
  );
}

export default List;
