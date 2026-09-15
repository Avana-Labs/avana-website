import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8");
function color(token) {
  const value = css.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1].trim();
  if (value?.startsWith("var(")) return color(value.slice(4, -1));
  assert.match(value ?? "", /^#[\da-f]{6}$/i, `Unresolved color ${token}`);
  return value;
}
function luminance(hex) {
  return [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("accent text meets normal-text contrast on white and tinted surfaces", () => {
  for (const background of ["#ffffff", "#fafafa", "#e6f7fa"]) {
    assert.ok(contrast(color("--color-type-accent"), background) >= 4.5, `Accent text fails on ${background}`);
  }
});

test("the existing unified gray remains readable on white", () => {
  assert.ok(contrast(color("--type-color-secondary"), "#ffffff") >= 4.5);
});
