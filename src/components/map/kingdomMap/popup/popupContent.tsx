import {
  Map,
  Location,
  SettlementLocation,
  ImprovementLocation,
  POILocation,
} from "../../types";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconCircleDot,
  IconCrosshair,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SelectIcon } from "./selectIcon";

//const SERVER_URL = "http://192.168.2.148:9036";
const SERVER_URL = "";

export default function PopupContent({
  location,
  map,
  onSave,
  startEditingInfluence,
  startMovingLocation,
}: {
  location: Location;
  map: Map;
  onSave: (map: Map) => void;
  startEditingInfluence: (settlementId: string) => void;
  startMovingLocation: (locationId: string) => void;
}) {
  switch (location.type) {
    case "settlement":
      return (
        <SettlementPopupContent
          location={location as SettlementLocation}
          map={map}
          onSave={onSave}
          startEditingInfluence={startEditingInfluence}
          startMovingLocation={startMovingLocation}
        />
      );
    case "improvement":
      return (
        <ImprovementPopupContent
          location={location as ImprovementLocation}
          map={map}
          onSave={onSave}
          startMovingLocation={startMovingLocation}
        />
      );
    case "poi":
      return (
        <POIPopupContent
          location={location as POILocation}
          map={map}
          onSave={onSave}
          startMovingLocation={startMovingLocation}
        />
      );
    default:
      return <div>Unknown location type</div>;
  }
}

function SettlementPopupContent({
  location,
  map,
  onSave,
  startEditingInfluence,
  startMovingLocation,
}: {
  location: SettlementLocation;
  map: Map;
  onSave: (map: Map) => void;
  startEditingInfluence: (settlementId: string) => void;
  startMovingLocation: (locationId: string) => void;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(location.name);
  const [description, setDescription] = useState<string>(location.description);
  const [size, setSize] = useState<string>(location.size);
  const [opened, { open, close }] = useDisclosure(false);

  const SETTLEMENT_ICONS = {
    village: "/mapicons/042.png",
    town: "/mapicons/043.png",
    city: "/mapicons/044.png",
    metropolis: "/mapicons/045.png",
  };

  return (
    <Stack gap={0}>
      <Group mb={16} justify="space-around" gap={4}>
        <Tooltip label="Edit">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={(e) => {
              e.stopPropagation(); // Prevent popup from closing
              e.preventDefault(); // Just in case, for good measure
              if (editMode) {
                onSave({
                  ...map,
                  locations: map.locations.map((l) =>
                    l.id === location.id
                      ? {
                          ...l,
                          name,
                          description,
                          size,
                          icon: SETTLEMENT_ICONS[
                            size as keyof typeof SETTLEMENT_ICONS
                          ],
                        }
                      : l,
                  ),
                });
              }
              setEditMode(!editMode);
            }}
          >
            {editMode ? <IconCheck size={24} /> : <IconPencil size={24} />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Influence">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={() => startEditingInfluence(location.id)}
          >
            <IconCircleDot size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Move">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={() => startMovingLocation(location.id)}
          >
            <IconCrosshair size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={() => open()}
            bg="red"
          >
            <IconTrash size={24} />
          </ActionIcon>
        </Tooltip>
      </Group>
      {editMode ? (
        <Stack>
          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Checkbox
            label="Capital"
            checked={location.isCapital}
            onChange={(e) =>
              onSave({
                ...map,
                locations: map.locations.map((l) =>
                  l.id === location.id
                    ? { ...l, isCapital: e.target.checked }
                    : l,
                ),
              })
            }
          />
          <Select
            label="Size"
            value={size}
            onChange={(value) => setSize(value as string)}
            data={[
              { value: "village", label: "Village" },
              { value: "town", label: "Town" },
              { value: "city", label: "City" },
              { value: "metropolis", label: "Metropolis" },
            ]}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autosize
            minRows={3}
            maxRows={10}
          />
        </Stack>
      ) : (
        <Stack>
          <Box size="md" fw={700}>
            {name}
            {location.isCapital ? " ✨" : ""}
          </Box>
          <Box size="sm">{size.charAt(0).toUpperCase() + size.slice(1)}</Box>
          <Box size="sm">{description}</Box>
        </Stack>
      )}
      <Modal opened={opened} onClose={close} title="Delete Settlement">
        <Stack>
          <Box>
            Are you sure you want to delete this settlement? This action cannot
            be undone.
          </Box>
          <Group justify="space-between">
            <Button
              bg="red"
              onClick={() => {
                onSave({
                  ...map,
                  locations: map.locations.filter((l) => l.id !== location.id),
                });
                close();
              }}
            >
              Confirm
            </Button>
            <Button onClick={close}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

function ImprovementPopupContent({
  location,
  map,
  onSave,
  startMovingLocation,
}: {
  location: ImprovementLocation;
  map: Map;
  onSave: (map: Map) => void;
  startMovingLocation: (locationId: string) => void;
}) {
  const IMPROVEMENT_ICONS = {
    Quarry: "/mapicons/025.png",
    Mine: "/mapicons/062.png",
    LumberMill: "/mapicons/059.png",
    Farm: "/mapicons/C_043.png",
    Fishery: "/mapicons/W_005.png",
    Ranch: "/mapicons/a_001.png",
  };

  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(location.name);
  const [description, setDescription] = useState<string>(location.description);
  const [settlement, setSettlement] = useState<string>(
    location.connectedSettlement || "",
  );
  const [settlementName, setSettlementName] = useState<string>(
    (
      (map.locations.find(
        (l) =>
          l.type === "improvement" &&
          (l as ImprovementLocation).connectedSettlement ===
            location.connectedSettlement,
      ) as ImprovementLocation) || undefined
    )?.name || "",
  );
  const [type, setType] = useState<string>(location.improvement);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (location.connectedSettlement) {
      const settlementLocation = map.locations.find(
        (l) => l.id === location.connectedSettlement,
      );
      if (settlementLocation && settlementLocation.type === "settlement") {
        setSettlementName(settlementLocation.name);
      } else {
        setSettlementName("");
      }
    } else {
      setSettlementName("");
    }
  }, [location.connectedSettlement, map.locations]);

  return (
    <Stack gap={0}>
      <Group mb={16} justify="space-around" gap={4}>
        <Tooltip label="Edit">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={(e) => {
              e.stopPropagation(); // Prevent popup from closing
              e.preventDefault(); // Just in case, for good measure
              if (editMode) {
                onSave({
                  ...map,
                  locations: map.locations.map((l) =>
                    l.id === location.id
                      ? {
                          ...l,
                          name,
                          description,
                          connectedSettlement: settlement,
                          improvement: type,
                          icon: IMPROVEMENT_ICONS[
                            type as keyof typeof IMPROVEMENT_ICONS
                          ],
                        }
                      : l,
                  ),
                });
              }
              setEditMode(!editMode);
            }}
          >
            {editMode ? <IconCheck size={24} /> : <IconPencil size={24} />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Move">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={() => startMovingLocation(location.id)}
          >
            <IconCrosshair size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={() => open()}
            bg="red"
          >
            <IconTrash size={24} />
          </ActionIcon>
        </Tooltip>
      </Group>
      {editMode ? (
        <Stack>
          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label="Type"
            value={type}
            onChange={(value) => setType(value as string)}
            data={[
              { value: "Farm", label: "Farm" },
              { value: "Fishery", label: "Fishery" },
              { value: "LumberMill", label: "Lumber Mill" },
              { value: "Mine", label: "Mine" },
              { value: "Quarry", label: "Quarry" },
              { value: "Ranch", label: "Ranch" },
            ]}
          />
          <Select
            label="Connected Settlement"
            value={settlement}
            onChange={(value) => setSettlement(value as string)}
            data={[
              { value: "", label: "None" },
              ...map.locations
                .filter((l) => l.type === "settlement")
                .map((l) => ({
                  value: l.id,
                  label: l.name,
                })),
            ]}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autosize
            minRows={3}
            maxRows={10}
          />
        </Stack>
      ) : (
        <Stack>
          <Box size="md" fw={700}>
            <img
              src={
                SERVER_URL +
                IMPROVEMENT_ICONS[type as keyof typeof IMPROVEMENT_ICONS]
              }
              alt={name}
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
            />
            {name}
          </Box>
          <Box size="sm">Connected to: {settlementName || "None"}</Box>
          <Box size="sm">{description}</Box>
        </Stack>
      )}
      <Modal opened={opened} onClose={close} title="Delete Settlement">
        <Stack>
          <Box>
            Are you sure you want to delete this improvement? This action cannot
            be undone.
          </Box>
          <Group justify="space-between">
            <Button
              bg="red"
              onClick={() => {
                onSave({
                  ...map,
                  locations: map.locations.filter((l) => l.id !== location.id),
                });
                close();
              }}
            >
              Confirm
            </Button>
            <Button onClick={close}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

function POIPopupContent({
  location,
  map,
  onSave,
  startMovingLocation,
}: {
  location: POILocation;
  map: Map;
  onSave: (map: Map) => void;
  startMovingLocation: (locationId: string) => void;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(location.name);
  const [description, setDescription] = useState<string>(location.description);
  const [icon, setIcon] = useState<string>(location.icon);
  const [opened, { open, close }] = useDisclosure(false);

  const [iconUrls, setIconUrls] = useState<string[]>([]);
  useEffect(() => {
    fetch(`${SERVER_URL}/mapicons`)
      .then((res) => res.json())
      .then((icons) =>
        setIconUrls(
          icons.map((icon: string) => `${SERVER_URL}/mapicons/${icon}`),
        ),
      );
  }, []);

  return (
    <Stack gap={0}>
      <Group justify="space-around" gap={4}>
        <Tooltip label="Edit">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={(e) => {
              e.stopPropagation(); // Prevent popup from closing
              e.preventDefault(); // Just in case, for good measure
              if (editMode) {
                onSave({
                  ...map,
                  locations: map.locations.map((l) =>
                    l.id === location.id
                      ? { ...l, name, description, icon }
                      : l,
                  ),
                });
              }
              setEditMode(!editMode);
            }}
          >
            {editMode ? <IconCheck size={24} /> : <IconPencil size={24} />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Move">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={() => startMovingLocation(location.id)}
          >
            <IconCrosshair size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            size="md"
            p={1}
            variant="filled"
            onClick={() => open()}
            bg="red"
          >
            <IconTrash size={24} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Divider my={12} />
      {editMode ? (
        <Stack>
          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SelectIcon
            iconUrls={iconUrls}
            onChange={(value) => setIcon(value)}
            value={icon}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autosize
            minRows={3}
            maxRows={10}
          />
        </Stack>
      ) : (
        <Stack>
          <Box size="md" fw={700}>
            <img
              src={icon}
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
            />
            {name}
          </Box>
          <Box size="sm">{description}</Box>
        </Stack>
      )}
      <Modal opened={opened} onClose={close} title="Delete Settlement">
        <Stack>
          <Box>
            Are you sure you want to delete this settlement? This action cannot
            be undone.
          </Box>
          <Group justify="space-between">
            <Button
              bg="red"
              onClick={() => {
                onSave({
                  ...map,
                  locations: map.locations.filter((l) => l.id !== location.id),
                });
                close();
              }}
            >
              Confirm
            </Button>
            <Button onClick={close}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
