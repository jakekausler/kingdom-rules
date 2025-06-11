import React from "react";
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
import FindStructures from "./components/filters/findStructures";
import FindActions from "./components/filters/findActions";
import { KingdomMapContainer } from "./components/map/kingdomMapContainer/kingdomMapContainer";

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

const nonRulesetPages: Record<string, React.FC> = {
  "Find Structures": FindStructures,
  "Find Actions": FindActions,
  Map: KingdomMapContainer,
};

// // TODO: Add anchors to each heading, item, and table
// TODO: Don't display side content on smaller screens. Have the clipboard happen when clicking the anchor link
// TODO: Scroll to top is displaying over the sidebar

function App() {
  const [opened, { toggle }] = useDisclosure(false);
  const [page, setPage] = useState<string>("Kingdom Actions");
  const [documentSearch, setDocumentSearch] = useState<string>("");

  return (
    <Router>
      <AppShell
        header={{ height: 40 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        layout="alt"
      >
        <AppShell.Header>
          <Header
            opened={opened}
            toggle={toggle}
            rulesets={RULESETS}
            setDocumentSearch={setDocumentSearch}
          />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Sidebar
            pages={Object.keys(RULESETS).concat(Object.keys(nonRulesetPages))}
            setPage={setPage}
            toggle={toggle}
            currentPage={page}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <Routes>
            {Object.keys(RULESETS).map((key) => (
              <Route
                path={`/${key.replace(/\s+/g, "-")}`}
                element={
                  <Body ruleset={RULESETS[key]} search={documentSearch} />
                }
                key={key}
              />
            ))}
            {Object.keys(nonRulesetPages).map((key) => {
              if (key === "Map") {
                return (
                  <Route
                    path={`/${key.replace(/\s+/g, "-")}`}
                    element={<KingdomMapContainer />}
                    key={key}
                  />
                );
              } else {
                return (
                  <Route
                    path={`/${key.replace(/\s+/g, "-")}`}
                    element={React.createElement(nonRulesetPages[key])}
                    key={key}
                  />
                );
              }
            })}
            <Route
              path="/"
              element={
                RULESETS[page] ? (
                  <Body ruleset={RULESETS[page]} search={documentSearch} />
                ) : (
                  React.createElement(nonRulesetPages[page])
                )
              }
            />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

export default App;
