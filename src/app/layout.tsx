import "./globals.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Orbitron, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import ClientInit from "./ClientInit";
import { withBasePath } from "./lib/basePath";

// Same 3 families/weights the old @import in globals.css pulled from
// Google Fonts, now fetched at build time and self-hosted — no runtime
// request to fonts.googleapis.com/fonts.gstatic.com, no render-blocking
// @import chain, and next/font matches fallback metrics to reduce layout
// shift while the real font loads. Each exposes a CSS variable that
// globals.css maps to --font-title / --font-body / var(--font-fira-code).
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-orbitron",
  display: "swap",
});
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata = {
  title: "AIDogeCTO.com",
  description: "ArbDoge AI Ecosystem Portal & Memorial Board",
  icons: {
    icon: [
      {
        url: withBasePath("/ico/favicon-16x16.png"),
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/favicon-32x32.png"),
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/favicon-96x96.png"),
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/android-icon-192x192.png"),
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: withBasePath("/ico/apple-icon-57x57.png"),
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-60x60.png"),
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-72x72.png"),
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-76x76.png"),
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-114x114.png"),
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-120x120.png"),
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-144x144.png"),
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-152x152.png"),
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: withBasePath("/ico/apple-icon-180x180.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: withBasePath("/ico/manifest.json"),
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": withBasePath("/ico/ms-icon-144x144.png"),
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${plusJakartaSans.variable} ${firaCode.variable}`}
      style={
        {
          "--home-bg-image": `url("${withBasePath("/img/aidoge_background.png")}")`,
        } as React.CSSProperties
      }
    >
      <body>
        <ClientInit />

        {/* Premium High-Tech Loader Overlay */}
        <div
          id="cyber-loader"
          className="cyber-loader"
          suppressHydrationWarning
        >
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (sessionStorage.getItem("cyberLoaderShown") === "true") {
                  document.getElementById("cyber-loader").style.display = "none";
                }
              `,
            }}
          />
          <div className="loader-content font-mono">
            <div className="loader-logo-container">
              <Image
                src={withBasePath("/img/AIDOGE_Logo.png")}
                alt="AIDOGE"
                width={80}
                height={80}
                className="loader-logo-spin"
              />
            </div>
            <div className="loader-status">SYS_RECONSTRUCT_INITIALIZED...</div>
            <div className="loader-progress-bar">
              <div className="loader-progress-fill" id="loader-progress"></div>
            </div>
            <div className="loader-pct font-mono" id="loader-pct">
              00%
            </div>
            <div className="loader-logs" id="loader-logs">
              <div>&gt; INITIALIZING CORE MEMORY INTERFACE...</div>
            </div>
          </div>
          <div className="loader-sweep-line"></div>
        </div>

        <nav className="navbar" id="navbar">
          <div className="navbar-container">
            <Link href="/" className="navbar-logo">
              <Image
                src={withBasePath("/img/AIDOGE_Wordmark_Horizontal.png")}
                alt="AIDOGE Wordmark"
                width={200}
                height={50}
              />
            </Link>
            {/* The "CYBER BEAT" button that used to be here was merged into
                the settings gear (⚙) on the INDEX panel, alongside the
                sound mute button — see initHudSettingsControls() in main.ts */}
            <div className="navbar-links">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/community" className="nav-link">
                Community
              </Link>
            </div>
          </div>
        </nav>

        {children}

        {/* Quantum Target Cursor */}
        <div id="quantum-cursor">
          <div className="cursor-dot"></div>
          <div className="cursor-ring"></div>
        </div>

        {/* HUD Radar Navigation Widget */}
        <div className="hud-radar-widget" id="hud-radar">
          <div className="radar-scanlines"></div>
          <div className="radar-screen">
            <div className="radar-grid-circle"></div>
            <div className="radar-grid-circle inner"></div>
            <div className="radar-grid-line horiz"></div>
            <div className="radar-grid-line vert"></div>
            <div className="radar-sweep"></div>
            <div
              className="radar-ping-dot"
              style={{ top: "25%", left: "35%" }}
            ></div>
            <div
              className="radar-ping-dot"
              style={{ top: "75%", left: "70%" }}
            ></div>
          </div>
          <div className="radar-data font-mono">
            <div className="radar-row">
              <span className="radar-lbl">SYS_LOC:</span>
              <span id="radar-sector-val">SECTOR_HOME</span>
            </div>
            <div className="radar-row">
              <span className="radar-lbl">COORD:</span>
              <span id="radar-coord-val">X:000 Y:000</span>
            </div>
            <div className="radar-row">
              <span className="radar-lbl">DEFLATION:</span>
              <span className="text-pink font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
