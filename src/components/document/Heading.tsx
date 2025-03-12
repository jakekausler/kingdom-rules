import { HeadingData } from "../../types";
import Content from "./Content";


function Heading({ data }: { data: HeadingData }) {
  let heading = null;
  switch (data.level) {
    case 1:
      heading = <h1>{data.heading}</h1>;
      break;
    case 2:
      heading = <h2>{data.heading}</h2>;
      break;
    case 3:
      heading = <h3>{data.heading}</h3>;
      break;
    case 4:
      heading = <h4>{data.heading}</h4>;
      break;
    case 5:
      heading = <h5>{data.heading}</h5>;
      break;
    case 6:
      heading = <h6>{data.heading}</h6>;
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
