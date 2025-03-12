import { useLayoutEffect, useState } from "react";
import { HeadingData } from "../../types";
import Content from "./Content";
import { notifications } from "@mantine/notifications";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

function Heading({ data }: { data: HeadingData }) {
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

  let heading = null;
  switch (data.level) {
    case 1:
      heading = <h1 id={data.id}>{data.heading}</h1>;
      break;
    case 2:
      heading = <h2 id={data.id}>{data.heading}</h2>;
      break;
    case 3:
      heading = <h3 id={data.id}>{data.heading}</h3>;
      break;
    case 4:
      heading = <h4 id={data.id}>{data.heading}</h4>;
      break;
    case 5:
      heading = <h5 id={data.id}>{data.heading}</h5>;
      break;
    case 6:
      heading = <h6 id={data.id}>{data.heading}</h6>;
      break;
    default:
      heading = null;
  }
  return (
    <div style={{ position: "relative" }}>
      {data.id && (
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
          {collapsed ? <IconChevronRight /> : <IconChevronDown />}
          {heading}
        </div>
        <div className="collapsible-content" style={{ display: collapsed ? "none" : "block" }}>
          <Content data={data.content} />
        </div>
      </div>
    </div>
  );
}

export default Heading;
