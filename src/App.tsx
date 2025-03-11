import { AppShell, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import "./App.css";

import {
  HeadingData,
  ItemData,
  ListData,
  ParagraphData,
  ParsedElement,
  TableData,
  TraitsData,
} from "./types";
import kingdomActions from "../json/Kingdom Actions.json";
import kingdomAdvancement from "../json/Kingdom Advancement.json";
import kingdomCreation from "../json/Kingdom Creation.json";
import kingdomFeats from "../json/Kingdom Feats.json";
import kingdomRules from "../json/Kingdom Rules.json";
import kingdomTurn from "../json/Kingdom Turn.json";
import leadershipRoles from "../json/Leadership Roles.json";
import settlementCreation from "../json/Settlement Creation.json";
import settlementRules from "../json/Settlement Rules.json";
import settlementStructures from "../json/Settlement Structures.json";

const RULESETS: Record<string, ParsedElement[]> = {
  "Kingdom Actions": kingdomActions as ParsedElement[],
  "Kingdom Advancement": kingdomAdvancement as ParsedElement[],
  "Kingdom Creation": kingdomCreation as ParsedElement[],
  "Kingdom Feats": kingdomFeats as ParsedElement[],
  "Kingdom Rules": kingdomRules as ParsedElement[],
  "Kingdom Turn": kingdomTurn as ParsedElement[],
  "Leadership Roles": leadershipRoles as ParsedElement[],
  "Settlement Creation": settlementCreation as ParsedElement[],
  "Settlement Rules": settlementRules as ParsedElement[],
  "Settlement Structures": settlementStructures as ParsedElement[],
};

function App() {
  const [opened, { toggle }] = useDisclosure(false);
  const [ruleset, setRuleset] = useState<string>("Kingdom Actions");

  return (
    <AppShell
      header={{ height: 40 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      layout="alt"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {Object.entries(RULESETS).map(([key, _ruleset]) => (
          <Button
            m="xs"
            variant="subtle"
            key={key}
            onClick={() => {
              setRuleset(key);
              toggle();
            }}
          >
            {key}
          </Button>
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <div id="result">
          <Ruleset ruleset={RULESETS[ruleset]} />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
function Ruleset({ ruleset }: { ruleset: ParsedElement[] }) {
  return (
    <div className="bg-paper page d-flex flex-wrap a4">
      <div className="content">
        <Content data={ruleset} />
      </div>
    </div>
  );
}

function Content({ data }: { data: ParsedElement[] }) {
  return (
    <div>
      {data.map((element: ParsedElement, index: number) => {
        switch (element.type) {
          case "heading":
            return <Heading data={element} key={index} />;
          case "paragraph":
            return <Paragraph data={element} key={index} />;
          case "list":
            return <List data={element} key={index} />;
          case "table":
            return <Table data={element} key={index} />;
          case "item":
            return <Item data={element} key={index} />;
          case "hr":
            return <HR />;
          case "traits":
            return <Traits data={element} key={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function Heading({ data }: { data: HeadingData }) {
  let heading = null;
  switch (data.level) {
    case 1:
      heading = <h1>{data.heading}</h1>;
      break;
    case 2:
      heading = <h2>{data.heading}</h2>;
      break;
    case 3:
      heading = <h3>{data.heading}</h3>;
      break;
    case 4:
      heading = <h4>{data.heading}</h4>;
      break;
    case 5:
      heading = <h5>{data.heading}</h5>;
      break;
    case 6:
      heading = <h6>{data.heading}</h6>;
      break;
    default:
      heading = null;
  }
  return (
    <>
      {heading}
      <Content data={data.content} />
    </>
  );
}

function Paragraph({ data }: { data: ParagraphData }) {
  return (
    <p>
      {data.content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((text, index) => {
        if (text.startsWith("**") && text.endsWith("**")) {
          return <strong key={index}>{text.slice(2, -2)}</strong>;
        } else if (text.startsWith("*") && text.endsWith("*")) {
          return <em key={index}>{text.slice(1, -1)}</em>;
        }
        return text;
      })}
    </p>
  );
}

function List({ data }: { data: ListData }) {
  return (
    <ul>
      {data.content.map((item) => (
        <li>
          {item.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((text) => {
            if (text.startsWith("**") && text.endsWith("**")) {
              return <strong>{text.slice(2, -2)}</strong>;
            } else if (text.startsWith("*") && text.endsWith("*")) {
              return <em>{text.slice(1, -1)}</em>;
            }
            return text;
          })}
        </li>
      ))}
    </ul>
  );
}

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
        {data.data.map((row) => (
          <tr>
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

function Item({ data }: { data: ItemData }) {
  return (
    <div className="item">
      <h1>{data.heading}</h1>
      <h2>{data.subheading}</h2>
      <Content data={data.content} />
    </div>
  );
}

function HR() {
  return <hr />;
}

function Traits({ data }: { data: TraitsData }) {
  return (
    <div className="traits">
      <div className="pf-trait pf-trait-edge">&nbsp;</div>
      {data.content.map((item, index) => (
        <>
          <div key={index} className="pf-trait pf-trait-building">
            {item}
          </div>
        </>
      ))}
      <div className="pf-trait pf-trait-edge">&nbsp;</div>
    </div>
  );
}

export default App;
