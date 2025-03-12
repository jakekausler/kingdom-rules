import { useLayoutEffect } from "react";
import { ParagraphData } from "../../types";
import { notifications } from "@mantine/notifications";

function Paragraph({ data }: { data: ParagraphData }) {
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
      {data.id && (
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
      <p id={data.id} className={data.content.startsWith("**") ? "hanging" : ""}>
        {data.content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((text, index) => {
          if (text.startsWith("**") && text.endsWith("**")) {
            return <strong key={index}>{text.slice(2, -2)}</strong>;
          } else if (text.startsWith("*") && text.endsWith("*")) {
            return <em key={index}>{text.slice(1, -1)}</em>;
          }
          return text;
        })}
      </p>
    </>
  );
}

export default Paragraph;
