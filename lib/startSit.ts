import { Player } from "./types";
type Recommendation = { player: Player; action: "START"|"SIT"|"FLEX"; score: number; reason: string; };
export function scorePlayer(p: Player): number {
  let s = 0; const base = { QB:55, RB:65, WR:65, TE:50, K:35, DST:40 } as const; s += (base as any)[p.position] ?? 50;
  if (p.injuryStatus === "OUT") s -= 100; if (p.injuryStatus === "QUESTIONABLE") s -= 10;
  if (p.trend?.snapShare) s += Math.min(20, Math.max(0, (p.trend.snapShare - 50) * 0.3));
  if (p.trend?.targetShare && (p.position === "WR" || p.position === "TE" || p.position === "RB")) s += Math.min(25, p.trend.targetShare*0.5);
  if (p.trend?.redZoneTouches) s += Math.min(15, p.trend.redZoneTouches*2);
  return Math.round(s);
}
export function recommend(players: Player[]): Recommendation[] {
  const arr = players.map(p => { const score = scorePlayer(p); let action: Recommendation["action"]="FLEX";
    if (score>=70) action="START"; if (score<50) action="SIT";
    const bits: string[] = []; if (p.injuryStatus && p.injuryStatus!=="HEALTHY") bits.push(`injury: ${p.injuryStatus}`);
    if (p.trend?.snapShare) bits.push(`snap ${p.trend.snapShare}%`); if (p.trend?.targetShare) bits.push(`tgt ${p.trend.targetShare}%`);
    if (p.trend?.redZoneTouches) bits.push(`RZ touches ${p.trend.redZoneTouches}`); bits.push(`score ${score}`);
    return { player: p, action, score, reason: bits.join(" • ") };
  });
  return arr.sort((a,b)=>b.score-a.score);
}
