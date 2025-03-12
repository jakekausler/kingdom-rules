import { ParsedElement } from "../../types";
import Ruleset from "../document/Ruleset";

function Body({ ruleset }: { ruleset: ParsedElement[] }) {
  return (
    <div id="result">
      <Ruleset ruleset={ruleset} />
    </div>
  );
}

export default Body;
