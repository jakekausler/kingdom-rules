import { useLayoutEffect } from "react";
import { ParagraphData } from "../../types";
import { notifications } from "@mantine/notifications";
import React from "react";

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
        {data.content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((text, index) => {
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
              return formattedText.split(new RegExp(`(${search})`, 'i')).map((part, i) =>
                part.toLowerCase() === search.toLowerCase() ? (
                  <mark key={i}>{part}</mark>
                ) : (
                  part
                )
              );
            } else {
              return React.cloneElement(formattedText, {},
                formattedText.props.children.split(new RegExp(`(${search})`, 'i')).map((part: string, i: number) =>
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
      </p>
    </>
  );
}

export default Paragraph;
