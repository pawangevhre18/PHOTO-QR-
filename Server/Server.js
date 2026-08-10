const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, "uploads");
const galleriesPath = path.join(__dirname, "galleries");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

if (!fs.existsSync(galleriesPath)) {
  fs.mkdirSync(galleriesPath);
}

app.use("/uploads", express.static(uploadsPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

app.get("/", (req, res) => {
  res.json({
    message: "PhotoQR server is running 🚀",
  });
});

/*
  Upload photos
*/
app.post("/api/upload", upload.array("photos", 50), (req, res) => {
  try {
    const galleryId = crypto.randomBytes(6).toString("hex");

    const files = req.files.map((file) => ({
      name: file.originalname,
      filename: file.filename,
      url: `http://${getLocalIP()}:${PORT}/uploads/${file.filename}`,
    }));

    const galleryData = {
      galleryId,
      photos: files,
      createdAt: new Date().toISOString(),
    };

    const galleryFile = path.join(
      galleriesPath,
      `${galleryId}.json`
    );

    fs.writeFileSync(
      galleryFile,
      JSON.stringify(galleryData, null, 2)
    );

    res.json({
      success: true,
      galleryId,
      photos: files,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed.",
    });
  }
});

/*
  Get gallery by ID
*/
app.get("/api/gallery/:galleryId", (req, res) => {
  try {
    const { galleryId } = req.params;

    const galleryFile = path.join(
      galleriesPath,
      `${galleryId}.json`
    );

    if (!fs.existsSync(galleryFile)) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found.",
      });
    }

    const galleryData = JSON.parse(
      fs.readFileSync(galleryFile, "utf8")
    );

    res.json({
      success: true,
      galleryId: galleryData.galleryId,
      photos: galleryData.photos,
    });
  } catch (error) {
    console.error("Gallery error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load gallery.",
    });
  }
});

/*
  Find laptop's local network IP
*/
function getLocalIP() {
  const interfaces = require("os").networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const network of interfaces[name]) {
      if (
        network.family === "IPv4" &&
        !network.internal
      ) {
        return network.address;
      }
    }
  }

  return "localhost";
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `PhotoQR server running on http://localhost:${PORT}`
  );
});
