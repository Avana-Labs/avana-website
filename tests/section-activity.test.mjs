import { test } from "node:test";
import assert from "node:assert/strict";
import { importSource } from "./helpers/import-source.mjs";

function setup(t, { observer = true, reduced = false } = {}) {
  const effects = [];
  const updates = [];
  const listeners = new Map();
  let intersect;
  let disconnected = false;
  const media = { matches: reduced, addEventListener: (_, fn) => listeners.set("motion", fn), removeEventListener: () => listeners.delete("motion") };
  const doc = { visibilityState: "visible", addEventListener: (_, fn) => listeners.set("visibility", fn), removeEventListener: () => listeners.delete("visibility") };
  class Observer {
    constructor(callback) { intersect = callback; }
    observe() {}
    disconnect() { disconnected = true; }
  }
  const previous = { window: globalThis.window, document: globalThis.document, IntersectionObserver: globalThis.IntersectionObserver };
  globalThis.window = { matchMedia: () => media, ...(observer ? { IntersectionObserver: Observer } : {}) };
  globalThis.document = doc;
  globalThis.IntersectionObserver = observer ? Observer : undefined;
  t.after(() => Object.assign(globalThis, previous));
  const { useSectionActivity: runActivityHook } = importSource("src/components/ui/use-section-activity.ts", {
    react: { useRef: () => ({ current: {} }), useState: initial => [initial, next => updates.push(next)], useEffect: effect => effects.push(effect) },
  });
  return { result: runActivityHook(), effects, updates, listeners, media, doc, intersect: value => intersect([{ isIntersecting: value }]), disconnected: () => disconnected };
}

test("animations remain paused before the first intersection observation", t => {
  const state = setup(t);
  assert.equal(state.result.isActive, false);
  state.effects[0]();
  assert.notEqual(state.updates.at(-1), true);
});

test("animation activity follows intersection, tab visibility and reduced motion", t => {
  const state = setup(t);
  const cleanup = state.effects[0]();
  state.intersect(true);
  assert.equal(state.updates.at(-1), true);
  state.doc.visibilityState = "hidden";
  state.listeners.get("visibility")();
  assert.equal(state.updates.at(-1), false);
  state.doc.visibilityState = "visible";
  state.media.matches = true;
  state.listeners.get("motion")();
  assert.equal(state.updates.at(-1), false);
  state.media.matches = false;
  state.intersect(false);
  assert.equal(state.updates.at(-1), false);
  cleanup();
  assert.equal(state.disconnected(), true);
  assert.equal(state.listeners.size, 0);
});

test("missing IntersectionObserver leaves static content without crashing", t => {
  const state = setup(t, { observer: false });
  assert.doesNotThrow(() => state.effects[0]());
  assert.equal(state.result.isActive, false);
});
