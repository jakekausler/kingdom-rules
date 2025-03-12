import { useMantineColorScheme } from "@mantine/core";
import { ParsedElement } from "../../types";
import Ruleset from "../document/Ruleset";

function Body({ ruleset }: { ruleset: ParsedElement[] }) {
  return (
    <div id="result" className={`${useMantineColorScheme().colorScheme === 'dark' ? 'dark' : ''}`}>
      <Ruleset ruleset={ruleset} />
    </div>
  );
}

export default Body;
