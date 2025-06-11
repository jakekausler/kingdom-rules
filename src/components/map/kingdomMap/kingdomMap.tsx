import { useEffect, useState } from "react";
import { Coordinate, Location, Sextant, HexOptions } from "../types";
import {
  MapContainer,
  Tooltip,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Popup,
} from "react-leaflet";
import {
  CRS,
  divIcon,
  LatLngBoundsExpression,
  marker as _marker,
  LatLngExpression,
} from "leaflet";
import "./kingdomMap.css";
import {
  mapPointToLatlng,
  latlngToMapPoint,
  getMapBounds,
  getMapCenter,
} from "../utils/geometry";
import {
  getHex,
  getHexCoordinates,
  getSextantFromPosition,
} from "../utils/hexagons";
import { KingdomMapProps } from "../types";
import PopupContent from "./popup/popupContent";
import { useMantineColorScheme } from "@mantine/core";
import "./popup/popup.css";
import Curve from "./leafletBezier";
import { LocationSelector } from "./locationSelector";
import { getIcon } from "./getIcon";
import { updateLocations } from "./updateLocations";
import { updateFocusedHexes } from "./updateFocusedHexes";
import { updateHexGroups } from "./updateHexGroups";
import { updatePaths } from "./updatePaths";

//const tileLayerUrl = "http://192.168.2.148:9036/tiles/{z}/{x}/{y}";
const tileLayerUrl = "/tiles/{z}/{x}/{y}";

export default function KingdomMap(props: KingdomMapProps) {
  const {
    map,
    saveMap,
    onSelectPoint,
    onSelectMarker,
    onUnselectMarker,
    startEditingInfluence,
    startMovingLocation,
    highlightSextant,
    highlightSextantOptions,
    showSelectedHex,
    selectedHexOptions,
    selectedHexRings: _selectedHexRings,
    showSelectedMarker,
    selectedMarker,
    markers,
    focusedHexes,
    focusedHexesOptions,
    focusedHexRings: _focusedHexRings,
    hexGroups,
    hexGroupOptions,
    lines,
    hexesWithLines,
    hexesWithLinesOptions,
    initialPosition,
    initialZoom,
    preventZoom,
    preventPan,
  } = props;

  // Selected hexes in latlng coordinates
  const [selectedHexes, setSelectedHexes] = useState<Coordinate[][]>([]);
  // All focused hexes in latlng coordinates
  const [allFocusedHexes, setAllFocusedHexes] = useState<Coordinate[][]>([]);
  // New marker in latlng coordinates
  const [newMarker, setNewMarker] = useState<Coordinate | null>(null);
  // Hex groups in latlng coordinates
  const [hexGroupPolygons, setHexGroupPolygons] = useState<Coordinate[][][]>(
    [],
  );
  // Currently hovered sextant
  const [hoveredSextant, setHoveredSextant] = useState<Sextant | null>(null);
  // Paths to display with Curves and their options
  const [paths, setPaths] = useState<
    {
      path: (string | [number, number])[];
      options: HexOptions;
    }[]
  >([]);

  // Center of the map
  const [center, setCenter] = useState<Coordinate>(
    getMapCenter(initialPosition || null, map),
  );

  // Locations to display
  const [locations, setLocations] = useState<Location[]>([]);

  // Whether the site is in dark mode
  const colorScheme = useMantineColorScheme();
  const isDark = colorScheme.colorScheme === "dark";

  // Bounds of the map
  const bounds = getMapBounds(map);

  // Update the center of the map when the initial position changes
  useEffect(() => {
    setCenter(getMapCenter(initialPosition || null, map));
  }, [initialPosition, map]);

  // Update the locations to display when the markers change
  useEffect(() => {
    updateLocations(markers || { show: false }, map, setLocations);
  }, [map, markers]);

  // Update the focused hexes when the focused hexes change
  useEffect(() => {
    updateFocusedHexes(focusedHexes || [], map, setAllFocusedHexes);
  }, [focusedHexes, map]);

  // Update the hex groups when the hex groups change
  useEffect(() => {
    updateHexGroups(hexGroups || [], map, setHexGroupPolygons);
  }, [hexGroups, map]);

  // Update the paths when the hexes with lines change
  useEffect(() => {
    updatePaths(
      map,
      hexesWithLines || [],
      hexesWithLinesOptions || [],
      setPaths,
    );
  }, [map, hexesWithLines, hexesWithLinesOptions]);

  const onClick = (latlng: Coordinate, clickType: "left" | "right") => {
    if (!map) return;
    const mapPoint = latlngToMapPoint(latlng, map);
    const hex = getHexCoordinates(
      mapPoint,
      map.hexOffset,
      map.hexApothem,
      map.hexOrientation,
      map.hexLayout,
    );
    const sextant = getSextantFromPosition(
      mapPoint,
      map.hexOffset,
      map.hexApothem,
      map.hexOrientation,
      map.hexLayout,
    );
    const outline = getHex(
      hex,
      map.hexOffset,
      map.hexApothem,
      map.hexOrientation,
      map.hexLayout,
    );
    const latlngOutline = outline.map((p) => mapPointToLatlng(p, map));

    if (showSelectedHex) {
      setSelectedHexes([latlngOutline]);
    }
    if (showSelectedMarker) {
      setNewMarker(latlng);
    }
    if (onSelectPoint) {
      onSelectPoint(
        {
          latlng,
          coordinate: mapPoint,
          hex,
          sextant,
        },
        clickType,
      );
    }
    if (onUnselectMarker) {
      onUnselectMarker();
    }
  };

  const onHover = (position: Coordinate) => {
    if (!map) return;
    const mapPoint = latlngToMapPoint(position, map);
    const sextant = getSextantFromPosition(
      mapPoint,
      map.hexOffset,
      map.hexApothem,
      map.hexOrientation,
      map.hexLayout,
    );
    // If the sextant is the same as the hovered sextant, do nothing
    if (
      hoveredSextant &&
      hoveredSextant.direction === sextant.direction &&
      hoveredSextant.outline.every(
        (p, i) => p.x === sextant.outline[i].x && p.y === sextant.outline[i].y,
      )
    ) {
      return;
    }
    setHoveredSextant(sextant);
  };

  return (
    <>
      {map && (
        <MapContainer
          className="map"
          center={[center.y, center.x]}
          zoom={initialZoom === undefined ? 2 : initialZoom}
          minZoom={2}
          maxZoom={5}
          crs={CRS.Simple}
          zoomControl={!preventZoom}
          scrollWheelZoom={!preventZoom}
          doubleClickZoom={!preventZoom}
          touchZoom={!preventZoom}
          boxZoom={!preventZoom}
          dragging={!preventPan}
          maxBounds={bounds as LatLngBoundsExpression}
          maxBoundsViscosity={1.0}
        >
          <TileLayer url={tileLayerUrl} />
          <LocationSelector
            onClick={(position: Coordinate) => onClick(position, "left")}
            onRightClick={(position: Coordinate) => onClick(position, "right")}
            onHover={(position: Coordinate) => onHover(position)}
          />
          {paths.map((path, idx) => (
            <Curve
              key={idx}
              path={path.path}
              options={{
                color: path.options.outline?.color,
                opacity: path.options.outline?.opacity,
                weight: path.options.outline?.thickness,
              }}
            />
          ))}
          {focusedHexesOptions &&
            focusedHexesOptions.length === allFocusedHexes.length &&
            allFocusedHexes.map((outline, idx) => {
              const options = focusedHexesOptions[idx];
              return (
                <Polygon
                  positions={outline.map((p) => [p.y, p.x])}
                  key={`${idx}-${options.outline?.color}-${options.fill?.color}`}
                  color={options.outline?.color}
                  opacity={options.outline?.opacity}
                  weight={options.outline?.thickness}
                  fill={!!options.fill?.color}
                  fillColor={options.fill?.color}
                  fillOpacity={options.fill?.opacity}
                />
              );
            })}
          {hexGroupPolygons.map((polygonOutlines, idx) => {
            const options = hexGroupOptions?.[idx];
            const key = `${idx}-${options?.fill?.color}-${options?.outline?.color}`;
            return (
              <Polygon
                positions={
                  polygonOutlines.map((outline) =>
                    outline.map((p) => [p.y, p.x]),
                  ) as LatLngExpression[][]
                }
                key={key}
                color={options?.outline?.color}
                opacity={options?.outline?.opacity}
                weight={options?.outline?.thickness}
                fill={!!options?.fill?.color}
                fillColor={options?.fill?.color}
                fillOpacity={options?.fill?.opacity}
              />
            );
          })}
          {selectedHexes.map((outline, idx) => {
            const options = selectedHexOptions;
            return (
              <Polygon
                positions={outline.map((p) => [p.y, p.x])}
                key={idx}
                color={options?.outline?.color}
                opacity={options?.outline?.opacity}
                weight={options?.outline?.thickness}
                fill={!!options?.fill?.color}
                fillColor={options?.fill?.color}
                fillOpacity={options?.fill?.opacity}
              />
            );
          })}
          {highlightSextant && hoveredSextant && (
            <Polygon
              positions={hoveredSextant.outline.map((p) => {
                const latlng = mapPointToLatlng(p, map);
                return [latlng.y, latlng.x];
              })}
              key={`${hoveredSextant.direction}-${hoveredSextant.outline.map((p) => [p.y, p.x])}`}
              color={highlightSextantOptions?.outline?.color}
              opacity={highlightSextantOptions?.outline?.opacity}
              weight={highlightSextantOptions?.outline?.thickness}
              fill={!!highlightSextantOptions?.fill?.color}
              fillColor={highlightSextantOptions?.fill?.color}
              fillOpacity={highlightSextantOptions?.fill?.opacity}
            />
          )}
          {lines &&
            lines.map((line, idx) => (
              <Polyline
                key={idx}
                pathOptions={{
                  color: line.color,
                  opacity: line.opacity,
                  weight: line.thickness,
                }}
                positions={[
                  [line.start.y, line.start.x],
                  [line.end.y, line.end.x],
                ]}
              />
            ))}
          {(newMarker && selectedMarker && (
            <Marker
              icon={divIcon({
                className: "map-marker",
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                html: `<img width="100%" height="100%" src="${selectedMarker.icon}" />`,
              })}
              position={[newMarker.y, newMarker.x]}
            />
          )) ||
            (newMarker && <Marker position={[newMarker.y, newMarker.x]} />)}

          {locations.map((location) => (
            <Marker
              key={location.id}
              icon={getIcon(location, map)}
              position={[
                location.location.latlng.y,
                location.location.latlng.x,
              ]}
              eventHandlers={{
                popupopen: () => {
                  onUnselectMarker?.();
                  onSelectMarker?.(location);
                  setNewMarker(null);
                },
              }}
            >
              <Popup
                className={isDark ? "dark" : ""}
                minWidth={200}
                maxWidth={200}
              >
                <PopupContent
                  location={location}
                  map={map}
                  onSave={saveMap}
                  startEditingInfluence={startEditingInfluence || (() => {})}
                  startMovingLocation={startMovingLocation || (() => {})}
                />
              </Popup>
              <Tooltip direction="top" offset={[0, -12]}>
                {location.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
}
