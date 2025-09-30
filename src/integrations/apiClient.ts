const API_URL = import.meta.env.VITE_API_URL;


function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register({
  email,
  password,
  name,
  companyName,
}: {
  email: string;
  password: string;
  name: string;
  companyName: string;
}): Promise<any> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, companyName }),
  });
  if (!response.ok) throw new Error(await response.text() || "Registration failed");
  return response.json();
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ token: string }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(await response.text() || "Login failed");
  return response.json();
}

export async function getMachines(): Promise<any[]> {
  const res = await fetch(`${API_URL}/machines`, { headers: { ...getAuthHeaders() } });
  if (!res.ok) throw new Error(await res.text() || "Failed to fetch machines");
  return res.json();
}

export async function addMachine(machine: any): Promise<any> {
  const res = await fetch(`${API_URL}/machines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(machine),
  });
  if (!res.ok) throw new Error(await res.text() || "Failed to add machine");
  return res.json();
}

export async function getProducts(): Promise<any[]> {
  const res = await fetch(`${API_URL}/products`, { headers: { ...getAuthHeaders() } });
  if (!res.ok) throw new Error(await res.text() || "Failed to fetch products");
  return res.json();
}

export async function addProduct(product: any): Promise<any> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error(await res.text() || "Failed to add product");
  return res.json();
}

export async function getStats(): Promise<{
  totalMachines: number;
  activeMachines: number;
  totalProducts: number;
  expiringProducts: number;
  expiredProducts: number;
  healthyProducts: number;
}> {
  const res = await fetch(`${API_URL}/stats`, { headers: { ...getAuthHeaders() } });
  if (!res.ok) throw new Error(await res.text() || "Failed to fetch stats");
  return res.json();
}

export const apiClient = {
  register,
  login,
  getMachines,
  addMachine,
  getProducts,
  addProduct,
  getStats,
};
