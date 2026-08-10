import { Link } from "react-router-dom";

import {
  Upload,
  QrCode,
  Image,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
              <QrCode size={23} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Photo<span className="text-purple-400">QR</span>
            </span>
          </Link>

          <Link
            to="/upload"
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
          >
            Upload Photos
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute left-1/2 top-10 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                <QrCode size={16} />
                Share photos with one simple QR
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Turn Your Photos Into
                <span className="block text-purple-400">
                  One Shareable QR Code
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Upload your photos, create a QR code, and share it with
                anyone. No complicated setup. Just scan and view.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/upload"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold shadow-lg shadow-purple-600/20 transition hover:-translate-y-0.5 hover:bg-purple-500 sm:w-auto"
                >
                  <Upload size={19} />
                  Upload Photos
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full rounded-xl border border-white/10 px-7 py-3.5 text-center font-semibold text-slate-300 transition hover:border-purple-400/40 hover:text-white sm:w-auto"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Preview Card */}
            <div className="mx-auto mt-16 max-w-4xl">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-purple-950/30">
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-10">
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    {/* Photo Preview */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/20">
                        <Image size={40} className="text-purple-300" />
                      </div>

                      <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                        <Image size={40} className="text-pink-300" />
                      </div>

                      <div className="col-span-2 flex h-20 items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-500">
                        Your uploaded photos appear here
                      </div>
                    </div>

                    {/* QR Preview */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-4 shadow-xl">
                        <QrCode size={125} className="text-slate-950" />
                      </div>

                      <p className="mt-4 text-sm text-slate-400">
                        Scan to view your photos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="how-it-works"
          className="border-t border-white/10 bg-slate-900/40 py-20"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
                Simple & Fast
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Share photos in 3 easy steps
              </h2>

              <p className="mt-4 text-slate-400">
                No complicated process. Upload, generate and share.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FeatureCard
                number="01"
                icon={<Upload size={24} />}
                title="Upload Photos"
                description="Select the photos you want to share from your device."
              />

              <FeatureCard
                number="02"
                icon={<QrCode size={24} />}
                title="Generate QR"
                description="Create a unique QR code for your uploaded photo collection."
              />

              <FeatureCard
                number="03"
                icon={<Smartphone size={24} />}
                title="Scan & Share"
                description="Share the QR code and let others scan it to view the photos."
              />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <Benefit
                icon={<Zap size={22} />}
                title="Fast"
                text="Create and share your photo QR quickly."
              />

              <Benefit
                icon={<ShieldCheck size={22} />}
                title="Simple"
                text="Clean and easy-to-use photo sharing experience."
              />

              <Benefit
                icon={<Smartphone size={22} />}
                title="Mobile Friendly"
                text="Works beautifully on phones, tablets and desktops."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-purple-400/20 bg-purple-600/10 px-6 py-14 text-center">
            <QrCode className="mx-auto text-purple-400" size={42} />

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Ready to share your photos?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Upload your photos and create your first Photo QR code.
            </p>

            <Link
              to="/upload"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold transition hover:bg-purple-500"
            >
              <Upload size={19} />
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} PhotoQR. All rights reserved.
          </p>

          <p>Simple photo sharing with QR.</p>
        </div>
      </footer>
    </div>
  );
}

/* Feature Card */
function FeatureCard({ number, icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/15 text-purple-400">
          {icon}
        </div>

        <span className="text-sm font-bold text-slate-700">{number}</span>
      </div>

      <h3 className="mt-6 text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-6 text-slate-400">{description}</p>
    </div>
  );
}

/* Benefit */
function Benefit({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/15 text-purple-400">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default Home;