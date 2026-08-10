import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Image as ImageIcon,
  QrCode,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const newPhotos = imageFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setPhotos((previous) => [...previous, ...newPhotos]);

    event.target.value = "";
  };

  const removePhoto = (id) => {
    setPhotos((previous) => {
      const photoToRemove = previous.find((photo) => photo.id === id);

      if (photoToRemove?.preview) {
        URL.revokeObjectURL(photoToRemove.preview);
      }

      return previous.filter((photo) => photo.id !== id);
    });
  };

  const clearPhotos = () => {
    photos.forEach((photo) => {
      if (photo.preview) {
        URL.revokeObjectURL(photo.preview);
      }
    });

    setPhotos([]);
  };

  const generateQR = async () => {
  if (photos.length === 0) {
    alert("Please select at least one photo.");
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();

    photos.forEach((photo) => {
      formData.append("photos", photo.file);
    });

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Backend response:", data);

    if (!data.success || !Array.isArray(data.photos)) {
      throw new Error("Invalid response from server.");
    }

   console.log("Uploaded photos:", data.photos);
console.log("Gallery ID:", data.galleryId);

if (!data.galleryId) {
  throw new Error("Gallery ID nahi mila.");
}

localStorage.setItem("galleryId", data.galleryId);

localStorage.setItem(
  "uploadedPhotos",
  JSON.stringify(data.photos)
);

console.log(
  "Gallery successfully created:",
  data.galleryId
);

navigate("/result");
    // Verify immediately
    console.log(
  "Gallery successfully created:",
  data.galleryId
);

navigate("/result");

    navigate("/result");
  } catch (error) {
    console.error("Upload error:", error);

    alert(
      "Photos upload nahi ho payi.\n\n" +
        error.message
    );
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
              <QrCode size={23} />
            </div>

            <span className="text-xl font-bold">
              Photo<span className="text-purple-400">QR</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Home
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-400">
            <UploadCloud size={32} />
          </div>

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            Upload Your Photos
          </h1>

          <p className="mt-3 text-slate-400">
            Select your photos and create a QR code to share them.
          </p>
        </div>

        {/* Upload Box */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center transition hover:border-purple-400/40 hover:bg-purple-500/[0.03]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400">
              <ImageIcon size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Choose Photos
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              JPG, PNG, WEBP and other image formats
            </p>

            <span className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500">
              Browse Photos
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Selected Photos */}
        {photos.length > 0 && (
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Selected Photos
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {photos.length}{" "}
                  {photos.length === 1 ? "photo" : "photos"} selected
                </p>
              </div>

              <button
                onClick={clearPhotos}
                className="flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="aspect-square overflow-hidden bg-slate-900">
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-red-500"
                    title="Remove photo"
                  >
                    <X size={17} />
                  </button>

                  <div className="p-3">
                    <p className="truncate text-sm text-slate-400">
                      {photo.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQR}
              disabled={isUploading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-4 text-lg font-bold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <QrCode size={22} />

              {isUploading
                ? "Uploading Photos..."
                : "Generate QR Code"}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PhotoQR. Simple photo sharing with QR.
        </div>
      </footer>
    </div>
  );
}

export default Upload;