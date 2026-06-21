import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("handles conditional classes", () => {
    expect(cn("base-class", false && "hidden-class", "visible-class")).toBe("base-class visible-class");
  });

  it("merges conflicting tailwind classes correctly", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});