const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function startGoogleLogin() {
  window.location.href = `${API_BASE}/auth/google`;
}

export async function cloneDriveLink(link: string) {
  const res = await fetch(`${API_BASE}/api/clone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ link }),
    credentials: "include",
  });
  return res.json();
}
