import { useLayoutEffect } from "react";
import { TableData } from "../../types";
import { notifications } from "@mantine/notifications";

function Table({ data }: { data: TableData }) {
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
      <table id={data.id}>
        <thead>
          <tr>
            {data.columns.map((column, index) => (
              <th key={index} style={{ textAlign: column.align }}>
                {column.content}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index} style={{ textAlign: data.columns[index].align }}>
                  {cell}
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
