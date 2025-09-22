export async function cloneDriveLink(link: string) {
  const res = await fetch("http://localhost:5000/clone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ link }),
  });
  return res.json();
}
