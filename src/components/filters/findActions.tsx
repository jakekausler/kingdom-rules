import React, { useEffect, useState } from "react";
import actions from "../../../json/actions.json";
import { Group, Stack, Table, TextInput, Box, useMantineColorScheme, MultiSelect, Button, Collapse, Tooltip, Select } from "@mantine/core";
import Item from "../document/Item";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { ItemData } from "../../types";

interface Action {
  name: string;
  summary: string;
  skills: string[];
  training: string;
  phase: string;
  item: ItemData;
}

interface ActionFilter {
  name: string;
  skills: string[];
  training: boolean | null;
  phase: string[];
}

export default function FindActions() {
  const [currentAction, setCurrentAction] =
    React.useState<Action | null>(null);
  const [filters, setFilters] = React.useState<ActionFilter>({
    name: "",
    skills: [],
    training: null,
    phase: [],
  });
  const { width, height } = useViewportSize();
  const isMobile = width < height;
  return (
    <Stack w="100%" h="calc(100vh - 40px)" display="flex" style={{ flex: 1, overflow: "hidden" }}>
      <FilterAction filters={filters} setFilters={setFilters} isMobile={isMobile} />
      {isMobile ? (
        <Stack w="100%" h="100%" style={{ flex: 1, overflow: "hidden" }} display="flex">
          <Box w="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <ActionList
              actions={actions as Action[]}
              filters={filters}
              setCurrentAction={setCurrentAction}
            />
          </Box>
          <Box w="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <ActionDetails action={currentAction} isMobile={isMobile} />
          </Box>
        </Stack>
      ) : (
        <Group w="100%" h="100%" style={{ flex: 1, overflow: "hidden" }} display="flex" grow>
          <Box w="50%" h="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <ActionList
              actions={actions as Action[]}
              filters={filters}
              setCurrentAction={setCurrentAction}
            />
          </Box>
          <Box w="50%" h="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <ActionDetails action={currentAction} isMobile={isMobile} />
          </Box>
        </Group>
      )}
    </Stack>
  );
}

function FilterAction({
  filters,
  setFilters,
  isMobile = false,
}: {
  filters: ActionFilter;
  setFilters: React.Dispatch<React.SetStateAction<ActionFilter>>;
  isMobile?: boolean;
}) {
  const [opened, { toggle }] = useDisclosure(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [phases, setPhases] = useState<string[]>([]);
  useEffect(() => {
    setSkills(Array.from(new Set(actions.flatMap((action) => action.skills))).sort((a, b) => {
      return a.localeCompare(b);
    }).filter((skill) => skill !== "Any"));
    setPhases(Array.from(new Set(actions.flatMap((action) => action.phase))).sort((a, b) => {
      const phases = ['upkeep', 'commerce', 'leadership', 'region', 'civic', 'army'];
      return phases.indexOf(a) - phases.indexOf(b);
    }));
  }, []);
  const inputProps = {
    labelProps: {
      style: {
        fontSize: 10,
        marginBottom: 2,
      }
    },
  }
  if (isMobile) {
    return (
      <Stack w="100%" p="xs" gap={0}>
        <Button onClick={toggle}>Filters</Button>
        <Collapse in={opened}>
          <Group w="100%" display="flex">
            <TextInput
              flex={2}
              type="text"
              label="Name"
              value={filters.name}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value.toLowerCase() })
              }
              {...inputProps}
            />
            <MultiSelect
              flex={2}
              label="Skills"
              data={skills}
              value={filters.skills}
              onChange={(value) => {
                setFilters({ ...filters, skills: value });
              }}
            />
            <MultiSelect
              flex={2}
              label="Phase"
              data={phases.map((phase) => {
                return {
                  label: phase.charAt(0).toUpperCase() + phase.slice(1),
                  value: phase,
                }
              })}
              value={filters.phase}
              onChange={(value) => {
                setFilters({ ...filters, phase: value });
              }}
            />
            <Select
              flex={2}
              label="Training"
              data={["Trained", "Untrained", "Both"]}
              value={filters.training === null ? "Both" : filters.training === true ? "Trained" : "Untrained"}
              onChange={(value) => {
                if (value === "Both") {
                  setFilters({ ...filters, training: null });
                } else {
                  setFilters({ ...filters, training: value === "Trained" });
                }
              }}
            />
          </Group>
        </Collapse>
      </Stack>
    );
  } else {
    return (
      <Stack w="100%" p="xs" gap={0}>
        <Button onClick={toggle}>Filters</Button>
        <Collapse in={opened}>
          <Group w="100%" display="flex">
            <TextInput
              flex={2}
              type="text"
              label="Name"
              value={filters.name}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value.toLowerCase() })
              }
              {...inputProps}
            />
            <MultiSelect
              flex={2}
              label="Skills"
              data={skills}
              value={filters.skills}
              onChange={(value) => {
                setFilters({ ...filters, skills: value });
              }}
            />
            <MultiSelect
              flex={2}
              label="Phase"
              data={phases.map((phase) => {
                return {
                  label: phase.charAt(0).toUpperCase() + phase.slice(1),
                  value: phase,
                }
              })}
              value={filters.phase}
              onChange={(value) => {
                setFilters({ ...filters, phase: value });
              }}
            />
            <Select
              flex={2}
              label="Training"
              data={["Trained", "Untrained", "Both"]}
              value={filters.training === null ? "Both" : filters.training === true ? "Trained" : "Untrained"}
              onChange={(value) => {
                if (value === "Both") {
                  setFilters({ ...filters, training: null });
                } else {
                  setFilters({ ...filters, training: value === "Trained" });
                }
              }}
            />
          </Group>
        </Collapse>
      </Stack>
    );
  }
}

function filterAction(action: Action, filters: ActionFilter) {
  return (
    action.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    (filters.skills.length === 0 || action.skills.some((skill) => filters.skills.includes(skill))) &&
    (filters.training === null || (action.training === "Trained" ? filters.training : !filters.training)) &&
    (filters.phase.length === 0 || filters.phase.includes(action.phase))
  );
}

function compare<T>(a: T, b: T, direction: "asc" | "desc") {
  if (a < b) return direction === "asc" ? -1 : 1;
  if (a > b) return direction === "asc" ? 1 : -1;
  return 0;
}

function ActionList({
  actions,
  filters,
  setCurrentAction,
}: {
  actions: Action[];
  filters: ActionFilter;
  setCurrentAction: React.Dispatch<React.SetStateAction<Action | null>>;
}) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(
    null,
  );
  const filteredActions = actions
    .filter((action) => filterAction(action, filters))
    .sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      if (sortColumn === "phase") {
        const phases = ['upkeep', 'commerce', 'leadership', 'region', 'civic', 'army'];
        return compare(
          phases.indexOf(a.phase),
          phases.indexOf(b.phase),
          sortDirection,
        );
      } else {
        return compare(
          a[sortColumn as keyof Action],
          b[sortColumn as keyof Action],
          sortDirection,
        );
      }
    });
  return (
    <Table.ScrollContainer minWidth="100%" h="100%">
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              onClick={() => {
                setSortColumn("name");
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              }}
            >
              Name
            </Table.Th>
            <Table.Th>
              Skills
            </Table.Th>
            <Table.Th
              onClick={() => {
                setSortColumn("phase");
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              }}
            >
              Phase
            </Table.Th>
            <Table.Th>
              Summary
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => {
              return (
                <Table.Tr
                  key={action.name}
                  onClick={() => setCurrentAction(action)}
                >
                  <Table.Td>{action.name}</Table.Td>
                  <Table.Td>
                    <span>
                      {action.skills.map((skill, idx) =>
                        <span key={skill}>
                          {skill}
                          {action.training === "Trained" && <Tooltip label="Trained"><sup>T</sup></Tooltip>}
                          {idx !== action.skills.length - 1 && ", "}
                        </span>
                      )}
                    </span>
                  </Table.Td>
                  <Table.Td>{action.phase.charAt(0).toUpperCase() + action.phase.slice(1)}</Table.Td>
                  <Table.Td>{action.summary}</Table.Td>
                </Table.Tr>
              )
            })
          ) : (
            <Table.Tr>
              <Table.Td colSpan={3}>No actions found</Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer >
  );
}

function ActionDetails({ action, isMobile }: { action: Action | null, isMobile: boolean }) {
  const colorScheme = useMantineColorScheme().colorScheme;
  const isDark = colorScheme === "dark";
  if (!action) return <div>Select an action to see details</div>;

  return (
    <Box w="100%" h="100%" p="md" id="result" className={isDark ? "dark" : ""} style={{ borderTop: isMobile ? "1px solid #e0e0e0" : "none", borderLeft: isMobile ? "none" : "1px solid #e0e0e0" }}>
      <Box w="100%" h="100%" className="content">
        <Item data={action.item} preview={true} />
      </Box>
    </Box>
  );
}
