export type Player = {
  id: string; name: string;
  position: "QB"|"RB"|"WR"|"TE"|"K"|"DST";
  team: string; opponent: string;
  injuryStatus?: "OUT"|"QUESTIONABLE"|"PROBABLE"|"HEALTHY";
  trend?: { snapShare?: number; targetShare?: number; redZoneTouches?: number; };
};
