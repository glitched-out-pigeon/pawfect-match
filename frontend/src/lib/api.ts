export const API_BASE = "https://web-production-567e4.up.railway.app";

export interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  image_url: string;
  is_adopted: boolean;
  created_at?: string;
}

export async function fetchAnimals(): Promise<Animal[]> {
  const res = await fetch(`${API_BASE}/animals/`);
  if (!res.ok) throw new Error("Failed to load animals");
  return res.json();
}

export async function fetchAnimal(id: string): Promise<Animal> {
  const res = await fetch(`${API_BASE}/animals/${id}`);
  if (!res.ok) throw new Error("Failed to load animal");
  return res.json();
}

export async function adoptAnimal(id: string): Promise<Animal> {
  const res = await fetch(`${API_BASE}/animals/${id}/adopt`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to adopt");
  return res.json();
}

// Generic CRUD helpers for admin panel
export async function listAll(endpoint: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/${endpoint}/`);
  if (!res.ok) throw new Error(`Failed to load ${endpoint}`);
  return res.json();
}

export async function createRecord(endpoint: string, body: any): Promise<any> {
  const res = await fetch(`${API_BASE}/${endpoint}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create: ${await res.text()}`);
  return res.json();
}

export async function updateRecord(endpoint: string, id: string, body: any): Promise<any> {
  const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to update: ${await res.text()}`);
  return res.json();
}

export async function deleteRecord(endpoint: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${endpoint}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete: ${await res.text()}`);
}
