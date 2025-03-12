import { TableData } from "../../types";

function Table({ data }: { data: TableData }) {
  return (
    <table>
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
  );
}

export default Table;
