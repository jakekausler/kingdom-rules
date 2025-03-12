import { useMantineColorScheme } from "@mantine/core";
import { ParsedElement } from "../../types";
import Ruleset from "../document/Ruleset";

function Body({ ruleset, search }: { ruleset: ParsedElement[], search: string }) {
  return (
    <div id="result" className={`${useMantineColorScheme().colorScheme === 'dark' ? 'dark' : ''}`}>
      <Ruleset ruleset={ruleset} search={search} />
    </div>
  );
}

export default Body;
