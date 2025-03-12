import { ParsedElement } from "../../types";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import List from "./List";
import Table from "./Table";
import Item from "./Item";
import HR from "./HR";
import Traits from "./Traits";

function Content({ data }: { data: ParsedElement[] }) {
  return (
    <div>
      {data.map((element: ParsedElement, index: number) => {
        switch (element.type) {
          case "heading":
            return <Heading data={element} key={index} />;
          case "paragraph":
            return <Paragraph data={element} key={index} />;
          case "list":
            return <List data={element} key={index} />;
          case "table":
            return <Table data={element} key={index} />;
          case "item":
            return <Item data={element} key={index} />;
          case "hr":
            return <HR key={index} />;
          case "traits":
            return <Traits data={element} key={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default Content;
