import { useEffect } from "react";
import { ParsedElement } from "../../types";
import Content from "./Content";
import { ActionIcon, Affix, useMantineColorScheme } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";

function Ruleset({ ruleset, search }: { ruleset: ParsedElement[], search?: string }) {
  const colorScheme = useMantineColorScheme().colorScheme;
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToTop();
  }, [ruleset]);

  useEffect(() => {
  }, [search]);

  return (
    <div className="bg-paper page d-flex flex-wrap a4" style={{ marginBottom: 20 }}>
      <div className="content">
        <Content data={ruleset} search={search} />
      </div>
      <Affix position={{ bottom: 20, right: 20 }}>
        <ActionIcon variant="filled" color={colorScheme === 'dark' ? '#ffda9b' : '#5D0000'} onClick={scrollToTop}>
          <IconArrowUp />
        </ActionIcon>
      </Affix>
    </div>
  );
}

export default Ruleset;
