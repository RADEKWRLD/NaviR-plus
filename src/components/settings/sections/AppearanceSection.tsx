"use client";

import { useSettings } from "@/context/SettingsContext";
import SettingsSelect from "../controls/SettingsSelect";
import SettingsToggle from "../controls/SettingsToggle";
import type { Theme, BackgroundEffect, ClockFormat, ColorScheme } from "@/types/settings";

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

const COLOR_SCHEMES: Array<{ value: ColorScheme; label: string; color: string }> = [
  { value: "orange", label: "Warm Orange", color: "#FF6B35" },
  { value: "blue", label: "Ocean Blue", color: "#0084FF" },
  { value: "green", label: "Forest Green", color: "#22C55E" },
  { value: "purple", label: "Grape Purple", color: "#A855F7" },
  { value: "pink", label: "Rose Pink", color: "#EC4899" },
  { value: "red", label: "Cherry Red", color: "#EF4444" },
  { value: "cyan", label: "Turquoise", color: "#06B6D4" },
  { value: "yellow", label: "Sunflower", color: "#EAB308" },
  { value: "indigo", label: "Midnight Indigo", color: "#6366F1" },
  { value: "teal", label: "Mint Teal", color: "#14B8A6" },
  { value: "amber", label: "Golden Amber", color: "#F59E0B" },
  { value: "slate", label: "Cool Slate", color: "#64748B" },
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

        {/* Color Scheme */}
        <div className="space-y-3">
          <label
            className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Color Scheme
          </label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.value}
                onClick={() => updateAppearance({ colorScheme: scheme.value })}
                className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                  settings.appearance.colorScheme === scheme.value
                    ? "border-(--border-default) ring-2 ring-(--border-default) ring-offset-2 ring-offset-(--bg-main)"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: scheme.color }}
                title={scheme.label}
              />
            ))}
          </div>
          <p className="text-xs text-(--text-muted)">
            {COLOR_SCHEMES.find((s) => s.value === settings.appearance.colorScheme)?.label}
          </p>
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
