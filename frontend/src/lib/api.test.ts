import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAnimals, fetchAnimal, adoptAnimal, API_BASE } from "./api";

describe("API functions", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("fetchAnimals calls the correct endpoint", async () => {
    const mockAnimals = [
      { id: "1", name: "Rex", species: "Dog", breed: "Lab", age: 2, description: "Good boy", image_url: "", is_adopted: false },
    ];
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnimals,
    });

    const result = await fetchAnimals();
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/animals/`);
    expect(result).toEqual(mockAnimals);
  });

  it("fetchAnimals throws an error when the request fails", async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(fetchAnimals()).rejects.toThrow("Failed to load animals");
  });

  it("fetchAnimal calls the correct endpoint with id", async () => {
    const mockAnimal = { id: "1", name: "Rex" };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnimal,
    });

    const result = await fetchAnimal("1");
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/animals/1`);
    expect(result).toEqual(mockAnimal);
  });

  it("adoptAnimal sends a PATCH request", async () => {
    const mockAnimal = { id: "1", is_adopted: true };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnimal,
    });

    const result = await adoptAnimal("1");
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/animals/1/adopt`, { method: "PATCH" });
    expect(result).toEqual(mockAnimal);
  });

  // Intentionally wrong assertion — demonstrates CI catching a real mistake
  it("fetchAnimal wrongly expects a different endpoint path", async () => {
    const mockAnimal = { id: "1", name: "Rex" };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnimal,
    });

    await fetchAnimal("1");
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/pets/1`); // wrong path on purpose
  });
});