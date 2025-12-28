"use client";

import { useSettings } from "@/context/SettingsContext";
import { SEARCH_ENGINES } from "@/lib/constants/searchEngines";
import SettingsSelect from "../controls/SettingsSelect";
import SettingsToggle from "../controls/SettingsToggle";
import type { SearchEngineId } from "@/types/settings";

export default function SearchSection() {
  const { settings, updateSearch } = useSettings();

  const engineOptions = SEARCH_ENGINES.map((engine) => ({
    value: engine.id,
    label: engine.name,
  }));

  return (
    <div className="space-y-8">
      <h3
        className="text-3xl font-bold uppercase tracking-wide mb-6 text-(--text-primary)"
        style={{ fontFamily: "var(--font-oxanium)" }}
      >
        Search
      </h3>
      <div className="flex flex-col gap-4">
        {/* Default Search Engine */}
        <div className="space-y-3">
          <label
            className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Default Search Engine
          </label>
          <SettingsSelect
            options={engineOptions}
            value={settings.search.defaultEngine}
            onChange={(value) =>
              updateSearch({ defaultEngine: value as SearchEngineId })
            }
          />
        </div>

        {/* Open in New Tab */}
        <div className="flex items-center justify-between py-4 border-b-[3px] border-black" style={{paddingBottom:"1rem"}}>
          <div>
            <p
              className="font-bold uppercase tracking-wide text-(--text-primary)"
              style={{ fontFamily: "var(--font-oxanium)" }}
            >
              Open in New Tab
            </p>
            <p className="text-sm text-(--text-muted) mt-1">
              Open search results in a new browser tab
            </p>
          </div>
          <SettingsToggle
            checked={settings.search.openInNewTab}
            onChange={(checked) => updateSearch({ openInNewTab: checked })}
          />
        </div>
      </div>
    </div>
  );
}
