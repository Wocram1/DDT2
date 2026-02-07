export async function api(action, payload = {}) {
  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}
