import { useLayoutEffect, useState } from "react";
import { ItemData } from "../../types";
import Content from "./Content";
import { notifications } from "@mantine/notifications";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

function Item({ data }: { data: ItemData }) {
  const [collapsed, setCollapsed] = useState(false);
  useLayoutEffect(() => {
    const handleScrollToElement = () => {
      if (window.location.hash === `#${data.id}` && data.id) {
        const element = document.getElementById(data.id);
        if (element) {
          const headerOffset = 40; // Adjust this value to match your header's height

          // Use a timeout to ensure the DOM is fully loaded
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

    // Initial check in case the component mounts with a hash
    handleScrollToElement();

    // Add event listeners for hash changes and popstate
    window.addEventListener("hashchange", handleScrollToElement);
    window.addEventListener("popstate", handleScrollToElement);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("hashchange", handleScrollToElement);
      window.removeEventListener("popstate", handleScrollToElement);
    };
  }, [data.id]);

  return (
    <div className="item" id={data.id}>
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
      <div className="collapsible">
        <div className="collapsible-header" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <IconChevronRight /> : <IconChevronDown />}
          <h1>{data.heading}</h1>
          <h2>{data.subheading}</h2>
        </div>
        <div className="collapsible-content" style={{ display: collapsed ? "none" : "block" }}>
          <Content data={data.content} />
        </div>
      </div>
    </div>
  );
}

export default Item;
