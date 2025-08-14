import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

export async function GET(req: NextRequest, { params }: { params: { gameId: string } }) {
  const gameId = params.gameId || "demo";
  const fixturePath = path.join(process.cwd(), "fixtures", `${gameId}.json`);
  if (!fs.existsSync(fixturePath)) return new Response("Game not found", { status: 404 });

  const raw = fs.readFileSync(fixturePath, "utf-8");
  const data = JSON.parse(raw) as { events: any[] };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for (const evt of data.events) {
        const line = `data: ${JSON.stringify(evt)}\n\n`;
        controller.enqueue(encoder.encode(line));
        await sleep(1200);
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
