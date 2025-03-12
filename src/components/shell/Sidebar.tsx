import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

function Sidebar({ rulesets, setRuleset, toggle }: { rulesets: string[]; setRuleset: (ruleset: string) => void; toggle: () => void }) {
  return (
    <>
      {rulesets.map((key) => (
        <Link to={`/${key.replace(/\s+/g, '-')}`} key={key} style={{ textDecoration: 'none' }}>
          <Button
            m="xs"
            variant="subtle"
            onClick={() => {
              setRuleset(key);
              toggle();
            }}
          >
            {key}
          </Button>
        </Link>
      ))}
    </>
  );
}

export default Sidebar;