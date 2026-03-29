import { Component, For, Show } from "solid-js";
import type { OfficialWarning } from "@lpna/shared";
import { OFFICIAL_WARNING_MESSAGES } from "@lpna/shared";

interface OfficialNoticeProps {
  notices: OfficialWarning[];
  class?: string;
}

const OfficialNotice: Component<OfficialNoticeProps> = (props) => {
  return (
    <Show when={props.notices.length > 0}>
      <div
        class={`official-notice-container ${props.class ?? ""}`}
        style={{
          "border": "2px solid #4a5568",
          "background": "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
          "padding": "1.25rem 1.5rem",
          "border-radius": "4px",
          "font-family": "'Courier New', Courier, monospace",
        }}
      >
        <div
          style={{
            "display": "flex",
            "align-items": "center",
            "gap": "0.5rem",
            "margin-bottom": "0.75rem",
          }}
        >
          <span style={{ "color": "#f6ad55", "font-size": "1.1rem" }}>⚠</span>
          <span
            style={{
              "color": "#e2e8f0",
              "font-size": "0.75rem",
              "letter-spacing": "0.15em",
              "text-transform": "uppercase",
              "font-weight": "600",
            }}
          >
            系統官方告示 · OFFICIAL SYSTEM NOTICES
          </span>
        </div>
        <For each={props.notices}>
          {(notice) => (
            <div
              style={{
                "border-left": "3px solid #f6ad55",
                "padding": "0.5rem 0.75rem",
                "margin-bottom": "0.5rem",
                "color": "#cbd5e0",
                "font-size": "0.85rem",
                "line-height": "1.6",
              }}
            >
              {OFFICIAL_WARNING_MESSAGES[notice]}
            </div>
          )}
        </For>
      </div>
    </Show>
  );
};

export default OfficialNotice;
