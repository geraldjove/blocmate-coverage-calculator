import { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Flame } from "lucide-react";

// ── Constants (SHINE100) ──
const COVERAGE_RATE = 4; // m² per liter
const GALLONS_PER_LITER = 3.78541;
const SKUS = [
  { label: "1L", liters: 1 },
  { label: "4L", liters: 4 },
  { label: "20L", liters: 20 },
];

export default function ByVolumeTab({ onReport }) {
  const [selectedSku, setSelectedSku] = useState(0); // index into SKUS
  const [units, setUnits] = useState(1);

  const calc = useMemo(() => {
    const sku = SKUS[selectedSku];
    const unitsValue = parseInt(units) || 1;
    const totalLiters = sku.liters * unitsValue;
    const gallonsTotal = totalLiters / GALLONS_PER_LITER;
    const coverageFinal = totalLiters * COVERAGE_RATE;

    return {
      totalLiters,
      gallonsTotal: gallonsTotal.toFixed(2),
      coverageFinal: coverageFinal.toFixed(1),
      skuLabel: sku.label,
    };
  }, [selectedSku, units]);

  // Report current inputs and results up to Home for the saved report.
  useEffect(() => {
    onReport?.({
      mode: "volume",
      inputs: [
        { label: "Container Size", value: calc.skuLabel },
        { label: "Containers", value: parseInt(units) || 1 },
      ],
      primary: {
        label: "Total Volume",
        value: `${calc.totalLiters} L`,
        sub: `${calc.gallonsTotal} gal`,
      },
      secondary: {
        label: "Approx Coverage",
        value: `${calc.coverageFinal} m²`,
      },
      note: `Based on ${COVERAGE_RATE} m² per liter coverage rate.`,
    });
  }, [selectedSku, units, calc, onReport]);

  return (
    <div className="space-y-5">
      {/* ── SKU Selector ── */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3 block text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
          Container Size
        </label>
        <div className="flex gap-2">
          {SKUS.map((sku, i) => (
            <button
              key={sku.label}
              onClick={() => setSelectedSku(i)}
              className={`flex-1 h-14 rounded-xl text-base font-semibold transition-all ${
                selectedSku === i
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-neutral-100 text-gray-500 hover:bg-neutral-200"
              }`}
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}
            >
              {sku.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Units Input ── */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3 block text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
          Number of Containers
        </label>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setUnits((prev) => Math.max(1, (parseInt(prev) || 1) - 1))}
            className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Minus className="h-5 w-5 text-gray-500" />
          </button>
          <input
            type="number"
            min={1}
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            onBlur={(e) => {
              if (e.target.value === '' || parseInt(e.target.value) < 1) {
                setUnits(1);
              }
            }}
            className="text-6xl font-light text-center w-44 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => setUnits((prev) => Math.max(1, (parseInt(prev) || 0) + 1))}
            className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 border border-gray-200 p-6 shadow-xl">
        <div className="relative">
          <div className="flex items-center gap-2 mb-5 justify-center">
            <Flame className="h-5 w-5 text-gray-600" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
              Results
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl p-4 text-center shadow-lg" style={{ backgroundColor: '#4b9ca0' }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan-100 mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
                Total Volume
              </p>
              <div className="text-3xl font-bold text-white mb-1">
                {calc.totalLiters} L
              </div>
              <div className="text-sm text-cyan-100">
                ({calc.gallonsTotal} gal)
              </div>
            </div>

            <div className="rounded-xl p-4 text-center shadow-lg" style={{ backgroundColor: '#4b9ca0' }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan-100 mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
                Approx Coverage
              </p>
              <div className="text-2xl font-bold text-white whitespace-nowrap">
                {calc.coverageFinal} m²
              </div>
            </div>
          </div>

          <div className="bg-white/75 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '300' }}>
              Based on {COVERAGE_RATE} m² per liter coverage rate.
            </p>
          </div>
        </div>
      </div>

      {/* ── Coverage Note ── */}
      <p className="text-sm text-gray-900 leading-relaxed px-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '300' }}>
        Coverage rates per coat are approximate and <span style={{ fontWeight: 'bold' }}>based on smooth, horizontal surfaces.</span> These figures are intended for estimation purposes only.
      </p>
    </div>
  );
}
