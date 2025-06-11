import { ActionIcon } from "@mantine/core";

import { Tooltip } from "@mantine/core";

import { Group } from "@mantine/core";

import { Stack } from "@mantine/core";
import { FilterButtonProps } from "../types";
import { MODE } from "./mapMode";
import { IconCancel, IconCheck, IconCircleDot, IconHammer, IconHome, IconPin, IconRoad, IconSailboat } from "@tabler/icons-react";

export const FilterButtons = (props: FilterButtonProps) => {
  return (
    <Stack>
      <Group p="xs" justify="space-around">
        <Tooltip label="Edit Borders" position="bottom">
          <ActionIcon
            variant={props.mode === MODE.editBorders ? "subtle" : "filled"}
            onClick={() =>
              props.mode === MODE.editBorders
                ? props.setMode?.(MODE.view)
                : props.setMode?.(MODE.editBorders)
            }
          >
            <IconCircleDot size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Add Settlements" position="bottom">
          <ActionIcon
            variant={props.mode === MODE.editSettlements ? "subtle" : "filled"}
            onClick={() =>
              props.mode === MODE.editSettlements
                ? props.setMode?.(MODE.view)
                : props.setMode?.(MODE.editSettlements)
            }
          >
            <IconHome size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Add Improvements" position="bottom">
          <ActionIcon
            variant={props.mode === MODE.editImprovements ? "subtle" : "filled"}
            onClick={() =>
              props.mode === MODE.editImprovements
                ? props.setMode?.(MODE.view)
                : props.setMode?.(MODE.editImprovements)
            }
          >
            <IconHammer size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Edit Roads" position="bottom">
          <ActionIcon
            variant={props.mode === MODE.editRoads ? "subtle" : "filled"}
            onClick={() =>
              props.mode === MODE.editRoads
                ? props.setMode?.(MODE.view)
                : props.setMode?.(MODE.editRoads)
            }
          >
            <IconRoad size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Edit Waterways" position="bottom">
          <ActionIcon
            variant={props.mode === MODE.editWaterways ? "subtle" : "filled"}
            onClick={() =>
              props.mode === MODE.editWaterways
                ? props.setMode?.(MODE.view)
                : props.setMode?.(MODE.editWaterways)
            }
          >
            <IconSailboat size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Add POIs" position="bottom">
          <ActionIcon
            variant={props.mode === MODE.editPOIs ? "subtle" : "filled"}
            onClick={() =>
              props.mode === MODE.editPOIs
                ? props.setMode?.(MODE.view)
                : props.setMode?.(MODE.editPOIs)
            }
          >
            <IconPin size={20} />
          </ActionIcon>
        </Tooltip>
        {props.mode === MODE.editInfluence && (
          <Tooltip label="Done" position="bottom">
            <ActionIcon
              variant="filled"
              onClick={() => props.doneWithInfluence()}
            >
              <IconCheck size={20} />
            </ActionIcon>
          </Tooltip>
        )}
        {props.mode === MODE.moveLocation && (
          <Tooltip label="Cancel" position="bottom">
            <ActionIcon
              variant="filled"
              onClick={() => props.doneWithMoveLocation()}
            >
              <IconCancel size={20} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Stack>
  );
};