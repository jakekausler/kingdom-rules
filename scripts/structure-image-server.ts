import express, { Request, Response } from "express";
import { getStructureImage } from "./getStructureImage";

const app = express();
const PORT = process.env.PORT || 9033;

// Route to serve and manipulate images
app.get("/structures/:structure", async (req: Request, res: Response) => {
  try {
    const manipulatedImage = await getStructureImage(req);
    res.set("Content-Type", "image/png");
    res.send(manipulatedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing image");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
