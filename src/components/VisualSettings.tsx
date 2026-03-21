/**
 * Visual settings for the 3D heart model rendering.
 * Controls material properties, lighting, and display options.
 */

export interface VisualSettingsState {
  brightness: number;      // 0.1–3.0 — scales all light intensities
  roughness: number;       // 0–1 — surface roughness (0 = mirror, 1 = matte)
  metalness: number;       // 0–1 — metallic appearance
  envMapIntensity: number; // 0–2 — environment reflection strength
  exposure: number;        // 0.5–3 — tone mapping exposure
  opacity: number;         // 0.1–1 — model transparency (for seeing inside)
  wireframe: boolean;      // show wireframe overlay
  colorTint: string;       // hex color to tint the model
  doubleSided: boolean;    // render both sides of faces
}

export const DEFAULT_VISUAL_SETTINGS: VisualSettingsState = {
  brightness: 1.0,
  roughness: 0.5,
  metalness: 0.0,
  envMapIntensity: 0.3,
  exposure: 1.0,
  opacity: 1.0,
  wireframe: false,
  colorTint: "",  // empty = use original model colors
  doubleSided: true,
};

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}

function SliderRow({ label, value, min, max, step, onChange, suffix = "" }: SliderRowProps) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span style={{ fontSize: "11px", color: "#bbb" }}>{label}</span>
        <span style={{ fontSize: "11px", color: "#888", fontFamily: "monospace" }}>
          {value.toFixed(2)}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: "100%",
          height: "4px",
          accentColor: "#4488ff",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

interface VisualSettingsPanelProps {
  settings: VisualSettingsState;
  onChange: (settings: VisualSettingsState) => void;
  onClose: () => void;
}

export function VisualSettingsPanel({
  settings,
  onChange,
  onClose,
}: VisualSettingsPanelProps) {
  const update = (partial: Partial<VisualSettingsState>) => {
    onChange({ ...settings, ...partial });
  };

  const resetDefaults = () => {
    onChange({ ...DEFAULT_VISUAL_SETTINGS });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "56px",
        top: "12px",
        width: "260px",
        maxHeight: "calc(100% - 24px)",
        overflowY: "auto",
        background: "rgba(20, 20, 35, 0.95)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "10px",
        padding: "14px",
        zIndex: 20,
        color: "#fff",
        fontSize: "12px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontWeight: 600, fontSize: "13px" }}>Display Settings</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: "16px",
            padding: "0 4px",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Lighting section */}
      <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Lighting
      </div>

      <SliderRow label="Brightness" value={settings.brightness} min={0.1} max={3} step={0.05} onChange={(v) => update({ brightness: v })} />
      <SliderRow label="Exposure" value={settings.exposure} min={0.3} max={3} step={0.05} onChange={(v) => update({ exposure: v })} />
      <SliderRow label="Environment Reflections" value={settings.envMapIntensity} min={0} max={2} step={0.05} onChange={(v) => update({ envMapIntensity: v })} />

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "10px 0" }} />

      {/* Material section */}
      <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Material
      </div>

      <SliderRow label="Roughness" value={settings.roughness} min={0} max={1} step={0.02} onChange={(v) => update({ roughness: v })} />
      <SliderRow label="Metalness" value={settings.metalness} min={0} max={1} step={0.02} onChange={(v) => update({ metalness: v })} />
      <SliderRow label="Opacity" value={settings.opacity} min={0.05} max={1} step={0.02} onChange={(v) => update({ opacity: v })} />

      {/* Color tint */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
          <span style={{ fontSize: "11px", color: "#bbb" }}>Color Tint</span>
          {settings.colorTint && (
            <button
              onClick={() => update({ colorTint: "" })}
              style={{ background: "none", border: "none", color: "#4488ff", cursor: "pointer", fontSize: "10px", padding: 0 }}
            >
              Clear
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <input
            type="color"
            value={settings.colorTint || "#ffffff"}
            onChange={(e) => update({ colorTint: e.target.value })}
            style={{
              width: "28px",
              height: "28px",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
            }}
          />
          <span style={{ fontSize: "11px", color: "#888" }}>
            {settings.colorTint || "Original colors"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "10px 0" }} />

      {/* Display section */}
      <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Display
      </div>

      {/* Wireframe toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={settings.wireframe}
          onChange={(e) => update({ wireframe: e.target.checked })}
          style={{ accentColor: "#4488ff" }}
        />
        <span style={{ fontSize: "11px", color: "#bbb" }}>Wireframe</span>
      </label>

      {/* Double-sided toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={settings.doubleSided}
          onChange={(e) => update({ doubleSided: e.target.checked })}
          style={{ accentColor: "#4488ff" }}
        />
        <span style={{ fontSize: "11px", color: "#bbb" }}>Double-sided rendering</span>
      </label>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "10px 0" }} />

      {/* Reset button */}
      <button
        onClick={resetDefaults}
        style={{
          width: "100%",
          padding: "6px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "4px",
          color: "#aaa",
          fontSize: "11px",
          cursor: "pointer",
        }}
      >
        Reset to Defaults
      </button>
    </div>
  );
}
