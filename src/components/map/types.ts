import { MODE } from "./kingdomMapContainer/mapMode";

export type Map = {
  locations: Location[];
  hexOrientation: "pointy" | "flat";
  hexLayout: "even" | "odd";
  hexApothem: number;
  hexOffset: Coordinate;
  mapOffset: Coordinate;
  imageSize: Coordinate;
  mapSize: Coordinate;
  ownedHexes: Coordinate[];
  reconnoiteredHexes: Coordinate[];
  roads: HexWithLines[];
  rivers: HexWithLines[];
  bridges: Coordinate[];
  reservoirs: Coordinate[];
  nations: {
    name: string;
    color: string;
    hexes: Coordinate[];
  }[];
};

export type HexWithLines = {
  hex: Coordinate;
  useCenter: boolean;
  w: boolean;
  nw: boolean;
  sw: boolean;
  e: boolean;
  se: boolean;
  ne: boolean;
};

export type Location = {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  location: Position;
  hidden: boolean;
};

export type SettlementLocation = Location & {
  type: "settlement";
  size: "village" | "town" | "city" | "metropolis";
  extraInfluenceHexes: Coordinate[];
  isCapital: boolean;
};

export type ImprovementLocation = Location & {
  type: "improvement";
  improvement: "Quarry" | "Mine" | "Lumber Mill" | "Farm" | "Fishery" | "Ranch";
  connectedSettlement: string;
};

export type POILocation = Location & {
  type: "poi";
};

export type Position = {
  hex: Coordinate;
  coordinate: Coordinate;
  latlng: Coordinate;
  sextant: Sextant;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type CubeCoordinate = {
  x: number;
  y: number;
  z: number;
};

export type Sextant = {
  outline: Coordinate[];
  direction: string;
  center: Coordinate;
  edgeMidpoint: Coordinate;
  centroid: Coordinate;
};

export type KingdomMapProps = {
  /** Map data */
  map: Map;
  /** What happens when the user saves the map */
  saveMap: (map: Map) => void;
  /** What happens when the user selects a point on the map */
  onSelectPoint?: (position: Position, clickType: "left" | "right") => void;
  /** What happens when the user selects a marker on the map */
  onSelectMarker?: (location: Location) => void;
  /** What happens when the user unselects a marker on the map */
  onUnselectMarker?: () => void;
  /** What happens when the user starts editing influence */
  startEditingInfluence?: (settlementId: string) => void;
  /** What happens when the user starts moving a location */
  startMovingLocation?: (locationId: string) => void;
  /** Whether to highlight the sextant */
  highlightSextant?: boolean;
  /** Display options for the highlighted sextant */
  highlightSextantOptions?: HexOptions;
  /** Whether to show the selected hex */
  showSelectedHex?: boolean;
  /** Display options for the selected hex */
  selectedHexOptions?: HexOptions;
  /** Display options for the selected hex rings */
  selectedHexRings?: HexOptions[];
  /** Whether to show the selected marker */
  showSelectedMarker?: boolean;
  /** Single marker to display when selected */
  selectedMarker?: SingleMarkerOptions;
  /** Markers to display */
  markers?: MarkerOptions;
  /** Hexes to highlight */
  focusedHexes?: Coordinate[];
  /** Display options for the focused hex */
  focusedHexesOptions?: HexOptions[];
  /** Display options for the focused hex rings */
  focusedHexRings?: HexOptions[];
  /** Hex groups to display */
  hexGroups?: Coordinate[][];
  /** Display options for the hex groups */
  hexGroupOptions?: HexOptions[];
  /** Lines to display and their options */
  lines?: Line[];
  /** Hexes to display with lines */
  hexesWithLines?: HexWithLines[];
  /** Display options for the hexes with lines */
  hexesWithLinesOptions?: HexOptions[];
  /** Whether to prevent zooming */
  preventZoom?: boolean;
  /** Whether to prevent panning */
  preventPan?: boolean;
  /** Initial position of the map */
  initialPosition?: Position;
  /** Initial zoom of the map */
  initialZoom?: number;
};

export type HexOptions = {
  outline: Outline | undefined;
  fill: Fill | undefined;
};

export type Line = {
  start: Coordinate;
  end: Coordinate;
  color: string;
  opacity: number;
  thickness: number;
};

export type SingleMarkerOptions = {
  icon: string;
};

export type MarkerOptions = {
  show: boolean | undefined;
  showAllTypesExcept?: string[] | undefined;
  hideAllTypesExcept?: string[] | undefined;
  showHidden?: boolean | undefined;
};

export type Outline = {
  color: string | undefined;
  opacity: number | undefined;
  thickness: number | undefined;
};

export type Fill = {
  color: string | undefined;
  opacity: number | undefined;
};

export type OnSelectPointFromModeArgs = {
  position: Position;
  map: Map;
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>;
  clickType: "left" | "right";
  locationId?: string;
  doneWithMoveLocation?: () => void;
};

export type FilterButtonProps = {
  mode: MODE;
  setMode: (mode: MODE) => void;
  map: Map | undefined;

  // Called when user is done editing influence
  doneWithInfluence: () => void;

  // Called when user is done moving a location
  doneWithMoveLocation: () => void;
};

