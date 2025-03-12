import { ParagraphData } from "../../types";


function Paragraph({ data }: { data: ParagraphData }) {
  return (
    <p id={data.id}>
      {data.content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((text, index) => {
        if (text.startsWith("**") && text.endsWith("**")) {
          return <strong key={index}>{text.slice(2, -2)}</strong>;
        } else if (text.startsWith("*") && text.endsWith("*")) {
          return <em key={index}>{text.slice(1, -1)}</em>;
        }
        return text;
      })}
    </p>
  );
}

export default Paragraph;
