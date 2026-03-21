import { pvcOrigins, getCategories } from "../data/pvcOrigins";

interface RegionListProps {
  selectedId: string | null;
  hoveredId?: string | null;
  onSelectRegion: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export function RegionList({ selectedId, hoveredId, onSelectRegion, onOpenDetail }: RegionListProps) {
  const categories = getCategories();

  return (
    <div style={{ fontSize: "12px" }}>
      {categories.map((cat) => {
        const origins = pvcOrigins.filter((o) => o.category === cat);
        return (
          <div key={cat} style={{ marginBottom: "10px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "4px",
                paddingLeft: "4px",
              }}
            >
              {cat}
            </div>
            {origins.map((origin) => {
              const isSelected = selectedId === origin.id;
              const isHovered = hoveredId === origin.id;
              return (
                <div
                  key={origin.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "1px 0",
                    borderRadius: "4px",
                    background: isSelected
                      ? `${origin.hotspotColor}18`
                      : isHovered
                      ? `${origin.hotspotColor}12`
                      : "transparent",
                    transition: "all 0.15s ease",
                    outline: isHovered && !isSelected ? `1px solid ${origin.hotspotColor}40` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !isHovered) e.currentTarget.style.background = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isHovered) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Main clickable area — selects + highlights on heart */}
                  <button
                    onClick={() => onSelectRegion(origin.id)}
                    onDoubleClick={() => onOpenDetail(origin.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flex: 1,
                      padding: "6px 8px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "12px",
                      fontFamily: "system-ui, sans-serif",
                      color: isSelected ? "#111" : "#555",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: origin.hotspotColor,
                        flexShrink: 0,
                        boxShadow: isSelected ? `0 0 6px ${origin.hotspotColor}` : "none",
                      }}
                    />
                    {origin.name}
                  </button>

                  {/* Detail arrow — opens detail view */}
                  <button
                    onClick={() => onOpenDetail(origin.id)}
                    title="View details"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: isSelected ? "#555" : "#aaa",
                      fontSize: "16px",
                      flexShrink: 0,
                      borderRadius: "4px",
                      marginRight: "4px",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#4488ff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = isSelected ? "#555" : "#aaa"; }}
                  >
                    &#8250;
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
