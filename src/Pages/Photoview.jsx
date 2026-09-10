
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Image as ImageIcon,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { useEffect, useState } from "react";

function PhotoView() {
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const galleryId = window.location.pathname.split("/").pop();

        console.log("Gallery ID:", galleryId);

        if (!galleryId || galleryId === "demo") {
          console.error("Invalid gallery ID");
          setPhotos([]);
          return;
        }

        const response = await fetch(
          `https://photo-qr-f087.onrender.com/api/gallery/${galleryId}`
        );

        if (!response.ok) {
          throw new Error(
            `Gallery fetch failed: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Gallery API response:", data);

        if (data.success && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        } else {
          setPhotos([]);
        }
      } catch (error) {
        console.error("PhotoView error:", error);
        setPhotos([]);
      }
    };

    loadGallery();
  }, []);

  const shareGallery = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "PhotoQR Gallery",
          text: "Check out these photos",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Gallery link copied!");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  const downloadPhoto = async (photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download =
        photo.name || photo.filename || "PhotoQR-photo.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback
      window.open(photo.url, "_blank");
    }
  };

  const openPreview = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closePreview = () => {
    setSelectedPhoto(null);
  };

  const showPrevious = () => {
    if (photos.length === 0) return;

    const newIndex =
      selectedIndex === 0
        ? photos.length - 1
        : selectedIndex - 1;

    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const showNext = () => {
    if (photos.length === 0) return;

    const newIndex =
      selectedIndex === photos.length - 1
        ? 0
        : selectedIndex + 1;

    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedPhoto) return;

      if (event.key === "Escape") {
        closePreview();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto, selectedIndex, photos]);

  return (
    <div className="min-h-screen bg-[#070b18] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">

          <Link
            to="/"
            className="text-xl font-bold"
          >
            Photo
            <span className="text-purple-400">
              QR
            </span>
          </Link>

          <button
            onClick={shareGallery}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm transition hover:border-purple-400 hover:bg-white/5 sm:px-4"
          >
            <Share2 size={17} />
            <span>Share</span>
          </button>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/result")}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Result
        </button>

        {/* Heading */}
        <div className="mb-10 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-400">
            <ImageIcon size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            Photo Gallery
          </h1>

          <p className="mt-2 text-slate-400">
            {photos.length}{" "}
            {photos.length === 1
              ? "photo"
              : "photos"}{" "}
            available
          </p>

        </div>

        {/* Gallery */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {photos.map((photo, index) => (

              <div
                key={photo.filename || index}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl"
              >

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-900">

                  <button
                    onClick={() =>
                      openPreview(photo, index)
                    }
                    className="block h-full w-full cursor-pointer"
                    aria-label={`Preview ${
                      photo.name ||
                      `Photo ${index + 1}`
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={
                        photo.name ||
                        `Photo ${index + 1}`
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={() => {
                        console.error(
                          "Image failed to load:",
                          photo.url
                        );
                      }}
                    />
                  </button>

                  {/* Number */}
                  <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {index + 1}
                  </div>

                  {/* Preview Button */}
                  <button
                    onClick={() =>
                      openPreview(photo, index)
                    }
                    className="absolute bottom-3 left-3 flex h-10 items-center gap-2 rounded-xl bg-black/70 px-3 text-sm font-medium opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-purple-600"
                    title="Preview"
                  >
                    <Maximize2 size={17} />
                    Preview
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={() =>
                      downloadPhoto(photo)
                    }
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 backdrop-blur transition hover:bg-purple-600 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>

                </div>

                {/* Photo Details */}
                <div className="p-4">

                  <p className="truncate text-sm font-medium text-slate-300">
                    {photo.name ||
                      `Photo ${index + 1}`}
                  </p>

                  <div className="mt-3 flex gap-2">

                    {/* Preview */}
                    <button
                      onClick={() =>
                        openPreview(photo, index)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-purple-400 hover:text-white"
                    >
                      <Maximize2 size={16} />
                      Preview
                    </button>

                    {/* Download */}
                    <button
                      onClick={() =>
                        downloadPhoto(photo)
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold transition hover:bg-purple-500"
                    >
                      <Download size={16} />
                      Download
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        ) : (

          /* Empty State */
          <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center sm:p-12">

            <ImageIcon
              size={48}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-5 text-xl font-bold">
              No photos available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This photo collection is empty or unavailable.
            </p>

            <Link
              to="/upload"
              className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
            >
              Upload Photos
            </Link>

          </div>

        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} PhotoQR
      </footer>


      {/* ========================= */}
      {/* FULL SCREEN PHOTO PREVIEW */}
      {/* ========================= */}

      {selectedPhoto && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">

          {/* Close */}
          <button
            onClick={closePreview}
            className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label="Close preview"
          >
            <X size={24} />
          </button>

          {/* Counter */}
          <div className="absolute left-4 top-5 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300 backdrop-blur sm:left-6 sm:top-6">
            {selectedIndex + 1} / {photos.length}
          </div>

          {/* Previous */}
          {photos.length > 1 && (
            <button
              onClick={showPrevious}
              className="absolute left-3 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-purple-600 sm:left-6"
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Photo Container */}
          <div className="flex max-h-[90vh] max-w-[92vw] flex-col items-center">

            <img
              src={selectedPhoto.url}
              alt={
                selectedPhoto.name ||
                "Photo preview"
              }
              className="max-h-[72vh] max-w-full rounded-xl object-contain shadow-2xl sm:max-h-[78vh]"
            />

            {/* Photo Name */}
            <p className="mt-4 max-w-[80vw] truncate text-sm text-slate-300">
              {selectedPhoto.name ||
                `Photo ${selectedIndex + 1}`}
            </p>

            {/* Preview Actions */}
            <div className="mt-4 flex gap-3">

              <button
                onClick={() =>
                  downloadPhoto(selectedPhoto)
                }
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
              >
                <Download size={18} />
                Download
              </button>

              <button
                onClick={closePreview}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>

            </div>

          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={showNext}
              className="absolute right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-purple-600 sm:right-6"
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          )}

        </div>

      )}

    </div>
  );
}

export default PhotoView;
