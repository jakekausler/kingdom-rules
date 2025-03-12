import { SearchResult } from "../../types";
import Content from "../document/Content";

function SearchPreview({ result, search, onClick }: { result: SearchResult, search: string, onClick: () => void }) {
  return (
    <div className="search-preview content" onClick={onClick}>
      <Content data={[result.element]} search={search} displayPartial={true} preview={true} />
    </div>
  );
}

export default SearchPreview;