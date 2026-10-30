// aiService.ts — optional Gemini 1.5 Flash summary generation
// If no API key is set, returns null gracefully — the extension works without it.

import * as https from "https";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Generates a 3-sentence plain-English summary of the session.
// Returns null if no API key or if the request fails.
export async function generateSessionSummary(params: {
  apiKey: string | undefined;
  taskDescription: string;
  modifiedFiles: string[];
  lastKnownProblem: string;
  nextStep: string;
  branch: string | null;
}): Promise<string | null> {
  if (!params.apiKey) {
    return null; // AI is optional — no key, no summary, no crash
  }

  const prompt = `You are a developer assistant. Summarize this coding session in exactly 3 short sentences.
Be specific and practical. Do not use bullet points.

Task: ${params.taskDescription}
Branch: ${params.branch ?? "unknown"}
Modified files: ${params.modifiedFiles.join(", ") || "none"}
Last known problem: ${params.lastKnownProblem || "none"}
Next step: ${params.nextStep || "none"}

Write 3 sentences: what was being worked on, what problem was encountered, and what to do next.`;

  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 150, temperature: 0.3 },
  });

  return new Promise((resolve) => {
    const url = `${GEMINI_ENDPOINT}?key=${params.apiKey}`;
    const req = https.request(
      url,
      { method: "POST", headers: { "Content-Type": "application/json" } },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            const text: string =
              json?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
            resolve(text?.trim() ?? null);
          } catch {
            resolve(null); // bad response — fail silently
          }
        });
      }
    );
    req.on("error", () => resolve(null)); // network error — fail silently
    req.setTimeout(8000, () => { req.destroy(); resolve(null); }); // 8s timeout
    req.write(body);
    req.end();
  });
}
