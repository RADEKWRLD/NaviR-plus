"use client";

import { useSettings } from "@/context/SettingsContext";
import SettingsSelect from "../controls/SettingsSelect";
import SettingsToggle from "../controls/SettingsToggle";
import CustomBackgroundUploader from "../CustomBackgroundUploader";
import type { Theme, BackgroundEffect, ClockFormat, ColorScheme, UIVariant, UIFont } from "@/types/settings";

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
  { value: "custom", label: "Custom Image" },
  { value: "none", label: "None" },
];

const CLOCK_OPTIONS: Array<{ value: ClockFormat; label: string }> = [
  { value: "24h", label: "24-Hour (14:30)" },
  { value: "12h", label: "12-Hour (2:30 PM)" },
];

const UI_VARIANT_OPTIONS: Array<{ value: UIVariant; label: string }> = [
  { value: "solid", label: "Solid (Default)" },
  { value: "glass", label: "Glass" },
  { value: "outline", label: "Outline" },
  { value: "minimal", label: "Minimal" },
];

const UI_FONT_OPTIONS: Array<{ value: UIFont; label: string; cssVar: string }> = [
  { value: "oxanium",        label: "Oxanium",         cssVar: "var(--font-oxanium), Arial, sans-serif" },
  { value: "inter",          label: "Inter",           cssVar: "var(--font-inter), Helvetica, sans-serif" },
  { value: "lora",           label: "Lora",            cssVar: "var(--font-lora), Georgia, serif" },
  { value: "jetbrains-mono", label: "JetBrains Mono",  cssVar: "var(--font-jetbrains-mono), 'Courier New', monospace" },
  { value: "space-grotesk",  label: "Space Grotesk",   cssVar: "var(--font-space-grotesk), Helvetica, sans-serif" },
  { value: "bebas-neue",     label: "Bebas Neue",      cssVar: "var(--font-bebas-neue), Impact, sans-serif" },
  { value: "playfair",       label: "Playfair",        cssVar: "var(--font-playfair), Georgia, serif" },
  { value: "orbitron",       label: "Orbitron",        cssVar: "var(--font-orbitron), 'Trebuchet MS', sans-serif" },
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
          {settings.appearance.backgroundEffect === "custom" && (
            <CustomBackgroundUploader />
          )}
        </div>

        {/* UI Style (applies to clock + search box) */}
        <div className="space-y-3">
          <label
            className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            UI Style
          </label>
          <p className="text-xs text-(--text-muted) -mt-1">
            Visual treatment for the clock and search box
          </p>
          <SettingsSelect
            options={UI_VARIANT_OPTIONS}
            value={settings.appearance.uiVariant}
            onChange={(value) =>
              updateAppearance({ uiVariant: value as UIVariant })
            }
          />
        </div>

        {/* UI Font */}
        <div className="space-y-3">
          <label
            className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            UI Font
          </label>
          <p className="text-xs text-(--text-muted) -mt-1">
            Font for the clock and search box
          </p>
          <div className="grid grid-cols-2 gap-2">
            {UI_FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => updateAppearance({ uiFont: font.value })}
                className={`p-4 border-2 transition-all text-left cursor-pointer ${
                  settings.appearance.uiFont === font.value
                    ? "border-(--border-default) ring-2 ring-(--border-default) ring-offset-2 ring-offset-(--bg-main)"
                    : "border-(--text-muted) hover:border-(--border-default)"
                }`}
                style={{ fontFamily: font.cssVar }}
              >
                <div className="text-2xl font-bold tabular-nums leading-none">11:44</div>
                <div
                  className="text-xs uppercase tracking-wide mt-2 text-(--text-muted)"
                  style={{ fontFamily: "var(--font-oxanium)" }}
                >
                  {font.label}
                </div>
              </button>
            ))}
          </div>
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

        {/* Show Grid */}
        <div className="flex items-center justify-between">
          <div>
            <label
              className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
              style={{ fontFamily: "var(--font-oxanium)" }}
            >
              Grid Lines
            </label>
            <p className="text-xs text-(--text-muted) mt-1">
              Show background grid lines
            </p>
          </div>
          <SettingsToggle
            checked={settings.appearance.showGrid}
            onChange={(checked) => updateAppearance({ showGrid: checked })}
          />
        </div>

        {/* Background Text Animation */}
        <div className="flex items-center justify-between">
          <div>
            <label
              className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
              style={{ fontFamily: "var(--font-oxanium)" }}
            >
              Background Text Animation
            </label>
            <p className="text-xs text-(--text-muted) mt-1">
              Show animated words flashing in the background
            </p>
          </div>
          <SettingsToggle
            checked={settings.appearance.showAnimatedText}
            onChange={(checked) => updateAppearance({ showAnimatedText: checked })}
          />
        </div>

        {/* Hero Badge */}
        <div className="flex items-center justify-between">
          <div>
            <label
              className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
              style={{ fontFamily: "var(--font-oxanium)" }}
            >
              Hero Badge
            </label>
            <p className="text-xs text-(--text-muted) mt-1">
              Show the NAVIR / SEARCH · DISCOVER badge in the top-left corner
            </p>
          </div>
          <SettingsToggle
            checked={settings.appearance.showTypographicHero}
            onChange={(checked) => updateAppearance({ showTypographicHero: checked })}
          />
        </div>

        {/* Quick Access Bar (Recently Used) */}
        <div className="flex items-center justify-between">
          <div>
            <label
              className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
              style={{ fontFamily: "var(--font-oxanium)" }}
            >
              Quick Access Bar
            </label>
            <p className="text-xs text-(--text-muted) mt-1">
              Show pinned bookmarks below the search box
            </p>
          </div>
          <SettingsToggle
            checked={settings.appearance.showRecentLinks}
            onChange={(checked) => updateAppearance({ showRecentLinks: checked })}
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
