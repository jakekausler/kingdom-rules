import { Button, useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Sidebar({ rulesets, setRuleset, toggle, currentRuleset }: { rulesets: string[]; setRuleset: (ruleset: string) => void; toggle: () => void, currentRuleset: string }) {
  const navigate = useNavigate();
  const colorScheme = useMantineColorScheme().colorScheme;

  return (
    <>
      {rulesets.map((key) => (
        <Button
          m="xs"
          variant="subtle"
          key={key}
          onClick={() => {
            setRuleset(key);
            toggle();
            navigate(`/${key.replace(/\s+/g, '-')}`);
          }}
          style={{
            color: currentRuleset === key ? colorScheme === 'dark' ? '#806e45' : '#A76652' : colorScheme === 'dark' ? '#ffda9b' : '#5D0000',
          }}
        >
          {key}
        </Button>
      ))}
    </>
  );
}

export default Sidebar;