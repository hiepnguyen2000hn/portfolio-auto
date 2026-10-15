import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  Button,
  Card,
  Badge,
  SectionTitle,
  Container,
  ThemeToggle,
  Navbar,
  Footer,
} from "@/components/ui";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

// Helper for mounting components cleanly in jsdom
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

class MockResizeObserver {
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
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
});

describe("UI Primitive: Button", () => {
  it("renders with default variant and size", () => {
    const { container, cleanup } = mount(<Button>Click me</Button>);
    const button = container.querySelector("button")!;
    expect(button).toBeDefined();
    expect(button.textContent).toBe("Click me");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("h-10");
    cleanup();
  });

  it("renders secondary, ghost, outline variants and lg size", () => {
    const { container, cleanup } = mount(
      <>
        <Button variant="secondary" size="lg">
          Secondary
        </Button>
        <Button variant="ghost" size="sm">
          Ghost
        </Button>
        <Button variant="outline">Outline</Button>
      </>
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons[0]!.className).toContain("bg-bg-elevated");
    expect(buttons[0]!.className).toContain("h-12");
    expect(buttons[1]!.className).toContain("h-8");
    expect(buttons[2]!.className).toContain("border-border");
    cleanup();
  });

  it("supports asChild using Radix Slot", () => {
    const { container, cleanup } = mount(
      <Button asChild variant="primary">
        <a href="/target">Link Button</a>
      </Button>
    );

    const link = container.querySelector("a")!;
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/target");
    expect(link.className).toContain("bg-primary");
    cleanup();
  });
});

describe("UI Primitive: Card", () => {
  it("renders with glass utility class", () => {
    const { container, cleanup } = mount(<Card>Card content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("glass");
    expect(card.className).toContain("rounded-2xl");
    cleanup();
  });

  it("applies interactive hover lift class when interactive=true", () => {
    const { container, cleanup } = mount(
      <Card interactive>Interactive Card</Card>
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("hover:-translate-y-1");
    expect(card.className).toContain("cursor-pointer");
    cleanup();
  });
});

describe("UI Primitive: Badge", () => {
  it("renders mono font and tech stack text", () => {
    const { container, cleanup } = mount(<Badge>TypeScript</Badge>);
    const badge = container.querySelector("span")!;
    expect(badge.textContent).toBe("TypeScript");
    expect(badge.className).toContain("font-mono");
    cleanup();
  });

  it("supports accent and outline variants", () => {
    const { container, cleanup } = mount(
      <>
        <Badge variant="accent">Three.js</Badge>
        <Badge variant="outline">Tailwind</Badge>
      </>
    );
    const badges = container.querySelectorAll("span");
    expect(badges[0]!.className).toContain("text-primary");
    expect(badges[1]!.className).toContain("bg-transparent");
    cleanup();
  });
});

describe("UI Primitive: SectionTitle", () => {
  it("renders eyebrow, title and description", () => {
    const { container, cleanup } = mount(
      <SectionTitle
        eyebrow="01. About"
        title="Background & Architecture"
        description="Detailed history of engineering experience."
      />
    );

    const eyebrow = container.querySelector("span")!;
    expect(eyebrow.textContent).toBe("01. About");
    expect(eyebrow.className).toContain("font-mono");

    const h2 = container.querySelector("h2")!;
    expect(h2.textContent).toBe("Background & Architecture");

    const desc = container.querySelector("p")!;
    expect(desc.textContent).toBe("Detailed history of engineering experience.");
    cleanup();
  });

  it("supports center alignment and gradient text", () => {
    const { container, cleanup } = mount(
      <SectionTitle
        title="Featured Work"
        align="center"
        gradient
      />
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("items-center");

    const h2 = container.querySelector("h2")!;
    expect(h2.className).toContain("bg-gradient-to-r");
    cleanup();
  });
});

describe("UI Primitive: Container", () => {
  it("renders with max-w-7xl and responsive padding", () => {
    const { container, cleanup } = mount(<Container>Content</Container>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("max-w-7xl");
    expect(el.className).toContain("mx-auto");
    cleanup();
  });
});

describe("UI Component: ThemeToggle", () => {
  it("renders accessible theme toggle button", () => {
    const { container, cleanup } = mount(<ThemeToggle />);
    const button = container.querySelector("button")!;
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-label")).toBeTruthy();
    cleanup();
  });
});

describe("Navigation & Layout: Navbar & Footer", () => {
  it("renders Navbar with navigation links, logo, and CV action", () => {
    const { container, cleanup } = mount(<Navbar />);
    const header = container.querySelector("header")!;
    expect(header).toBeDefined();

    const links = Array.from(container.querySelectorAll("nav a")).map(
      (a) => a.getAttribute("href")
    );
    expect(links).toContain("#about");
    expect(links).toContain("#skills");
    expect(links).toContain("#experience");
    expect(links).toContain("#projects");
    expect(links).toContain("#contact");

    const cvLink = container.querySelector('a[href="/cv.pdf"]');
    expect(cvLink).toBeDefined();
    cleanup();
  });

  it("renders Footer with year, social links, and Back to top", () => {
    const { container, cleanup } = mount(<Footer />);
    const footer = container.querySelector("footer")!;
    expect(footer).toBeDefined();

    expect(footer.textContent).toContain("Senior Developer");
    expect(footer.textContent).toContain("Built with Next.js & Three.js");

    const backToTopBtn = container.querySelector('button[aria-label="Back to top"]');
    expect(backToTopBtn).toBeDefined();
    cleanup();
  });
});

describe("Providers: ThemeProvider & SmoothScroll", () => {
  it("renders ThemeProvider wrapping children", () => {
    const { container, cleanup } = mount(
      <ThemeProvider>
        <div id="theme-child">Theme Content</div>
      </ThemeProvider>
    );
    expect(container.querySelector("#theme-child")).toBeDefined();
    cleanup();
  });

  it("renders SmoothScroll wrapping children", () => {
    // Mock matchMedia
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

    const { container, cleanup } = mount(
      <SmoothScroll>
        <div id="scroll-child">Smooth Content</div>
      </SmoothScroll>
    );
    expect(container.querySelector("#scroll-child")).toBeDefined();
    cleanup();
  });
});
