import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, 
  
  Download,
  Image as ImageIcon,
  QrCode,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";

function PhotoView() {
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);

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
        `http://192.168.29.132:5000/api/gallery/${galleryId}`
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
      await navigator.clipboard.writeText(window.location.href);
      alert("Gallery link copied!");
    } catch {
      alert("Unable to copy gallery link.");
    }
  };

  const downloadPhoto = (photo) => {
    const link = document.createElement("a");

    link.href = photo.url;
    link.download = photo.name || photo.filename;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
              <QrCode size={22} />
            </div>

            <span className="text-xl font-bold">
              Photo<span className="text-purple-400">QR</span>
            </span>
          </Link>

          <button
            onClick={shareGallery}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:border-purple-400"
          >
            <Share2 size={17} />
            Share
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <button
          onClick={() => navigate("/result")}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Result
        </button>

        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-400">
            <ImageIcon size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            Photo Gallery
          </h1>

          <p className="mt-2 text-slate-400">
            {photos.length}{" "}
            {photos.length === 1 ? "photo" : "photos"} available
          </p>
        </div>

        {/* Gallery */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={photo.filename || index}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <img
                    src={photo.url}
                    alt={photo.name || `Photo ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={() => {
                      console.error(
                        "Image failed to load:",
                        photo.url
                      );
                    }}
                  />

                  <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {index + 1}
                  </div>

                  <button
                    onClick={() => downloadPhoto(photo)}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-purple-600"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                </div>

                {/* Photo name */}
                <div className="p-4">
                  <p className="truncate text-sm font-medium text-slate-300">
                    {photo.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Photo {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
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
    </div>
  );
}

export default PhotoView;