import { SearchResult } from "../../types";
import Content from "../document/Content";
import { useMantineColorScheme } from "@mantine/core";

export default function SearchPopout({ result, search }: { result: SearchResult, search: string }) {

  return (
    <div id="result" className={`${useMantineColorScheme().colorScheme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-paper page d-flex flex-wrap a4">
        <div className="content">
          <Content data={[result.lastElementWithId || result.element]} search={search} preview={true} />
        </div>
      </div>
    </div>
  );
}
