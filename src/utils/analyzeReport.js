export async function analyzeReportWithClaude(imageBase64, mimeType, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: imageBase64 },
          },
          {
            type: 'text',
            text: `You are a friendly medical report explainer for everyday patients who have no medical background.

Analyze this medical test report and explain every single result in plain, simple English.

Respond in EXACTLY this format (use these exact headings):

REPORT TYPE
[What kind of medical test this is, in simple everyday words. e.g. "Blood test (Complete Blood Count)" or "Urine test" or "Cholesterol panel"]

YOUR RESULTS
[For EVERY result in the report, write one bullet like this:]
• [Simple name for the test]: [Value from report] → [1-2 plain sentences: what this measures in your body, and whether this result is normal, slightly off, or needs attention]

OVERALL PICTURE
[2-3 sentences that sum up the big picture in friendly, calm language. Reassure the patient if results are mostly normal.]

THINGS TO MENTION TO YOUR DOCTOR
[List any values outside the normal range, or anything the patient should ask their doctor about. If everything looks normal, say so clearly.]

IMPORTANT REMINDER
This is for learning purposes only. Always talk to your doctor or healthcare provider about your actual results before making any health decisions.

Rules:
- Use everyday words, not medical jargon
- If you must use a medical word, explain it immediately in brackets
- Be calm and reassuring in tone
- If a value is flagged as high/low in the report, say so clearly but without alarming the patient
- If the image is not a medical report, say so politely`,
          },
        ],
      }],
    }),
  });

  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try { const e = await res.json(); msg = e.error?.message || msg; } catch (_) {}
    throw new Error(msg);
  }

  const data = await res.json();
  return data.content[0].text;
}
