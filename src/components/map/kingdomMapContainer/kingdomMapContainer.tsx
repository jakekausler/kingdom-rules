import KingdomMap from "../kingdomMap/kingdomMap";
import { Stack } from "@mantine/core";
import {
  Coordinate,
  HexOptions,
  ImprovementLocation,
  Line,
  Location,
  Map,
  Position,
  SettlementLocation,
} from "../types";
import { useState, useEffect } from "react";
import {
  riverOptions,
  roadsOptions,
} from "./mapOptions";
import { fetchMap, saveMap, setupSocketListener } from "../utils/fetch";
import { MODE } from "./mapMode";
import { onSelectPointFromMode } from "../onSelectPoint/onSelectPoint";
import { FilterButtons } from "./filterButtons";
import { updateHexGroups } from "./hexGroups";
import { displayInfluenceHexes } from "./displayInfluenceHexes";

export const KingdomMapContainer = () => {
  // The kingdom map
  const [map, setMap] = useState<Map | undefined>(undefined);
  // If the map is loading
  const [loading, setLoading] = useState<boolean>(true);
  // The mode of the map (view, edit settlements, etc)
  const [mode, setMode] = useState<MODE>(MODE.view);
  // Border hexes
  const [ownedHexes, setOwnedHexes] = useState<Coordinate[]>([]);
  // Reconnoitered hexes
  const [reconnoiteredHexes, setReconnoiteredHexes] = useState<Coordinate[]>([]);
  // Settlement influence hexes
  const [influenceHexGroups, setInfluenceHexGroups] = useState<Coordinate[][]>(
    [],
  );
  // Extra influence hexes (if displaying with a different color)
  const [extraInfluenceHexGroups, setExtraInfluenceHexGroups] = useState<
    Coordinate[][]
  >([]);
  // Currently editing location id
  const [editingLocationId, setEditingLocationId] = useState<
    string | undefined
  >(undefined);
  // Suppress unselect marker when editing influence
  const [suppressUnselectMarker, setSuppressUnselectMarker] =
    useState<boolean>(false);
  // Lines to draw on the map
  const [lines, setLines] = useState<Line[]>([]);
  // Hex groups to display on the map
  const [hexGroups, setHexGroups] = useState<Coordinate[][]>([]);
  const [hexGroupOptions, setHexGroupOptions] = useState<HexOptions[]>([]);

  // Fetch the initial map and listen for updates
  useEffect(() => {
    fetchMap(setLoading, setMap);
    setupSocketListener(setMap);
  }, []);

  // Update the owned and reconnoitered hexes when the map changes
  useEffect(() => {
    if (map) {
      setOwnedHexes(map.ownedHexes);
      setReconnoiteredHexes(map.reconnoiteredHexes);
    }
  }, [map]);

  // Update the influence hex groups when editing influence
  useEffect(() => {
    if (map && editingLocationId) {
      if (map.locations.find((l) => l.id === editingLocationId)) {
        displayInfluenceHexes(map, editingLocationId, true, setInfluenceHexGroups, setExtraInfluenceHexGroups);
      } else {
        setMode(MODE.view);
        setEditingLocationId(undefined);
        setSuppressUnselectMarker(false);
        setInfluenceHexGroups([]);
        setExtraInfluenceHexGroups([]);
      }
    }
  }, [map, editingLocationId, displayInfluenceHexes]);

  // Update the hex groups when the map or influence hex groups change
  useEffect(() => {
    if (!map) return;
    updateHexGroups(map, setHexGroups, setHexGroupOptions, ownedHexes, reconnoiteredHexes, influenceHexGroups, extraInfluenceHexGroups);
  }, [map, ownedHexes, reconnoiteredHexes, influenceHexGroups, extraInfluenceHexGroups]);

  if (!map) {
    return <div>Loading...</div>;
  }

  return (
    <Stack w="100%" h="calc(-40px + 100vh)" gap={0}>
      <FilterButtons
        setMode={setMode}
        map={map}
        mode={mode}
        doneWithInfluence={() => {
          setMode(MODE.view);
          setEditingLocationId(undefined);
          setSuppressUnselectMarker(false);
          setInfluenceHexGroups([]);
          setExtraInfluenceHexGroups([]);
        }}
        doneWithMoveLocation={() => {
          setMode(MODE.view);
          setEditingLocationId(undefined);
        }}
      />
      {loading || !map ? (
        <div>Loading...</div>
      ) : (
        <KingdomMap
          map={map as Map}
          saveMap={(map: Map) => saveMap(map, setMap)}
          onSelectPoint={(position: Position, clickType: "left" | "right") =>
            onSelectPointFromMode[mode]({
              position,
              map,
              setMap,
              clickType,
              locationId: editingLocationId,
              doneWithMoveLocation: () => {
                setMode(MODE.view);
                setEditingLocationId(undefined);
              },
            })
          }
          startEditingInfluence={(settlementId: string) => {
            setSuppressUnselectMarker(true);
            setEditingLocationId(settlementId);
            setMode(MODE.editInfluence);
          }}
          startMovingLocation={(locationId: string) => {
            setMode(MODE.moveLocation);
            setEditingLocationId(locationId);
          }}
          highlightSextant={mode === MODE.editRoads || mode === MODE.editWaterways}
          highlightSextantOptions={{
            outline: {
              color: "blue",
              opacity: 0.5,
              thickness: 4,
            },
            fill: {
              color: "blue",
              opacity: 0.1,
            },
          }}
          markers={{
            show: true,
          }}
          onSelectMarker={(location: Location) => {
            if (!map) {
              return;
            }
            switch (location.type) {
              case "settlement":
                displayInfluenceHexes(map, location.id, false, setInfluenceHexGroups, setExtraInfluenceHexGroups);
                break;
              case "improvement":
                const connectedSettlement = map.locations.find(
                  (l) => l.id === (location as ImprovementLocation).connectedSettlement,
                ) as SettlementLocation | undefined;
                if (!connectedSettlement) {
                  return;
                }
                setLines([
                  {
                    start: location.location.latlng,
                    end: connectedSettlement.location.latlng,
                    color: "red",
                    thickness: 4,
                    opacity: 0.5,
                  },
                ]);
                break;
            }
          }}
          onUnselectMarker={() => {
            if (!suppressUnselectMarker) {
              setInfluenceHexGroups([]);
              setEditingLocationId(undefined);
              setExtraInfluenceHexGroups([]);
              setLines([]);
            }
          }}
          hexGroups={hexGroups}
          hexGroupOptions={hexGroupOptions}
          lines={lines}
          hexesWithLines={map.rivers.concat(map.roads)}
          hexesWithLinesOptions={map.rivers.map(() => riverOptions).concat(map.roads.map(() => roadsOptions))}
        />
      )}
    </Stack>
  );
};
