import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const evt = body?.event;
  if (!evt) return NextResponse.json({ error: "Missing event" }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  const fallback = `Update: ${evt.description}`;

  if (!apiKey) return NextResponse.json({ text: fallback + " (LLM off)" });

  try {
    const client = new OpenAI({ apiKey });
    const prompt = [
      "Write a very short, punchy NFL game update in 1 sentence based on this event.",
      "Avoid emojis. Be concise.",
      `Event: ${evt.description}`
    ].join("\n");
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 60
    });
    const text = completion.choices?.[0]?.message?.content?.trim() || fallback;
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ text: fallback + " (LLM error fallback)" });
  }
}
