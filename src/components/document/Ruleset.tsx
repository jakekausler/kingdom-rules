import { useEffect } from "react";
import { ParsedElement } from "../../types";
import Content from "./Content";
import { ActionIcon, Affix } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";

function Ruleset({ ruleset }: { ruleset: ParsedElement[] }) {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToTop();
  }, [ruleset]);

  return (
    <div className="bg-paper page d-flex flex-wrap a4" style={{ marginBottom: 20 }}>
      <div className="content">
        <Content data={ruleset} />
      </div>
      <Affix position={{ bottom: 20, right: 20 }}>
        <ActionIcon variant="filled" color="blue" onClick={scrollToTop}>
          <IconArrowUp />
        </ActionIcon>
      </Affix>
    </div>
  );
}

export default Ruleset;
