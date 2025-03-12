import { ItemData } from "../../types";
import Content from "./Content";


function Item({ data }: { data: ItemData }) {
  return (
    <div className="item" id={data.id}>
      <h1>{data.heading}</h1>
      <h2>{data.subheading}</h2>
      <Content data={data.content} />
    </div>
  );
}

export default Item;
