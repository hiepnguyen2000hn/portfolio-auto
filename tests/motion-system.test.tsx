import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TextReveal } from "@/components/motion/TextReveal";
import { Counter } from "@/components/motion/Counter";
import { ScrollRail } from "@/components/motion/ScrollRail";
import { globalScrollProgress, useScrollProgress, registerLenis } from "@/lib/hooks/useScrollProgress";
import { dur, ease, stagger } from "@/lib/motion";

function mount(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(ui);
  });

  return {
    container,
    cleanup() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe("Motion System Tokens", () => {
  it("exports valid duration, ease, and stagger tokens", () => {
    expect(dur.fast).toBe(0.2);
    expect(dur.normal).toBe(0.4);
    expect(dur.counter).toBe(1.6);
    expect(stagger.fast).toBe(0.03);
    expect(ease.out).toBeDefined();
    expect(ease.spring).toBeDefined();
  });
});

describe("Reveal Component", () => {
  it("renders with default fadeUp variant and data-reveal attribute", () => {
    const html = renderToStaticMarkup(
      <Reveal>
        <span>Reveal content</span>
      </Reveal>
    );
    expect(html).toContain("Reveal content");
    expect(html).toContain("data-reveal");
  });

  it("supports blurIn and clipUp variants", () => {
    const htmlBlur = renderToStaticMarkup(
      <Reveal variant="blurIn">
        <span>Blur content</span>
      </Reveal>
    );
    expect(htmlBlur).toContain("Blur content");

    const htmlClip = renderToStaticMarkup(
      <Reveal variant="clipUp">
        <span>Clip content</span>
      </Reveal>
    );
    expect(htmlClip).toContain("Clip content");
  });
});

describe("Stagger Component", () => {
  it("renders container with data-stagger and children", () => {
    const html = renderToStaticMarkup(
      <Stagger>
        <StaggerItem>Item 1</StaggerItem>
        <StaggerItem>Item 2</StaggerItem>
      </Stagger>
    );
    expect(html).toContain("data-stagger");
    expect(html).toContain("Item 1");
    expect(html).toContain("Item 2");
  });
});

describe("TextReveal Component", () => {
  it("splits text into words with accessible sr-only text and aria-hidden spans", () => {
    const text = "Building Scalable Architecture";
    const html = renderToStaticMarkup(<TextReveal text={text} as="h2" />);

    expect(html).toContain('aria-label="Building Scalable Architecture"');
    expect(html).toContain('<span class="sr-only">Building Scalable Architecture</span>');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("Building");
    expect(html).toContain("Architecture");
  });

  it("supports character split mode", () => {
    const html = renderToStaticMarkup(<TextReveal text="Arctic" by="chars" />);
    expect(html).toContain('aria-label="Arctic"');
    expect(html).toContain("A");
    expect(html).toContain("c");
  });
});

describe("Counter Component", () => {
  it("renders formatted number with tabular-nums", () => {
    const html = renderToStaticMarkup(<Counter value="99.99%" />);
    expect(html).toContain("tabular-nums");
    expect(html).toContain("99.99%");
  });

  it("renders plus suffix for integer counts", () => {
    const html = renderToStaticMarkup(<Counter value="24+" />);
    expect(html).toContain("24+");
  });
});

describe("ScrollRail & useScrollProgress", () => {
  it("manages global scroll progress MotionValue and Lenis registration", () => {
    expect(globalScrollProgress.get()).toBe(0);

    const mockLenis = {
      on: vi.fn((event, handler) => {
        handler({ progress: 0.65 });
      }),
      off: vi.fn(),
    };

    registerLenis(mockLenis as any);
    expect(mockLenis.on).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(globalScrollProgress.get()).toBe(0.65);

    registerLenis(null);
  });

  it("renders ScrollRail navigation ticks with accessible label", () => {
    const html = renderToStaticMarkup(<ScrollRail />);
    expect(html).toContain('aria-label="Page scroll progress and section quick-nav"');
    expect(html).toContain("Overview");
    expect(html).toContain("Projects");
    expect(html).toContain("Contact");
  });
});
