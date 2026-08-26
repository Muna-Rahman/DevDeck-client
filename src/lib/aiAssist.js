const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function generateWithAI({ mode, code, description, language }) {
  const res = await fetch(`${backendUrl}/api/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ mode, code, description, language }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "AI generation failed. Please try again.");
  }

  return data.result;
}