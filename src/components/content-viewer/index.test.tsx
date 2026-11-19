// @vitest-environment jsdom
import { StrictMode, act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/mermaid-diagram/use-mermaid-render", () => ({
  useMermaidRender: () => ({
    svg: '<svg viewBox="0 0 200 100"><rect width="200" height="100" /></svg>',
    error: null,
    naturalWidth: 200,
  }),
}));

import { MermaidDiagram } from "@/components/mermaid-diagram";
import { ContentViewer } from "./index";

describe("ContentViewer & MermaidDiagram keyboard accessibility (C2b)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (
      globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function renderStandaloneViewer(options?: { strictMode?: boolean }) {
    function Harness() {
      const [open, setOpen] = useState(false);
      const [showTrigger, setShowTrigger] = useState(true);

      return (
        <div>
          {showTrigger && (
            <button
              type="button"
              data-testid="open-trigger"
              onClick={(e) => {
                e.currentTarget.focus();
                setOpen(true);
              }}
            >
              Open Viewer
            </button>
          )}
          <button
            type="button"
            data-testid="remove-trigger"
            onClick={() => setShowTrigger(false)}
          >
            Remove Trigger
          </button>
          <ContentViewer open={open} onOpenChange={setOpen} title="Test Diagram">
            <div>Diagram Content</div>
          </ContentViewer>
        </div>
      );
    }

    act(() => {
      root.render(
        options?.strictMode ? (
          <StrictMode>
            <Harness />
          </StrictMode>
        ) : (
          <Harness />
        ),
      );
    });
  }

  it("moves initial focus to the Close button and wraps Tab / Shift+Tab across enabled toolbar buttons while skipping disabled Zoom out", () => {
    renderStandaloneViewer();

    const openTrigger = container.querySelector<HTMLButtonElement>(
      '[data-testid="open-trigger"]',
    )!;
    act(() => {
      openTrigger.click();
    });

    const zoomOutBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Zoom out"]',
    )!;
    const zoomInBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Zoom in"]',
    )!;
    const closeBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close fullscreen viewer"]',
    )!;

    // 1. Initial focus moves to Close button (not disabled Zoom out)
    expect(zoomOutBtn.disabled).toBe(true);
    expect(document.activeElement).toBe(closeBtn);

    // 2. Tab on last enabled button wraps to first enabled button (Zoom in, skipping disabled Zoom out)
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(tabEvent);
    });
    expect(tabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(zoomInBtn);

    // 3. Shift+Tab on first enabled button wraps back to Close button
    const shiftTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(shiftTabEvent);
    });
    expect(shiftTabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(closeBtn);

    // 4. If focus lands outside toolbar (e.g. body), Tab brings focus back to first enabled button
    closeBtn.blur();
    expect(document.activeElement).toBe(document.body);
    const rescueTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(rescueTabEvent);
    });
    expect(rescueTabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(zoomInBtn);
  });

  it("restores focus to trigger on Close button click, backdrop click, and Escape", () => {
    renderStandaloneViewer();
    const openTrigger = container.querySelector<HTMLButtonElement>(
      '[data-testid="open-trigger"]',
    )!;

    // Close via Close button
    act(() => {
      openTrigger.click();
    });
    const closeBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close fullscreen viewer"]',
    )!;
    act(() => {
      closeBtn.click();
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(openTrigger);

    // Close via backdrop click
    act(() => {
      openTrigger.click();
    });
    const backdrop = container.querySelector<HTMLDivElement>('[role="dialog"]')!;
    act(() => {
      backdrop.click();
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(openTrigger);

    // Close via Escape
    act(() => {
      openTrigger.click();
    });
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(openTrigger);
  });

  it("closes safely without throwing if the original trigger is removed from the DOM", () => {
    renderStandaloneViewer();

    const openTrigger = container.querySelector<HTMLButtonElement>(
      '[data-testid="open-trigger"]',
    )!;
    const removeTriggerBtn = container.querySelector<HTMLButtonElement>(
      '[data-testid="remove-trigger"]',
    )!;

    act(() => {
      openTrigger.click();
    });
    act(() => {
      removeTriggerBtn.click();
    });

    expect(openTrigger.isConnected).toBe(false);

    expect(() => {
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
      });
    }).not.toThrow();

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("does not trigger unwanted focus restoration back to the trigger during React StrictMode effect setup and cleanup", () => {
    renderStandaloneViewer({ strictMode: true });

    const openTrigger = container.querySelector<HTMLButtonElement>(
      '[data-testid="open-trigger"]',
    )!;
    const focusSpy = vi.spyOn(openTrigger, "focus");

    act(() => {
      openTrigger.click();
    });

    // Only called once by the click handler itself — NOT restored by StrictMode cleanup
    expect(focusSpy).toHaveBeenCalledTimes(1);

    const closeBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close fullscreen viewer"]',
    )!;
    expect(document.activeElement).toBe(closeBtn);

    // Now closing restores focus to openTrigger (2nd call)
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(focusSpy).toHaveBeenCalledTimes(2);
    expect(document.activeElement).toBe(openTrigger);
  });

  it("restores focus to the Inspect button or diagram canvas in MermaidDiagram depending on which trigger opened the viewer", () => {
    act(() => {
      root.render(
        <MermaidDiagram code="graph TD; A-->B;" caption="System Flow" />,
      );
    });

    const inspectBtn = Array.from(
      container.querySelectorAll<HTMLButtonElement>("button"),
    ).find((btn) => btn.textContent?.includes("Inspect"))!;
    const canvasTrigger = container.querySelector<HTMLDivElement>(
      'div[role="button"]',
    )!;

    // 1. Open via Inspect button click -> Escape restores focus to Inspect button
    act(() => {
      inspectBtn.click();
    });
    expect(
      container.querySelector('button[aria-label="Close fullscreen viewer"]'),
    ).toBe(document.activeElement);

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(document.activeElement).toBe(inspectBtn);

    // 2. Open via diagram canvas click -> Close button click restores focus to canvas
    act(() => {
      canvasTrigger.click();
    });
    const closeBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close fullscreen viewer"]',
    )!;
    expect(document.activeElement).toBe(closeBtn);

    act(() => {
      closeBtn.click();
    });
    expect(document.activeElement).toBe(canvasTrigger);

    // 3. Open via keyboard Enter on diagram canvas -> Escape restores focus to canvas
    canvasTrigger.focus();
    act(() => {
      canvasTrigger.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });
    expect(
      container.querySelector('button[aria-label="Close fullscreen viewer"]'),
    ).toBe(document.activeElement);

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(document.activeElement).toBe(canvasTrigger);
  });
});
