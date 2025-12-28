"use client";

import { useSettings } from "@/context/SettingsContext";
import SettingsSelect from "../controls/SettingsSelect";
import SettingsToggle from "../controls/SettingsToggle";
import type { Theme, BackgroundEffect, ClockFormat } from "@/types/settings";

const THEME_OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const BACKGROUND_OPTIONS: Array<{ value: BackgroundEffect; label: string }> = [
  { value: "blob", label: "Blob Animation" },
  { value: "wave", label: "Wave" },
  { value: "blob-scatter", label: "Blob Scatter" },
  { value: "layered-peaks", label: "Layered Peaks" },
  { value: "layered-steps", label: "Layered Steps" },
  { value: "world-map", label: "World Map" },
  { value: "none", label: "None" },
];

const CLOCK_OPTIONS: Array<{ value: ClockFormat; label: string }> = [
  { value: "24h", label: "24-Hour (14:30)" },
  { value: "12h", label: "12-Hour (2:30 PM)" },
];

export default function AppearanceSection() {
  const { settings, updateAppearance } = useSettings();

  return (
    <div className="space-y-8">
      <h3
        className="text-3xl font-bold uppercase tracking-wide mb-6 text-(--text-primary)"
        style={{ fontFamily: "var(--font-oxanium)" }}
      >
        Appearance
      </h3>

      <div className="flex flex-col gap-4">
        {/* Theme */}
        <div className="space-y-3">
          <label
            className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Theme
          </label>
          <SettingsSelect
            options={THEME_OPTIONS}
            value={settings.appearance.theme}
            onChange={(value) => updateAppearance({ theme: value as Theme })}
          />
        </div>

        {/* Background Effect */}
        <div className="space-y-3">
          <label
            className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Background Effect
          </label>
          <SettingsSelect
            options={BACKGROUND_OPTIONS}
            value={settings.appearance.backgroundEffect}
            onChange={(value) =>
              updateAppearance({ backgroundEffect: value as BackgroundEffect })
            }
          />
        </div>

        {/* Clock Format */}
        <div className="space-y-3">
          <label
            className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Clock Format
          </label>
          <SettingsSelect
            options={CLOCK_OPTIONS}
            value={settings.appearance.clockFormat}
            onChange={(value) =>
              updateAppearance({ clockFormat: value as ClockFormat })
            }
          />
        </div>

        {/* Enable Blur */}
        <div className="flex items-center justify-between">
          <div>
            <label
              className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
              style={{ fontFamily: "var(--font-oxanium)" }}
            >
              Blur Effect
            </label>
            <p className="text-xs text-(--text-muted) mt-1">
              Enable backdrop blur (may affect performance on mobile)
            </p>
          </div>
          <SettingsToggle
            checked={settings.appearance.enableBlur}
            onChange={(checked) => updateAppearance({ enableBlur: checked })}
          />
        </div>
      </div>
    </div>
  );
}
