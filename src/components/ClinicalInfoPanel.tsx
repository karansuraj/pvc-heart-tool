import type { PVCOrigin } from "../data/pvcOrigins";

interface ClinicalInfoPanelProps {
  origin: PVCOrigin;
}

export function ClinicalInfoPanel({ origin }: ClinicalInfoPanelProps) {
  return (
    <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
      {/* Review status badge */}
      <div style={{ marginBottom: "12px" }}>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "10px",
            background:
              origin.reviewStatus.status === "reviewed" ? "#e6f4ea" : "#fff3e0",
            color:
              origin.reviewStatus.status === "reviewed" ? "#1b7a3d" : "#e65100",
            fontWeight: 600,
          }}
        >
          {origin.reviewStatus.status === "reviewed"
            ? `Reviewed by ${origin.reviewStatus.reviewedBy}`
            : "Draft — Awaiting EP Physician Review"}
        </span>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "16px" }}>
        <h4
          style={{
            margin: "0 0 6px 0",
            fontSize: "13px",
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Description
        </h4>
        <p style={{ margin: 0, color: "#333" }}>{origin.description}</p>
      </div>

      {/* ECG Features */}
      <div style={{ marginBottom: "16px" }}>
        <h4
          style={{
            margin: "0 0 6px 0",
            fontSize: "13px",
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          ECG Characteristics
        </h4>
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "6px",
            padding: "10px 12px",
            border: "1px solid #e9ecef",
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            <strong style={{ color: "#555" }}>Axis:</strong>{" "}
            <span style={{ color: "#333" }}>{origin.ecgFeatures.axis}</span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <strong style={{ color: "#555" }}>V1 Morphology:</strong>{" "}
            <span style={{ color: "#333" }}>{origin.ecgFeatures.morphology}</span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <strong style={{ color: "#555" }}>Transition:</strong>{" "}
            <span style={{ color: "#333" }}>{origin.ecgFeatures.transition}</span>
          </div>
          {origin.ecgFeatures.otherFeatures.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <strong style={{ color: "#555" }}>Key Features:</strong>
              <ul
                style={{
                  margin: "4px 0 0 0",
                  paddingLeft: "18px",
                  color: "#333",
                }}
              >
                {origin.ecgFeatures.otherFeatures.map((f, i) => (
                  <li key={i} style={{ marginBottom: "2px" }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Ablation Approach */}
      <div style={{ marginBottom: "16px" }}>
        <h4
          style={{
            margin: "0 0 6px 0",
            fontSize: "13px",
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Ablation Approach
        </h4>
        <p style={{ margin: 0, color: "#333" }}>{origin.ablationApproach}</p>
      </div>

      {/* Prevalence */}
      <div style={{ marginBottom: "16px" }}>
        <h4
          style={{
            margin: "0 0 6px 0",
            fontSize: "13px",
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Prevalence
        </h4>
        <p style={{ margin: 0, color: "#333" }}>{origin.prevalence}</p>
      </div>

      {/* Differential Locations */}
      {origin.differentialLocations.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <h4
            style={{
              margin: "0 0 6px 0",
              fontSize: "13px",
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Consider in Differential
          </h4>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {origin.differentialLocations.map((locId) => (
              <span
                key={locId}
                style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: "#e8f0fe",
                  color: "#1a56db",
                }}
              >
                {locId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      <div
        style={{
          borderTop: "1px solid #e9ecef",
          paddingTop: "12px",
          marginTop: "8px",
        }}
      >
        <h4
          style={{
            margin: "0 0 6px 0",
            fontSize: "12px",
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Sources
        </h4>
        <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.5" }}>
          {origin.references.map((ref, i) => (
            <div key={ref.id} style={{ marginBottom: "4px" }}>
              {i + 1}. {ref.authors}. "{ref.title}." <em>{ref.journal}</em>,{" "}
              {ref.year}.
              {ref.doi && (
                <a
                  href={`https://doi.org/${ref.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1a56db", marginLeft: "4px" }}
                >
                  DOI
                </a>
              )}
              <span style={{ color: "#999", marginLeft: "4px" }}>
                — {ref.relevance}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
