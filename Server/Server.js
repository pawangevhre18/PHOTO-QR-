const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

// ===============================
// FOLDERS
// ===============================

const uploadsPath = path.join(__dirname, "uploads");
const galleriesPath = path.join(__dirname, "galleries");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

if (!fs.existsSync(galleriesPath)) {
  fs.mkdirSync(galleriesPath, { recursive: true });
}

// ===============================
// STATIC UPLOADS
// ===============================

app.use("/uploads", express.static(uploadsPath));

// ===============================
// MULTER STORAGE
// ===============================

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

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "PhotoQR server is running 🚀",
  });
});

// ===============================
// UPLOAD PHOTOS
// ===============================

app.post(
  "/api/upload",
  upload.array("photos", 50),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No photos uploaded.",
        });
      }

      const galleryId =
        crypto.randomBytes(6).toString("hex");

      // ===============================
      // PHOTO DATA
      // ===============================

      const files = req.files.map((file) => ({
        name: file.originalname,
        filename: file.filename,

        // IMPORTANT:
        // Always use HTTPS Render URL
        url: `https://photo-qr-f087.onrender.com/uploads/${file.filename}`,
      }));

      // ===============================
      // GALLERY DATA
      // ===============================

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

      console.log("Gallery created:", galleryId);
      console.log("Photo URLs:", files);

      // ===============================
      // RESPONSE
      // ===============================

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
  }
);

// ===============================
// GET GALLERY
// ===============================

app.get(
  "/api/gallery/:galleryId",
  (req, res) => {
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
  }
);

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `PhotoQR server running on port ${PORT}`
  );
});