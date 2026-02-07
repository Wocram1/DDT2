export async function api(action, payload = {}) {
  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });

  return res.json();
}
