import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getStructureImage } from '../scripts/getStructureImage';

// Define __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: express.Application = express();
const PORT: number = parseInt(process.env.PORT || '9035', 10);

// Serve static files from the '../dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/structures/:structure', async (req, res) => {
  try {
    const manipulatedImage = await getStructureImage(req);
    res.set("Content-Type", "image/png");
    res.send(manipulatedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing image");
  }
});

// Handle all other routes by serving the index.html file
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 