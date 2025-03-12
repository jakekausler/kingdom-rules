import { HeadingData } from "../../types";
import Content from "./Content";


function Heading({ data }: { data: HeadingData }) {
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
    <>
      {heading}
      <Content data={data.content} />
    </>
  );
}

export default Heading;
