import { io } from "socket.io-client";
import { Location, Map } from "../types";

//const SERVER_URL = "http://192.168.2.148:9036";
const SERVER_URL = "";

export const socket = io(`${SERVER_URL}`, {
  path: "/ws",
  transports: ["websocket"],
});

const MapURL = `${SERVER_URL}/mapdata`;

export const fetchMap = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>,
) => {
  setLoading(true);
  try {
    const response = await fetch(MapURL);
    if (!response.ok) {
      throw new Error("Failed to fetch map");
    }
    const data: Map = await response.json();
    data.locations.forEach((location: Location) => {
      if (location.icon && location.icon.startsWith("/")) {
        location.icon = `${SERVER_URL}${location.icon}`;
      }
    });
    setMap(data);
  } catch (error) {
    console.error("Error fetching map:", error);
  } finally {
    setLoading(false);
  }
};

export const saveMap = (
  mapData: Map,
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>,
) => {
  setMap(mapData);
  fetch(MapURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to save map");
      }
    })
    .catch((error) => {
      console.error("Error saving map:", error);
    });
};

export const setupSocketListener = (
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>,
) => {
  socket.on("mapUpdated", (updatedMap: Map) => {
    updatedMap.locations.forEach((location: Location) => {
      if (location.icon && location.icon.startsWith("/")) {
        location.icon = `${SERVER_URL}${location.icon}`;
      }
    });
    setMap(updatedMap);
  });
};
