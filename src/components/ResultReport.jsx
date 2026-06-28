import headerLogo from "@/assets/core500-header.png";

// A polished, single-page report rendered off-screen and captured to an image
// by Home. Mirrors the calculator's card styling. All styling is inline so it
// serializes identically through html-to-image.

const FONT = "'Montserrat', sans-serif";
const INK = "#111827";
const MUTED = "#6b7280";
const FAINT = "#9ca3af";
const BRAND = "#4458a4";

// Deep dark gray stroke around every report box.
const CARD_BORDER = "1px solid #333333";

// "1L" → "1 Liter", "4.5L" → "4.5 Liters"
const skuFullName = (label) => {
  const n = parseFloat(label);
  return `${n} Liter${n === 1 ? "" : "s"}`;
};

// Thousands separators, decimals only when present: "5016.0" → "5,016"
const fmtNum = (v) =>
  Number(v).toLocaleString("en-US", { maximumFractionDigits: 1 });

const caps = (extra = {}) => ({
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: FAINT,
  margin: 0,
  ...extra,
});

function InputRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "4px 0" }}>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 19,
          color: MUTED,
          width: 116,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, color: INK }}>
        {value}
      </span>
    </div>
  );
}

function ResultCard({ label, value, sub }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        border: CARD_BORDER,
        borderRadius: 16,
        padding: "22px 16px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <p style={caps({ marginBottom: 8 })}>{label}</p>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 52, color: INK, lineHeight: 1.05 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: FONT, fontSize: 18, color: MUTED, marginTop: 4 }}>
          ({sub})
        </div>
      )}
    </div>
  );
}

function RedCell({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: BRAND,
        border: "1px solid rgba(0,0,0,0.05)",
        borderRadius: 12,
        padding: "16px 8px",
        textAlign: "center",
      }}
    >
      <p style={caps({ color: "#dbe3f7", marginBottom: 8 })}>{label}</p>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#fff" }}>
        {value}
      </div>
    </div>
  );
}

export default function ResultReport({ report, dateText }) {
  if (!report) return null;

  return (
    <div
      style={{
        width: 800,
        boxSizing: "border-box",
        background: "#fff",
        fontFamily: FONT,
        color: INK,
        padding: 40,
      }}
    >
      <img
        src={headerLogo}
        alt="Blocmate CORE500"
        style={{ width: "100%", display: "block", marginBottom: 28 }}
      />

      {/* Title + date (date on its own line below the title) */}
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, margin: 0 }}>
          Coverage Report
        </h2>
        {dateText && (
          <p style={{ fontFamily: FONT, fontSize: 19, color: "#374151", margin: "8px 0 0" }}>
            {dateText}
          </p>
        )}
      </div>

      {/* Inputs + headline result */}
      <div style={{ display: "flex", gap: 22, alignItems: "stretch", marginBottom: 22 }}>
        <div
          style={{
            flex: "0 0 42%",
            border: CARD_BORDER,
            borderRadius: 16,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <InputRow label="Calculation" value={report.mode === "area" ? "By Area" : "By Volume"} />
          {report.inputs.map((i) => (
            <InputRow key={i.label} label={i.label} value={i.value} />
          ))}
        </div>
        <ResultCard
          label={report.primary.label}
          value={report.primary.value}
          sub={report.primary.sub}
        />
      </div>

      {/* Recommended (By Area) */}
      {report.recommended && (
        <div
          style={{
            background: "linear-gradient(135deg, #f3f4f6, #f9fafb, #f3f4f6)",
            border: CARD_BORDER,
            borderRadius: 16,
            padding: 24,
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 600,
              color: INK,
              textAlign: "center",
              margin: "0 0 18px",
            }}
          >
            Recommended Purchase Order
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <RedCell label="SKU" value={report.recommended.sku} />
            <RedCell label="Quantity" value={report.recommended.units} />
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              borderRadius: 12,
              padding: 18,
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: FONT, fontSize: 17, color: INK, margin: "0 0 6px" }}>
              Total Product Volume:{" "}
              <span style={{ fontWeight: 700 }}>{report.recommended.total} L</span>
            </p>
            <p style={{ fontFamily: FONT, fontSize: 17, color: INK, margin: 0 }}>
              Estimated Excess Volume:{" "}
              <span style={{ fontWeight: 700 }}>{report.recommended.excess} L</span>
            </p>
          </div>
        </div>
      )}

      {/* Secondary result (By Volume) */}
      {report.secondary && (
        <div
          style={{
            background: "linear-gradient(135deg, #f3f4f6, #f9fafb, #f3f4f6)",
            border: CARD_BORDER,
            borderRadius: 16,
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={caps({ marginBottom: 8 })}>{report.secondary.label}</p>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: INK }}>
            {report.secondary.value}
          </div>
          {report.note && (
            <p style={{ fontFamily: FONT, fontSize: 17, color: MUTED, margin: "12px 0 0" }}>
              {report.note}
            </p>
          )}
        </div>
      )}

      {/* All container options (By Area) — three flat cards on a light panel,
          the recommended SKU outlined in brand red. */}
      {report.options && (
        <div
          style={{
            marginTop: 22,
            background: "#f3f4f6",
            borderRadius: 16,
            padding: "22px 20px",
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 600,
              color: INK,
              textAlign: "center",
              margin: "0 0 18px",
            }}
          >
            All container options
          </p>
          <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
            {report.options.map((o) => (
              <div
                key={o.label}
                style={{
                  flex: 1,
                  boxSizing: "border-box",
                  background: "#fff",
                  border: o.recommended ? `3px solid ${BRAND}` : "1px solid #333333",
                  borderRadius: 16,
                  padding: "18px 16px",
                }}
              >
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 21,
                    fontWeight: 700,
                    color: INK,
                    margin: "0 0 16px",
                  }}
                >
                  {skuFullName(o.label)}
                </p>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 17,
                    fontWeight: 700,
                    color: INK,
                    margin: "0 0 4px",
                  }}
                >
                  {fmtNum(o.units)} Unit{Number(o.units) === 1 ? "" : "s"}
                </p>
                <p style={{ fontFamily: FONT, fontSize: 16, color: "#374151", margin: "0 0 2px" }}>
                  Total: {fmtNum(o.total)} L
                </p>
                <p style={{ fontFamily: FONT, fontSize: 16, color: "#374151", margin: 0 }}>
                  Excess: {fmtNum(o.leftover)} L
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p
        style={{
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 14,
          lineHeight: 1.55,
          color: FAINT,
          marginTop: 26,
          marginBottom: 0,
        }}
      >
        Coverage rates per coat are approximate and based on fully cured, untreated,
        textured concrete surfaces using the wet-on-wet application method. Actual coverage
        will vary depending on the porosity and absorption of the substrate. These figures
        are intended for estimation purposes only.
      </p>
    </div>
  );
}
