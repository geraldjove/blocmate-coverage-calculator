import { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Flame } from "lucide-react";

// ── Constants (CORE500) ──
const COVERAGE_RATE = 1.75; // m² per liter
const GALLONS_PER_LITER = 3.78541;
const SKUS = [
  { label: "1L", liters: 1 },
  { label: "4L", liters: 4 },
  { label: "20L", liters: 20 },
];

export default function ByAreaTab({ onReport }) {
  const [area, setArea] = useState(10);

  // ── Core calculations ──
  const calc = useMemo(() => {
    const areaValue = parseInt(area) || 1;
    const litersNeeded = areaValue / COVERAGE_RATE;
    const gallonsNeeded = litersNeeded / GALLONS_PER_LITER;

    // Single-SKU estimates
    const skuEstimates = SKUS.map((sku) => {
      const units = Math.ceil(litersNeeded / sku.liters);
      const totalLiters = units * sku.liters;
      const leftover = totalLiters - litersNeeded;
      return { ...sku, units, totalLiters, leftover };
    });

    // ── Recommendation logic ──
    // Keep only SKUs that meet the litres needed, excluding impractical piles
    // of small tins.
    const viableSkus = skuEstimates.filter((s) => {
      if (s.totalLiters < litersNeeded) return false;
      if (s.liters === 1 && s.units >= 7) return false; // don't recommend 1L at 7L+
      if (s.liters === 4 && s.units >= 8) return false; // don't recommend 4L at 32L+
      return true;
    });

    const sortedViableSkus = [...viableSkus].sort((a, b) => {
      if (a.leftover !== b.leftover) return a.leftover - b.leftover;
      if (a.units !== b.units) return a.units - b.units;
      return b.liters - a.liters;
    });

    const recommended = sortedViableSkus[0] || skuEstimates[0];

    return {
      litersNeeded: litersNeeded.toFixed(1),
      gallonsNeeded: gallonsNeeded.toFixed(2),
      skuEstimates,
      recommended,
    };
  }, [area]);

  // Report current inputs and results up to Home for the saved report.
  useEffect(() => {
    onReport?.({
      mode: "area",
      inputs: [{ label: "Area", value: `${parseInt(area) || 1} m²` }],
      primary: {
        label: "You'll Need Approximately",
        value: `${calc.litersNeeded} L`,
        sub: `${calc.gallonsNeeded} gal`,
      },
      recommended: {
        sku: calc.recommended.label,
        units: calc.recommended.units,
        total: calc.recommended.totalLiters.toFixed(1),
        excess: calc.recommended.leftover.toFixed(1),
      },
      options: calc.skuEstimates.map((s) => ({
        label: s.label,
        units: s.units,
        total: s.totalLiters.toFixed(1),
        leftover: s.leftover.toFixed(1),
        recommended: s.label === calc.recommended.label,
      })),
    });
  }, [area, calc, onReport]);

  const adjustArea = (delta) => {
    // `area` may be a string (typed) or a number — coerce before math so the
    // + button adds instead of string-concatenating ("10" + 1 -> "101").
    setArea((prev) => Math.max(1, (parseInt(prev) || 0) + delta));
  };

  return (
    <div className="space-y-5">
      {/* ── Area Input ── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4 block text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
          Area
        </label>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => adjustArea(-1)}
            className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Minus className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              min={1}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onBlur={(e) => {
                if (e.target.value === '' || parseInt(e.target.value) < 1) {
                  setArea(1);
                }
              }}
              className="text-6xl font-light text-center w-44 bg-transparent outline-none text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-lg text-gray-500 font-medium">m²</span>
          </div>
          <button
            onClick={() => adjustArea(1)}
            className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Volume Needed ── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
          You'll Need Approximately
        </p>
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-gray-900">
            {calc.litersNeeded} L
          </span>
          <span className="text-lg text-gray-500">
            ({calc.gallonsNeeded} gal)
          </span>
        </div>
      </div>

      {/* ── Recommended SKU (Hero Card) ── */}
      {/* No filter/backdrop-filter here: large blurs inside overflow-hidden
          cards rasterize as hard-edged gray boxes on iOS WebKit. */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 border border-gray-200 p-6 shadow-xl">
        <div className="relative">
          <div className="flex items-center gap-2 mb-5 justify-center">
            <Flame className="h-5 w-5 text-gray-600" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
              Recommended
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl p-4 text-center shadow-lg" style={{ backgroundColor: '#4458a4' }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-100 mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
                SKU
              </p>
              <div className="text-3xl font-bold text-white">
                {calc.recommended.label}
              </div>
            </div>

            <div className="rounded-xl p-4 text-center shadow-lg" style={{ backgroundColor: '#4458a4' }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-100 mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
                Quantity
              </p>
              <div className="text-3xl font-bold text-white">
                {calc.recommended.units}
              </div>
            </div>
          </div>

          <div className="bg-white/75 rounded-xl p-4 space-y-2 text-center">
            <p className="text-sm text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '300' }}>
              Total Product Volume:{" "}
              <span className="font-bold text-gray-900">
                {calc.recommended.totalLiters.toFixed(1)} L
              </span>
            </p>
            <p className="text-sm text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '300' }}>
              Estimated Excess Volume:{" "}
              <span className="font-bold text-gray-900">
                {calc.recommended.leftover.toFixed(1)} L
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── All SKU Options ── */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4 text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold' }}>
          All Container Options
        </p>
        <div className="space-y-3">
          {calc.skuEstimates.map((sku) => {
            const isRec = sku.label === calc.recommended.label;
            return (
              <div
                key={sku.label}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  isRec
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md"
                    : "bg-white border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${
                      isRec
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {sku.label}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {sku.units} {sku.units === 1 ? "unit" : "units"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total {sku.totalLiters.toFixed(1)} L
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">Leftover</p>
                  <p className="text-sm font-semibold text-gray-500">
                    {sku.leftover.toFixed(1)} L
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Coverage Note ── */}
      <p className="text-sm text-gray-900 leading-relaxed px-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '300' }}>
        Coverage rates per coat are approximate and <span style={{ fontWeight: 'bold' }}>based on fully cured, untreated, textured concrete surfaces using the wet-on-wet application method.</span> Actual coverage will vary depending on the porosity and absorption of the substrate. These figures are intended for estimation purposes only.
      </p>
    </div>
  );
}
