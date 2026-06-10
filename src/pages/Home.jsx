import { useRef, useState } from "react";
import { Ruler, Droplet, X, Download } from "lucide-react";
import { toBlob } from "html-to-image";
import { Button } from "@/components/ui/button";
import ByAreaTab from "@/components/ByAreaTab";
import ByVolumeTab from "@/components/ByVolumeTab";
import ResultReport from "@/components/ResultReport";
import headerLogo from "@/assets/core100-header.png";

// Bundled, same-origin Montserrat woff2 files. We inline these as base64 into
// the captured image so the fonts are guaranteed to render on every device,
// with no dependency on a font CDN or cross-origin fetch at capture time.
import mont300 from "@fontsource/montserrat/files/montserrat-latin-300-normal.woff2";
import mont400 from "@fontsource/montserrat/files/montserrat-latin-400-normal.woff2";
import mont500 from "@fontsource/montserrat/files/montserrat-latin-500-normal.woff2";
import mont600 from "@fontsource/montserrat/files/montserrat-latin-600-normal.woff2";
import mont700 from "@fontsource/montserrat/files/montserrat-latin-700-normal.woff2";

const TABS = [
  { key: "area", label: "By Area" },
  { key: "volume", label: "By Volume" },
];

const pad = (n) => String(n).padStart(2, "0");
const fileStamp = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Build (once) a self-contained @font-face stylesheet with the Montserrat
// weights inlined as base64. Passing this to html-to-image as `fontEmbedCSS`
// removes every network/CORS variable, so the report image always uses the
// real fonts — including on mobile.
const MONT_FACES = [
  [300, mont300],
  [400, mont400],
  [500, mont500],
  [600, mont600],
  [700, mont700],
];
let fontEmbedCSSCache = null;
async function getFontEmbedCSS() {
  if (fontEmbedCSSCache) return fontEmbedCSSCache;
  const faces = await Promise.all(
    MONT_FACES.map(async ([weight, url]) => {
      const buf = await (await fetch(url)).arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      return `@font-face{font-family:'Montserrat';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${base64}) format('woff2');}`;
    }),
  );
  fontEmbedCSSCache = faces.join("");
  return fontEmbedCSSCache;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("area");
  const [report, setReport] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [saving, setSaving] = useState(false);
  const reportRef = useRef(null);

  const saveResult = async () => {
    if (saving || !report) return;
    setSaving(true);
    const stamp = new Date();
    setSavedAt(stamp);

    try {
      // Let the report re-render with the new timestamp, and make sure the web
      // fonts have loaded so they're embedded into the captured image (this is
      // what keeps the fonts correct on mobile).
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          /* non-fatal */
        }
      }

      const node = reportRef.current;
      if (!node) return;

      const fontEmbedCSS = await getFontEmbedCSS();
      const blob = await toBlob(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
        fontEmbedCSS,
      });
      if (!blob) return;

      const fileName = `core100-coverage-${activeTab}-${fileStamp(stamp)}.png`;

      // 1) Desktop browsers with the File System Access API → real "Save As"
      //    dialog that lets the user choose the destination.
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [
              { description: "PNG image", accept: { "image/png": [".png"] } },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        } catch (err) {
          if (err?.name === "AbortError") return; // user cancelled the dialog
          // otherwise fall through to the next method
        }
      }

      // 2) Mobile (Android/iOS) and some desktops → native share/save sheet,
      //    which lets the user save to Files/Photos or share to any app.
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "CORE100 Coverage Report",
          });
          return;
        } catch (err) {
          if (err?.name === "AbortError") return;
          // fall through to download
        }
      }

      // 3) Fallback → standard download to the browser's download location.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Save Result failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Header */}
      <div className="px-5 pt-8 pb-0 max-w-lg mx-auto">
        <img
          src={headerLogo}
          alt="Blocmate CORE100"
          className="w-full mb-6 select-none"
          draggable={false}
          style={{ userSelect: "none", WebkitUserDrag: "none" }}
        />
        <h1
          className="text-neutral-900 text-center"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "700",
            letterSpacing: "-0.5pt",
            fontSize: "28pt",
            whiteSpace: "nowrap",
            marginTop: "5pt",
            marginBottom: "10pt",
          }}
        >
          Coverage Calculator
        </h1>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-0 pb-2 max-w-lg mx-auto">
        <div className="flex bg-white rounded-xl p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
              style={{ fontSize: "14pt", fontFamily: "'Montserrat', sans-serif", fontWeight: "bold" }}
            >
              {tab.key === "area" && <Ruler className="h-5 w-5" />}
              {tab.key === "volume" && <Droplet className="h-5 w-5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-4 max-w-lg mx-auto">
        {activeTab === "area" ? (
          <ByAreaTab onReport={setReport} />
        ) : (
          <ByVolumeTab onReport={setReport} />
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-8 max-w-lg mx-auto flex flex-col gap-3">
        <Button
          onClick={saveResult}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 disabled:opacity-60"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: "bold", fontSize: "16px" }}
        >
          <Download className="h-5 w-5" />
          {saving ? "Preparing…" : "Save Report"}
        </Button>
        <Button
          onClick={() => window.close()}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: "bold", fontSize: "16px" }}
        >
          <X className="h-5 w-5" />
          Close Window
        </Button>
      </div>

      {/* Off-screen receipt-style report captured by "Save Result" */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", left: "-10000px", top: 0, pointerEvents: "none" }}
      >
        <div ref={reportRef}>
          <ResultReport
            report={report}
            dateText={savedAt ? savedAt.toLocaleString() : ""}
          />
        </div>
      </div>
    </div>
  );
}
