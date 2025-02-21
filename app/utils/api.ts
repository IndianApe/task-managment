export async function fetchAITaskRecommendations(userInput: string) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch AI recommendations");
  }

  return res.json();
}
