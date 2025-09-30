const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper per gestire errori in modo uniforme
async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export async function register(data: {
  email: string;
  password: string;
  name: string;
  companyName: string;
}): Promise<any> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{ token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getMachines(): Promise<any[]> {
  const res = await fetch(`${API_URL}/machines`, {
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
}

export async function addMachine(machine: {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
}): Promise<any> {
  const res = await fetch(`${API_URL}/machines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(machine),
  });
  return handleResponse(res);
}

export async function getProducts(): Promise<any[]> {
  const res = await fetch(`${API_URL}/products`, {
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
}

export async function addProduct(product: any): Promise<any> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
}

export async function getStats(): Promise<{
  totalMachines: number;
  activeMachines: number;
  totalProducts: number;
  expiringProducts: number;
  expiredProducts: number;
  healthyProducts: number;
}> {
  const res = await fetch(`${API_URL}/stats`, {
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
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
