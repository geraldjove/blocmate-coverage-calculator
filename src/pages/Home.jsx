import { useRef, useState } from "react";
import { Ruler, Droplet, X, Camera } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import ByAreaTab from "@/components/ByAreaTab";
import ByVolumeTab from "@/components/ByVolumeTab";
import headerLogo from "@/assets/core100-header.png";

const TABS = [
  { key: "area", label: "By Area" },
  { key: "volume", label: "By Volume" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("area");
  const [capturing, setCapturing] = useState(false);
  const captureRef = useRef(null);

  const handleScreenshot = async () => {
    if (!captureRef.current || capturing) return;
    try {
      setCapturing(true);
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#f7f7f5",
      });
      const link = document.createElement("a");
      link.download = `core100-coverage-${activeTab}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/futura-condensed-pt');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&display=swap');
      `}</style>

      {/* Everything inside this wrapper is included in the screenshot */}
      <div ref={captureRef} className="bg-[#f7f7f5]">
      {/* Header */}
      <div className="px-5 pt-8 pb-0 max-w-lg mx-auto">
        <img
          src={headerLogo}
          alt="Blocmate CORE100"
          className="w-full mb-6 select-none"
          draggable={false}
          style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
        />
        <h1 
          className="text-neutral-900 text-center"
          style={{ 
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '700',
            letterSpacing: '-0.5pt',
            fontSize: '28pt',
            whiteSpace: 'nowrap',
            marginTop: '5pt',
            marginBottom: '10pt'
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
              style={{ fontSize: '14pt', fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}
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
        {activeTab === "area" ? <ByAreaTab /> : <ByVolumeTab />}
      </div>
      </div>
      {/* end screenshot area */}

      {/* Actions */}
      <div className="px-5 pb-8 max-w-lg mx-auto flex flex-col gap-3">
        <Button
          onClick={handleScreenshot}
          disabled={capturing}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 disabled:opacity-60"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '16px' }}
        >
          <Camera className="h-5 w-5" />
          {capturing ? "Saving…" : "Screenshot"}
        </Button>
        <Button
          onClick={() => window.close()}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '16px' }}
        >
          <X className="h-5 w-5" />
          Close Window
        </Button>
      </div>
    </div>
  );
}