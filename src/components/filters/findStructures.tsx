import React, { useEffect, useState } from "react";
import structures from "../../../json/structures.json";
import { NumberInput, Group, Stack, Table, TextInput, Box, useMantineColorScheme, MultiSelect, Button, Collapse, Tooltip } from "@mantine/core";
import Item from "../document/Item";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { ItemData } from "../../types";

interface Structure {
  name: string;
  level: number;
  traits: string[];
  lots: number;
  cost: Cost;
  monthlyRPCost: number;
  months: number;
  settlementSize: string;
  xp: number;
  population: number;
  construction: Construction[];
  item: ItemData;
}

interface Cost {
  lumber: number;
  stone: number;
  ore: number;
  luxuries: number;
  rp: number;
}

interface Construction {
  skill: string;
  training: string;
}

interface StructureFilter {
  name: string;
  traits: string[];
  levelFrom: number;
  levelTo: number;
  sizes: string[];
  cost: {
    lumberFrom: number;
    lumberTo: number;
    stoneFrom: number;
    stoneTo: number;
    oreFrom: number;
    oreTo: number;
    luxuriesFrom: number;
    luxuriesTo: number;
    rpFrom: number;
    rpTo: number;
  };
  lotsFrom: number;
  lotsTo: number;
  monthsFrom: number;
  monthsTo: number;
  monthlyRPCostFrom: number;
  monthlyRPCostTo: number;
  constructionSkills: string[];
  constructionTraining: string[];
}

export default function FindStructures() {
  const [currentStructure, setCurrentStructure] =
    React.useState<Structure | null>(null);
  const [filters, setFilters] = React.useState<StructureFilter>({
    name: "",
    traits: [],
    levelFrom: 0,
    levelTo: 20,
    sizes: [],
    cost: {
      lumberFrom: 0,
      lumberTo: 100,
      stoneFrom: 0,
      stoneTo: 100,
      oreFrom: 0,
      oreTo: 100,
      luxuriesFrom: 0,
      luxuriesTo: 100,
      rpFrom: 0,
      rpTo: 100,
    },
    lotsFrom: 0,
    lotsTo: 100,
    monthsFrom: 0,
    monthsTo: 100,
    monthlyRPCostFrom: 0,
    monthlyRPCostTo: 100,
    constructionSkills: [],
    constructionTraining: [],
  });
  const { width } = useViewportSize();
  const isMobile = width < 768;
  return (
    <Stack w="100%" h="calc(100vh - 40px)" display="flex" style={{ flex: 1, overflow: "hidden" }}>
      <FilterStructure filters={filters} setFilters={setFilters} isMobile={isMobile} />
      {isMobile ? (
        <Stack w="100%" h="100%" style={{ flex: 1, overflow: "hidden" }} display="flex">
          <Box w="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <StructureList
              structures={structures as Structure[]}
              filters={filters}
              setCurrentStructure={setCurrentStructure}
            />
          </Box>
          <Box w="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <StructureDetails structure={currentStructure} isMobile={isMobile} />
          </Box>
        </Stack>
      ) : (
        <Group w="100%" h="100%" style={{ flex: 1, overflow: "hidden" }} display="flex" grow>
          <Box w="50%" h="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <StructureList
              structures={structures as Structure[]}
              filters={filters}
              setCurrentStructure={setCurrentStructure}
            />
          </Box>
          <Box w="50%" h="100%" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <StructureDetails structure={currentStructure} isMobile={isMobile} />
          </Box>
        </Group>
      )}
    </Stack>
  );
}

function FilterStructure({
  filters,
  setFilters,
  isMobile = false,
}: {
  filters: StructureFilter;
  setFilters: React.Dispatch<React.SetStateAction<StructureFilter>>;
  isMobile?: boolean;
}) {
  const [opened, { toggle }] = useDisclosure(false);
  const [traits, setTraits] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [training, setTraining] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  useEffect(() => {
    setTraits(Array.from(new Set(structures.flatMap((structure) => structure.traits))).sort());
    setSkills(Array.from(new Set(structures.flatMap((structure) => structure.construction.map((construction) => construction.skill)))).sort());
    setTraining(Array.from(new Set(structures.flatMap((structure) => structure.construction.map((construction) => construction.training)))).sort());
    setSizes(Array.from(new Set(structures.flatMap((structure) => structure.settlementSize))).sort());
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
            <NumberInput
              flex={1}
              label="Level From"
              value={filters.levelFrom}
              min={0}
              max={20}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  levelFrom: typeof e === "number" ? e : parseInt(e) || 0,
                })
              }
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              min={0}
              max={20}
              value={filters.levelTo}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  levelTo: typeof e === "number" ? e : parseInt(e) || 20,
                })
              }
              {...inputProps}
            />
          </Group>
          <Group w="100%" display="flex">
            <MultiSelect
              flex={1}
              label="Traits"
              data={traits}
              value={filters.traits}
              onChange={(e) => setFilters({ ...filters, traits: e })}
              {...inputProps}
            />
            <MultiSelect
              flex={1}
              label="Skills"
              data={skills}
              value={filters.constructionSkills}
              onChange={(e) => setFilters({ ...filters, constructionSkills: e })}
              {...inputProps}
            />
            <MultiSelect
              flex={1}
              label="Training"
              data={training.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))}
              value={filters.constructionTraining}
              onChange={(e) => setFilters({ ...filters, constructionTraining: e })}
              {...inputProps}
            />
            <MultiSelect
              flex={1}
              label="Town Size"
              data={sizes.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
              value={filters.sizes}
              onChange={(e) => setFilters({ ...filters, sizes: e })}
              {...inputProps}
            />
          </Group>
          <Group w="100%" display="flex">
            <NumberInput
              flex={1}
              label="Lots From"
              value={filters.lotsFrom}
              onChange={(e) => setFilters({ ...filters, lotsFrom: typeof e === "number" ? e : parseInt(e) || 0 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.lotsTo}
              onChange={(e) => setFilters({ ...filters, lotsTo: typeof e === "number" ? e : parseInt(e) || 100 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="RP From"
              value={filters.cost.rpFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, rpFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="RP To"
              value={filters.cost.rpTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, rpTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
          </Group>
          <Group w="100%" display="flex">
            <NumberInput
              flex={1}
              label="Months From"
              value={filters.monthsFrom}
              onChange={(e) => setFilters({ ...filters, monthsFrom: typeof e === "number" ? e : parseInt(e) || 0 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.monthsTo}
              onChange={(e) => setFilters({ ...filters, monthsTo: typeof e === "number" ? e : parseInt(e) || 100 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Monthly RP From"
              value={filters.monthlyRPCostFrom}
              onChange={(e) => setFilters({ ...filters, monthlyRPCostFrom: typeof e === "number" ? e : parseInt(e) || 0 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.monthlyRPCostTo}
              onChange={(e) => setFilters({ ...filters, monthlyRPCostTo: typeof e === "number" ? e : parseInt(e) || 100 })}
              {...inputProps}
            />
          </Group>
          <Group w="100%" display="flex">
            <NumberInput
              flex={1}
              label="Lumber From"
              value={filters.cost.lumberFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, lumberFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.lumberTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, lumberTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Stone From"
              value={filters.cost.stoneFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, stoneFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.stoneTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, stoneTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
          </Group>
          <Group w="100%" display="flex">
            <NumberInput
              flex={1}
              label="Ore From"
              value={filters.cost.oreFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, oreFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.oreTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, oreTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Luxuries From"
              value={filters.cost.luxuriesFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, luxuriesFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.luxuriesTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, luxuriesTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
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
            <NumberInput
              flex={1}
              label="Level From"
              value={filters.levelFrom}
              min={0}
              max={20}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  levelFrom: typeof e === "number" ? e : parseInt(e) || 0,
                })
              }
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              min={0}
              max={20}
              value={filters.levelTo}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  levelTo: typeof e === "number" ? e : parseInt(e) || 20,
                })
              }
              {...inputProps}
            />
            <MultiSelect
              flex={1}
              label="Traits"
              data={traits}
              value={filters.traits}
              onChange={(e) => setFilters({ ...filters, traits: e })}
              {...inputProps}
            />
            <MultiSelect
              flex={1}
              label="Skills"
              data={skills}
              value={filters.constructionSkills}
              onChange={(e) => setFilters({ ...filters, constructionSkills: e })}
              {...inputProps}
            />
            <MultiSelect
              flex={1}
              label="Training"
              data={training.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))}
              value={filters.constructionTraining}
              onChange={(e) => setFilters({ ...filters, constructionTraining: e })}
              {...inputProps}
            />
            <MultiSelect
              flex={1}
              label="Town Size"
              data={sizes.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
              value={filters.sizes}
              onChange={(e) => setFilters({ ...filters, sizes: e })}
              {...inputProps}
            />
          </Group>
          <Group w="100%" display="flex">
            <NumberInput
              flex={1}
              label="Lots From"
              value={filters.lotsFrom}
              onChange={(e) => setFilters({ ...filters, lotsFrom: typeof e === "number" ? e : parseInt(e) || 0 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.lotsTo}
              onChange={(e) => setFilters({ ...filters, lotsTo: typeof e === "number" ? e : parseInt(e) || 100 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="RP From"
              value={filters.cost.rpFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, rpFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="RP To"
              value={filters.cost.rpTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, rpTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Months From"
              value={filters.monthsFrom}
              onChange={(e) => setFilters({ ...filters, monthsFrom: typeof e === "number" ? e : parseInt(e) || 0 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.monthsTo}
              onChange={(e) => setFilters({ ...filters, monthsTo: typeof e === "number" ? e : parseInt(e) || 100 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Monthly RP From"
              value={filters.monthlyRPCostFrom}
              onChange={(e) => setFilters({ ...filters, monthlyRPCostFrom: typeof e === "number" ? e : parseInt(e) || 0 })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.monthlyRPCostTo}
              onChange={(e) => setFilters({ ...filters, monthlyRPCostTo: typeof e === "number" ? e : parseInt(e) || 100 })}
              {...inputProps}
            />
          </Group>
          <Group w="100%" display="flex">
            <NumberInput
              flex={1}
              label="Lumber From"
              value={filters.cost.lumberFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, lumberFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.lumberTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, lumberTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Stone From"
              value={filters.cost.stoneFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, stoneFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.stoneTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, stoneTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Ore From"
              value={filters.cost.oreFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, oreFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.oreTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, oreTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="Luxuries From"
              value={filters.cost.luxuriesFrom}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, luxuriesFrom: typeof e === "number" ? e : parseInt(e) || 0 } })}
              {...inputProps}
            />
            <NumberInput
              flex={1}
              label="To"
              value={filters.cost.luxuriesTo}
              onChange={(e) => setFilters({ ...filters, cost: { ...filters.cost, luxuriesTo: typeof e === "number" ? e : parseInt(e) || 100 } })}
              {...inputProps}
            />
          </Group>
        </Collapse>
      </Stack>
    );
  }
}

function filterStructure(structure: Structure, filters: StructureFilter) {
  return (
    structure.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    structure.level >= filters.levelFrom &&
    structure.level <= filters.levelTo &&
    structure.lots >= filters.lotsFrom &&
    structure.lots <= filters.lotsTo &&
    structure.months >= filters.monthsFrom &&
    structure.months <= filters.monthsTo &&
    structure.monthlyRPCost >= filters.monthlyRPCostFrom &&
    structure.monthlyRPCost <= filters.monthlyRPCostTo &&
    structure.cost.lumber >= filters.cost.lumberFrom &&
    structure.cost.lumber <= filters.cost.lumberTo &&
    structure.cost.stone >= filters.cost.stoneFrom &&
    structure.cost.stone <= filters.cost.stoneTo &&
    structure.cost.ore >= filters.cost.oreFrom &&
    structure.cost.ore <= filters.cost.oreTo &&
    structure.cost.luxuries >= filters.cost.luxuriesFrom &&
    structure.cost.luxuries <= filters.cost.luxuriesTo &&
    structure.cost.rp >= filters.cost.rpFrom &&
    structure.cost.rp <= filters.cost.rpTo &&
    (filters.traits.length === 0 ||
      structure.traits.some((trait) => filters.traits.includes(trait))) &&
    (filters.sizes.length === 0 ||
      filters.sizes.includes(structure.settlementSize)) &&
    (filters.constructionSkills.length === 0 ||
      structure.construction.some((construction) =>
        filters.constructionSkills.includes(construction.skill),
      )) &&
    (filters.constructionTraining.length === 0 ||
      structure.construction.some((construction) =>
        filters.constructionTraining.includes(construction.training),
      ))
  );
}

function compare<T>(a: T, b: T, direction: "asc" | "desc") {
  if (a < b) return direction === "asc" ? -1 : 1;
  if (a > b) return direction === "asc" ? 1 : -1;
  return 0;
}

function StructureList({
  structures,
  filters,
  setCurrentStructure,
}: {
  structures: Structure[];
  filters: StructureFilter;
  setCurrentStructure: React.Dispatch<React.SetStateAction<Structure | null>>;
}) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(
    null,
  );
  const filteredStructures = structures
    .filter((structure) => filterStructure(structure, filters))
    .sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      return compare(
        a[sortColumn as keyof Structure],
        b[sortColumn as keyof Structure],
        sortDirection,
      );
    });
  return (
    <Table.ScrollContainer minWidth="100%" h="100%">
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              onClick={() => {
                setSortColumn("level");
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              }}
            >
              Level
            </Table.Th>
            <Table.Th
              onClick={() => {
                setSortColumn("name");
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              }}
            >
              Structure
            </Table.Th>
            <Table.Th>
              XP
            </Table.Th>
            <Table.Th>
              Pop
            </Table.Th>
            <Table.Th>
              Size
            </Table.Th>
            <Table.Th>
              Lots
            </Table.Th>
            <Table.Th>
              Construction
            </Table.Th>
            <Table.Th>
              Cost
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredStructures.length > 0 ? (
            filteredStructures.map((structure) => {
              const training = Array.from(new Set(structure.construction.map((construction) => construction.training)))
                .filter((training) => training !== "untrained").join("");
              const cost = (
                <span>
                  {structure.cost.lumber > 0 && <span>{structure.cost.lumber}<Tooltip label={`${structure.cost.lumber} Lumber`}><span>🪵</span></Tooltip></span>}
                  {structure.cost.stone > 0 && <span>{structure.cost.stone}<Tooltip label={`${structure.cost.stone} Stone`}><span>🪨</span></Tooltip></span>}
                  {structure.cost.ore > 0 && <span>{structure.cost.ore}<Tooltip label={`${structure.cost.ore} Ore`}><span>⛏️</span></Tooltip></span>}
                  {structure.cost.luxuries > 0 && <span>{structure.cost.luxuries}<Tooltip label={`${structure.cost.luxuries} Luxuries`}><span>💎</span></Tooltip></span>}
                  {structure.cost.rp > 0 && <span>{structure.cost.rp}<Tooltip label={`${structure.cost.rp} RP`}><span>⚒️</span></Tooltip></span>}
                  {structure.months > 0 && <span> + {structure.monthlyRPCost}<Tooltip label={`${structure.monthlyRPCost} Monthly RP`}><span>⚒️</span></Tooltip> for {structure.months}<Tooltip label={`${structure.months} Months`}><span>📅</span></Tooltip></span>}
                </span>
              );
              const settlementSizeLabel = structure.settlementSize.charAt(0).toUpperCase() + structure.settlementSize.slice(1);
              const settlementSize = (
                <Tooltip label={settlementSizeLabel}>
                  <span>
                    {settlementSizeLabel === "Village" && '🛖'}
                    {settlementSizeLabel === "Town" && '🏠'}
                    {settlementSizeLabel === "City" && '🏛️'}
                  </span>
                </Tooltip>
              );
              return (
                <Table.Tr
                  key={structure.name}
                  onClick={() => setCurrentStructure(structure)}
                >
                  <Table.Td>{structure.level}</Table.Td>
                  <Table.Td>
                    <span>
                      {structure.name}
                      <sup>{structure.traits.map((trait) => <Tooltip label={trait}><span>{trait.charAt(0).toUpperCase()}</span></Tooltip>)}</sup>
                    </span>
                  </Table.Td>
                  <Table.Td>{structure.xp}</Table.Td>
                  <Table.Td>{structure.population}</Table.Td>
                  <Table.Td>{settlementSize}</Table.Td>
                  <Table.Td>{structure.lots}</Table.Td>
                  <Table.Td>
                    {structure.construction.map((construction, idx) =>
                      <span key={construction.skill}>
                        {construction.skill}
                        <Tooltip label={training.charAt(0).toUpperCase() + training.slice(1)}>
                          <sup>{training.charAt(0).toUpperCase()}</sup>
                        </Tooltip>
                        {idx !== structure.construction.length - 1 ? ", " : ""}
                      </span>
                    )}
                  </Table.Td>
                  <Table.Td>{cost}</Table.Td>
                </Table.Tr>
              )
            })
          ) : (
            <Table.Tr>
              <Table.Td colSpan={2}>No structures found</Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer >
  );
}

function StructureDetails({ structure, isMobile }: { structure: Structure | null, isMobile: boolean }) {
  const colorScheme = useMantineColorScheme().colorScheme;
  const isDark = colorScheme === "dark";
  if (!structure) return <div>Select a structure to see details</div>;

  return (
    <Box w="100%" h="100%" p="md" id="result" className={isDark ? "dark" : ""} style={{ borderTop: isMobile ? "1px solid #e0e0e0" : "none", borderLeft: isMobile ? "none" : "1px solid #e0e0e0" }}>
      <Box w="100%" h="100%" className="content">
        <Item data={structure.item} preview={true} />
      </Box>
    </Box>
  );
}
