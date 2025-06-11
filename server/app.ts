import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from "url";
import { getStructureImage } from "../scripts/getStructureImage";
import fs from "fs";

// Define __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: express.Application = express();
const PORT: number = parseInt(process.env.PORT || "9036", 10);

const server = http.createServer(app);
const io = new Server(server, {
  path: "/ws",
  transports: ["websocket"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// Serve static files from the '../dist' directory
app.use(express.static(path.join(__dirname, "../dist")));

app.get("/structures/:structure", async (req, res) => {
  try {
    const manipulatedImage = await getStructureImage(req);
    res.set("Content-Type", "image/png");
    res.send(manipulatedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing image");
  }
});

app.get("/tiles/:z/:x/:y", (req: Request, res: Response) => {
  const { x, y, z } = req.params;
  const tilePath = path.join(
    __dirname,
    "../src/assets",
    "tiles",
    `${z}`,
    `${x}`,
    `${y}.jpg`,
  );
  res.sendFile(tilePath, (err) => {
    if (err) {
      res.status(404).send("Tile not found");
    }
  });
});

app.get("/mapdata", (_req: Request, res: Response) => {
  const mapPath = path.join(__dirname, "../json", "map.json");
  const mapData = fs.readFileSync(mapPath, "utf8");
  res.json(JSON.parse(mapData));
});

app.post("/mapdata", (req: Request, res: Response) => {
  const mapPath = path.join(__dirname, "../json", "map.json");
  const mapData = JSON.stringify(req.body, null, 2);

  fs.writeFile(mapPath, mapData, (err) => {
    if (err) {
      console.error("Error writing map data:", err);
      return res.status(500).send("Error saving map data");
    }
    res.status(200).send("Map data saved successfully");
    io.emit("mapUpdated", req.body);
  });
});

app.get("/mapicons", (req: Request, res: Response) => {
  const iconPath = path.join(__dirname, "../src/assets", "mapicons");
  const icons = fs.readdirSync(iconPath);
  res.json(icons);
});

app.get("/mapicons/:icon", (req: Request, res: Response) => {
  const iconPath = path.join(
    __dirname,
    "../src/assets",
    "mapicons",
    req.params.icon,
  );
  res.sendFile(iconPath, (err) => {
    if (err) {
      res.status(404).send("Icon not found");
    }
  });
});

// Handle all other routes by serving the index.html file
app.get("*", (_req: Request, res: Response) => {
  console.log("Path: ", _req.path);
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
