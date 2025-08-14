import { NextResponse } from "next/server";
import { z } from "zod";
import { recommend } from "@/lib/startSit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const schema = z.object({
      players: z.array(z.object({
        id: z.string(),
        name: z.string(),
        position: z.enum(["QB","RB","WR","TE","K","DST"]),
        team: z.string(),
        opponent: z.string(),
        injuryStatus: z.enum(["OUT","QUESTIONABLE","PROBABLE","HEALTHY"]).optional(),
        trend: z.object({
          snapShare: z.number().optional(),
          targetShare: z.number().optional(),
          redZoneTouches: z.number().optional()
        }).optional()
      }))
    });
    const { players } = schema.parse(body);
    const recommendations = recommend(players as any);
    return NextResponse.json({ recommendations });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid request" }, { status: 400 });
  }
}
