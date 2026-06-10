import headerLogo from "@/assets/core100-header.png";

// A clean, receipt-style single-page report rendered off-screen and captured
// to an image by Home. All styling is inline so it renders identically when
// serialized by html-to-image (no dependency on Tailwind's runtime classes).

const FONT = "'Montserrat', sans-serif";
const INK = "#171717";
const MUTED = "#6b7280";
const FAINT = "#9ca3af";
const BRAND = "#dc3947";

const caps = {
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: FAINT,
  margin: 0,
};

function Divider() {
  return <div style={{ borderTop: "1px dashed #e5e7eb", margin: "16px 0" }} />;
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontFamily: FONT,
        fontSize: 14,
        padding: "5px 0",
      }}
    >
      <span style={{ color: MUTED, fontWeight: 400 }}>{label}</span>
      <span style={{ color: INK, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function RecCard({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: BRAND,
        borderRadius: 12,
        padding: "14px 8px",
        textAlign: "center",
      }}
    >
      <p style={{ ...caps, color: "#fde2e4", marginBottom: 6 }}>{label}</p>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: "#fff" }}>
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
        width: 440,
        boxSizing: "border-box",
        background: "#fff",
        fontFamily: FONT,
        color: INK,
        padding: 28,
      }}
    >
      <img
        src={headerLogo}
        alt="Blocmate CORE100"
        style={{ width: "80%", display: "block", margin: "0 auto 16px" }}
      />
      <h2
        style={{
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "-0.3px",
          margin: 0,
        }}
      >
        Coverage Report
      </h2>
      <p
        style={{
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: 12,
          color: FAINT,
          marginTop: 4,
        }}
      >
        CORE100 Penetrating Concrete Sealer
      </p>

      <Divider />

      <Row label="Calculation" value={report.mode === "area" ? "By Area" : "By Volume"} />
      {report.inputs.map((i) => (
        <Row key={i.label} label={i.label} value={i.value} />
      ))}

      <Divider />

      {/* Primary result */}
      <div style={{ textAlign: "center", padding: "2px 0" }}>
        <p style={{ ...caps, marginBottom: 8 }}>{report.primary.label}</p>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, lineHeight: 1.05 }}>
          {report.primary.value}
        </div>
        {report.primary.sub && (
          <div style={{ fontFamily: FONT, fontSize: 14, color: MUTED, marginTop: 2 }}>
            ({report.primary.sub})
          </div>
        )}
      </div>

      {report.secondary && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <p style={{ ...caps, marginBottom: 6 }}>{report.secondary.label}</p>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30 }}>
            {report.secondary.value}
          </div>
        </div>
      )}

      {report.recommended && (
        <>
          <Divider />
          <p style={{ ...caps, textAlign: "center", marginBottom: 12 }}>
            Recommended Purchase
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <RecCard label="SKU" value={report.recommended.sku} />
            <RecCard label="Quantity" value={report.recommended.units} />
          </div>
          <Row label="Total Product Volume" value={`${report.recommended.total} L`} />
          <Row label="Estimated Excess" value={`${report.recommended.excess} L`} />
        </>
      )}

      {report.options && (
        <>
          <Divider />
          <p style={{ ...caps, textAlign: "center", marginBottom: 8 }}>
            All Container Options
          </p>
          {report.options.map((o) => (
            <div
              key={o.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONT,
                fontSize: 13,
                padding: "5px 0",
                color: o.recommended ? INK : MUTED,
                fontWeight: o.recommended ? 700 : 400,
              }}
            >
              <span>
                {o.label} &times; {o.units}
              </span>
              <span>
                Total {o.total} L &middot; Left {o.leftover} L
              </span>
            </div>
          ))}
        </>
      )}

      {report.note && (
        <p
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: 12,
            color: MUTED,
            textAlign: "center",
            marginTop: 14,
          }}
        >
          {report.note}
        </p>
      )}

      <Divider />

      <p
        style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: 10,
          lineHeight: 1.5,
          color: FAINT,
          margin: 0,
        }}
      >
        Coverage rates are approximate and based on smooth, horizontal surfaces. Actual
        coverage varies with the condition and absorbency of the concrete. For estimation
        purposes only.
      </p>
      {dateText && (
        <p
          style={{
            fontFamily: FONT,
            fontSize: 11,
            color: FAINT,
            textAlign: "center",
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          {dateText}
        </p>
      )}
    </div>
  );
}
