import path from "path";
import sharp from "sharp";
import { Request } from "express";
import fs from "fs";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getStructureImage = async (req: Request) => {
  const { structure } = req.params as { structure: string };
  const { orientation, piece, completed, needed, damaged } = req.query as { orientation: string, piece: string, completed: string, needed: string, damaged: string };
  const structuresDir = path.join(__dirname, "../src/assets/structures");
  const extensions = [".png", ".jpg", ".jpeg", ".webp"];

  // Find the first matching file with a supported extension
  let imagePath;
  for (const ext of extensions) {
    const testPath = path.join(structuresDir, structure + ext);
    if (fs.existsSync(testPath)) {
      imagePath = testPath;
      break;
    }
  }

  try {
    if (!imagePath) {
      throw new Error(`Image not found for structure: ${structure}`);
    }
    // Perform image manipulation using sharp
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    let manipulatedImage;

    if (!orientation) {
      if (piece) {
        const pieceInt = parseInt(piece as string, 10);
        switch (pieceInt) {
          case 1:
            manipulatedImage = await image.extract({
              left: 0,
              top: 0,
              width: width / 2,
              height: height / 2,
            });
            break;
          case 2:
            manipulatedImage = await image.extract({
              left: width / 2,
              top: 0,
              width: width / 2,
              height: height / 2,
            });
            break;
          case 3:
            manipulatedImage = await image.extract({
              left: 0,
              top: height / 2,
              width: width / 2,
              height: height / 2,
            });
            break;
          case 4:
            manipulatedImage = await image.extract({
              left: width / 2,
              top: height / 2,
              width: width / 2,
              height: height / 2,
            });
            break;
        }
      } else {
        manipulatedImage = await image;
      }
    } else {
      if (
        (orientation === "vertical" && (piece === "1" || piece === "2")) ||
        (orientation === "horizontal" && (piece === "1" || piece === "3"))
      ) {
        manipulatedImage = await image.extract({
          left: 0,
          top: 0,
          width: width / 2,
          height,
        });
      } else {
        manipulatedImage = await image.extract({
          left: width / 2,
          top: 0,
          width: width / 2,
          height,
        });
      }
      if (orientation === "vertical") {
        manipulatedImage = await manipulatedImage.rotate(90);
      }
    }
    if (completed && needed) {
      if (completed !== needed && parseInt(needed, 10) !== 0) {
        const percentage = parseInt(completed, 10) / parseInt(needed, 10);
        let progressWidth = 0;
        const heightPercentage = 0.05;
        let progressHeight = 0;
        let imageHeight = height;
        if (!orientation) {
          if (piece === "3") {
            progressWidth = Math.min(width / 2, Math.floor(percentage * width));
            progressHeight = Math.min(
              height / 2,
              Math.floor((height / 2) * heightPercentage),
            );
            imageHeight = height / 2;
          } else if (piece === "4") {
            progressWidth = Math.min(
              width / 2,
              Math.floor(percentage * width - width / 2),
            );
            progressHeight = Math.min(
              height / 2,
              Math.floor((height / 2) * heightPercentage),
            );
            imageHeight = height / 2;
          } else if (!piece) {
            progressWidth = Math.min(width, Math.floor(percentage * width));
            progressHeight = Math.min(
              height,
              Math.floor(height * heightPercentage),
            );
            imageHeight = height;
          }
        } else {
          if (orientation === "horizontal") {
            if (piece === "3" || piece === "1") {
              progressWidth = Math.min(
                width / 2,
                Math.floor(percentage * width),
              );
            } else if (piece === "4" || piece === "2") {
              progressWidth = Math.min(
                width / 2,
                Math.floor(percentage * width - width / 2),
              );
            }
            progressHeight = Math.floor(height * heightPercentage);
          } else if (orientation === "vertical") {
            progressWidth = Math.min(
              width / 2,
              Math.floor((percentage * width) / 2),
            );
            progressHeight = Math.min(
              height / 2,
              Math.floor((height / 2) * heightPercentage),
            );
          }
        }
        const progressY = imageHeight - progressHeight;

        if (progressWidth > 0) {
          if (!orientation) {
            if (piece === "3") {
              // Draw left half of progress bar
              manipulatedImage = await manipulatedImage.composite([
                {
                  input: {
                    create: {
                      width: progressWidth,
                      height: progressHeight,
                      channels: 4,
                      background: { r: 0, g: 255, b: 0, alpha: 0.5 },
                    },
                  },
                  left: 0,
                  top: progressY,
                },
              ]);
            } else if (piece === "4") {
              // Draw right half of progress bar
              manipulatedImage = await manipulatedImage.composite([
                {
                  input: {
                    create: {
                      width: progressWidth,
                      height: progressHeight,
                      channels: 4,
                      background: { r: 0, g: 255, b: 0, alpha: 0.5 },
                    },
                  },
                  left: 0,
                  top: progressY,
                },
              ]);
            } else if (!piece) {
              // Draw full progress bar
              manipulatedImage = await manipulatedImage.composite([
                {
                  input: {
                    create: {
                      width: progressWidth,
                      height: progressHeight,
                      channels: 4,
                      background: { r: 0, g: 255, b: 0, alpha: 0.5 },
                    },
                  },
                  left: 0,
                  top: progressY,
                },
              ]);
            }
          } else if (orientation === "horizontal") {
            if (["1", "3"].includes(piece)) {
              // Draw left half
              manipulatedImage = await manipulatedImage.composite([
                {
                  input: {
                    create: {
                      width: progressWidth,
                      height: progressHeight,
                      channels: 4,
                      background: { r: 0, g: 255, b: 0, alpha: 0.5 },
                    },
                  },
                  left: 0,
                  top: progressY,
                },
              ]);
            } else if (["2", "4"].includes(piece)) {
              // Draw right half
              manipulatedImage = await manipulatedImage.composite([
                {
                  input: {
                    create: {
                      width: progressWidth,
                      height: progressHeight,
                      channels: 4,
                      background: { r: 0, g: 255, b: 0, alpha: 0.5 },
                    },
                  },
                  left: 0,
                  top: progressY,
                },
              ]);
            }
          } else if (orientation === "vertical" && ["3", "4"].includes(piece)) {
            // Draw full progress bar
            manipulatedImage = await manipulatedImage.composite([
              {
                input: {
                  create: {
                    width: progressWidth,
                    height: progressHeight,
                    channels: 4,
                    background: { r: 0, g: 255, b: 0, alpha: 0.5 },
                  },
                },
                left: 0,
                top: progressY,
              },
            ]);
          }
        }
      }
    }
    manipulatedImage = await manipulatedImage.toBuffer();
    if (damaged && damaged.toString().toLowerCase() === "true") {
      manipulatedImage = await sharp(manipulatedImage)
        // Apply a red tint to simulate damage
        .tint({ r: 255, g: 0, b: 0, alpha: 0.1 })
        .toBuffer();
    }
    return manipulatedImage;
  } catch (error) {
    console.error(error);
    throw new Error("Error processing image");
  }
};