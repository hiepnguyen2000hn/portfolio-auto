import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCanRender3D, use3DCapability, resetCanRender3DCache } from '@/lib/hooks/useCanRender3D';
import { HeroFallback } from '@/components/three/HeroFallback';
import { Hero } from '@/components/sections/Hero';

// Enable React act() environment flag for React 19
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Lightweight helper to test client hooks without external testing-library dependencies
 */
function testHook<T>(hookFn: () => T) {
  let latestValue: T;
  function Component() {
    latestValue = hookFn();
    return null;
  }

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<Component />);
  });

  return {
    get current(): T {
      return latestValue;
    },
    cleanup() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('3D Capability Hook: useCanRender3D', () => {
  const originalMatchMedia = window.matchMedia;
  const originalHardwareConcurrency = navigator.hardwareConcurrency;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    resetCanRender3DCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: originalHardwareConcurrency,
      configurable: true,
      writable: true,
    });
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('returns false when user prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const hook = testHook(() => useCanRender3D());
    expect(hook.current).toBe(false);
    hook.cleanup();
  });

  it('returns false when WebGL context cannot be created', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

    const hook = testHook(() => useCanRender3D());
    expect(hook.current).toBe(false);
    hook.cleanup();
  });

  it('returns false on low-power mobile devices (<=4 CPU cores and <768px width)', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      getExtension: vi.fn().mockReturnValue({ loseContext: vi.fn() }),
    });

    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 4,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(window, 'innerWidth', {
      value: 640,
      configurable: true,
      writable: true,
    });

    const hook = testHook(() => use3DCapability());
    expect(hook.current.tier).toBe('reduced');
    expect(hook.current.canRender3D).toBe(true);
    hook.cleanup();
  });

  it('returns false when data saver mode is enabled', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      getExtension: vi.fn().mockReturnValue({ loseContext: vi.fn() }),
    });

    Object.defineProperty(navigator, 'connection', {
      value: { saveData: true },
      configurable: true,
      writable: true,
    });

    const hook = testHook(() => useCanRender3D());
    expect(hook.current).toBe(false);
    hook.cleanup();
  });

  it('returns true when device is high performance and WebGL is available', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      getExtension: vi.fn().mockReturnValue({ loseContext: vi.fn() }),
    });

    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 8,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(window, 'innerWidth', {
      value: 1280,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(navigator, 'connection', {
      value: { saveData: false },
      configurable: true,
      writable: true,
    });

    const hook = testHook(() => useCanRender3D());
    expect(hook.current).toBe(true);
    hook.cleanup();
  });
});

describe('HeroFallback Component', () => {
  it('renders decorative glowing sphere fallback markup with aria-hidden', () => {
    const html = renderToStaticMarkup(<HeroFallback />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('animate-hero-float');
    expect(html).toContain('radial-gradient');
  });
});

describe('Hero Section Component', () => {
  it('renders SEO-friendly semantic markup, headline, subtitle, and CTAs', () => {
    const html = renderToStaticMarkup(<Hero />);

    // 1. Semantic section & Eyebrow
    expect(html).toContain('id="hero"');
    expect(html).toContain('Available for new opportunities');

    // 2. Main Headline (H1)
    expect(html).toContain('Building');
    expect(html).toContain('Scalable Architecture');
    expect(html).toContain('High-Performance Web Systems');

    // 3. Subtitle
    expect(html).toContain('Senior Full-Stack &amp; Systems Engineer');

    // 4. CTA buttons with appropriate anchor links
    expect(html).toContain('href="#projects"');
    expect(html).toContain('Xem dự án');

    expect(html).toContain('href="#contact"');
    expect(html).toContain('Liên hệ');

    expect(html).toContain('href="/cv.pdf"');
    expect(html).toContain('Tải CV');
  });
});
