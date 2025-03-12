import { ListData } from "../../types";


function List({ data }: { data: ListData }) {
  return (
    <ul>
      {data.content.map((item, index) => (
        <li key={index}>
          {item.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((text, index) => {
            if (text.startsWith("**") && text.endsWith("**")) {
              return <strong key={index}>{text.slice(2, -2)}</strong>;
            } else if (text.startsWith("*") && text.endsWith("*")) {
              return <em key={index}>{text.slice(1, -1)}</em>;
            }
            return text;
          })}
        </li>
      ))}
    </ul>
  );
}

export default List;
