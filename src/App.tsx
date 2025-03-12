import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import { ParsedElement } from "./types";
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
import Body from "./components/shell/Body";
import Header from "./components/shell/Header";
import Sidebar from "./components/shell/Sidebar";

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

// TODO: Add a search bar to the navbar
// // TODO: Scroll to top when ruleset changes
// // TODO: Add a "back to top" button
// // TODO: Add a color scheme toggle and save preference
// // TODO: Add dark colors
// // TODO: Pages should change the URL and be able to open in new tabs
// TODO: Support links within the data to pages and/or anchors
// TODO: Add anchors to each heading, item, and table

function App() {
  const [opened, { toggle }] = useDisclosure(false);
  const [ruleset, setRuleset] = useState<string>("Kingdom Actions");

  return (
    <Router>
      <AppShell
        header={{ height: 40 }}
        navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
        layout="alt"
      >
        <AppShell.Header>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Sidebar rulesets={Object.keys(RULESETS)} setRuleset={setRuleset} toggle={toggle} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Routes>
            {Object.keys(RULESETS).map((key) => (
              <Route
                path={`/${key.replace(/\s+/g, '-')}`}
                element={<Body ruleset={RULESETS[key]} />}
                key={key}
              />
            ))}
            <Route path="/" element={<Body ruleset={RULESETS[ruleset]} />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

export default App;
