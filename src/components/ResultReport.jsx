import headerLogo from "@/assets/core100-header.png";

// A polished, single-page report rendered off-screen and captured to an image
// by Home. Mirrors the calculator's card styling. All styling is inline so it
// serializes identically through html-to-image.

const FONT = "'Montserrat', sans-serif";
const INK = "#111827";
const MUTED = "#6b7280";
const FAINT = "#9ca3af";
const BRAND = "#dc3947";

// Very faint card stroke — present but not noticeable.
const CARD_BORDER = "1px solid #ececec";

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
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
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
        boxShadow: "0 8px 16px -8px rgba(220,57,71,0.6)",
      }}
    >
      <p style={caps({ color: "#fde2e4", marginBottom: 8 })}>{label}</p>
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
        alt="Blocmate CORE100"
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
          <p style={caps({ textAlign: "center", color: "#374151", marginBottom: 18 })}>
            Recommended Purchase Order
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <RedCell label="SKU" value={report.recommended.sku} />
            <RedCell label="Quantity" value={report.recommended.units} />
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              border: CARD_BORDER,
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
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: INK }}>
            {report.secondary.value}
          </div>
          {report.note && (
            <p style={{ fontFamily: FONT, fontSize: 17, color: MUTED, margin: "12px 0 0" }}>
              {report.note}
            </p>
          )}
        </div>
      )}

      {/* All container options (By Area) */}
      {report.options && (
        <div
          style={{
            marginTop: 22,
            border: CARD_BORDER,
            borderRadius: 16,
            padding: "20px 24px",
          }}
        >
          <p style={caps({ textAlign: "center", marginBottom: 12 })}>All Container Options</p>
          {report.options.map((o, idx) => (
            <div
              key={o.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderTop: idx === 0 ? "none" : "1px dashed #eceef1",
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 18,
                  whiteSpace: "nowrap",
                  color: o.recommended ? INK : MUTED,
                  fontWeight: o.recommended ? 700 : 500,
                }}
              >
                {o.label} &times; {o.units}
              </span>
              <span style={{ fontFamily: FONT, fontSize: 18, color: MUTED, whiteSpace: "nowrap" }}>
                Total {o.total} L &middot; Left {o.leftover} L
              </span>
            </div>
          ))}
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
        Coverage rates are approximate and based on smooth, horizontal surfaces. Actual
        coverage varies with the condition and absorbency of the concrete. For estimation
        purposes only.
      </p>
    </div>
  );
}
