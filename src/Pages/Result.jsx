import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Image as ImageIcon,
  QrCode,
  Share2,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

function Result() {
  const galleryId = localStorage.getItem("galleryId");

  const uploadedPhotos = JSON.parse(
    localStorage.getItem("uploadedPhotos") || "[]"
  );

  // const galleryUrl = `${window.location.origin}/photo/${galleryId}`;
  const galleryUrl = `https://photo-qr-omega.vercel.app/photo/${galleryId}`;

  const downloadQR = () => {
    const canvas = document.getElementById("photoqr-code");

    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `PhotoQR-${galleryId}.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const shareGallery = async () => {
    try {
      await navigator.clipboard.writeText(galleryUrl);
      alert("Gallery link copied!");
    } catch {
      alert("Unable to copy gallery link.");
    }
  };

  if (!galleryId) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <nav className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <Link to="/" className="text-xl font-bold">
              Photo<span className="text-purple-400">QR</span>
            </Link>
          </div>
        </nav>

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              No Gallery Found
            </h1>

            <p className="mt-2 text-slate-400">
              Please upload photos first.
            </p>

            <Link
              to="/upload"
              className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500"
            >
              Upload Photos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-xl font-bold">
            Photo<span className="text-purple-400">QR</span>
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
      <main className="mx-auto max-w-6xl px-6 py-12">

        {/* Back */}
        <Link
          to="/upload"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Upload More Photos
        </Link>

        {/* Heading */}
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-400">
            <QrCode size={32} />
          </div>

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            QR Code Generated Successfully 🎉
          </h1>

          <p className="mt-3 text-slate-400">
            Scan this QR code to open your photo gallery.
          </p>

        </div>

        {/* QR Card */}
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl">

          <div className="mx-auto w-fit rounded-2xl bg-white p-5">
            <QRCodeCanvas
              id="photoqr-code"
              value={galleryUrl}
              size={260}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>

          <h2 className="mt-6 text-xl font-bold">
            Scan to View Photos
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Anyone with this QR code can open the gallery.
          </p>

          {/* Download QR */}
          <button
            onClick={downloadQR}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
          >
            <Download size={18} />
            Download QR Code
          </button>

        </div>

        {/* Gallery URL */}
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <p className="text-center text-sm text-slate-400">
            Gallery URL
          </p>

          <div className="mt-3 break-all text-center text-sm text-purple-400">
            {galleryUrl}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <Link
              to={`/photo/${galleryId}`}
              className="flex flex-1 items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
            >
              Open Gallery
            </Link>

            <button
              onClick={shareGallery}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-semibold transition hover:border-purple-400"
            >
              <Share2 size={18} />
              Copy Link
            </button>

          </div>
        </div>

        {/* Uploaded Photos */}
        {uploadedPhotos.length > 0 && (
          <div className="mt-12">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Uploaded Photos
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {uploadedPhotos.length}{" "}
                  {uploadedPhotos.length === 1
                    ? "photo"
                    : "photos"}{" "}
                  uploaded
                </p>
              </div>

              <ImageIcon className="text-purple-400" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {uploadedPhotos.map((photo, index) => (
                <div
                  key={photo.filename || index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >

                  <div className="aspect-square bg-slate-900">

                    <img
                      src={photo.url}
                      alt={photo.name || `Photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm text-slate-300">
                      {photo.name || `Photo ${index + 1}`}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} PhotoQR. Simple photo sharing with QR.
      </footer>

    </div>
  );
}

export default Result;