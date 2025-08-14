"use client";
import { useEffect, useState } from "react";

type Player = {
  id: string;
  name: string;
  position: "QB" | "RB" | "WR" | "TE" | "K" | "DST";
  team: string;
  opponent: string;
  injuryStatus?: "OUT" | "QUESTIONABLE" | "PROBABLE" | "HEALTHY";
  trend?: { snapShare?: number; targetShare?: number; redZoneTouches?: number; };
};

export default function Page() {
  const [roster, setRoster] = useState<Player[]>([]);
  const [advice, setAdvice] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    fetch("/fixtures/roster.json").then(r => r.json()).then(setRoster);
  }, []);

  async function getAdvice() {
    setLoadingAdvice(true);
    try {
      const res = await fetch("/api/start-sit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players: roster })
      });
      const data = await res.json();
      setAdvice(data);
    } finally {
      setLoadingAdvice(false);
    }
  }

  return (
    <main>
      <section style={{ background: "#11172e", padding: 16, borderRadius: 12, border: "1px solid #1f2a44" }}>
        <h2 style={{ marginTop: 0 }}>Team Dashboard</h2>
        <p style={{ marginTop: 0, opacity: 0.8 }}>Static roster + Start/Sit advisory. This proves the loop while live data is wired later.</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #223056" }}>
              <th style={{ padding: "8px 6px" }}>Player</th>
              <th>Pos</th>
              <th>Team</th>
              <th>Opp</th>
              <th>Injury</th>
              <th>Trends</th>
            </tr>
          </thead>
          <tbody>
            {roster.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #1d2848" }}>
                <td style={{ padding: "8px 6px" }}>{p.name}</td>
                <td>{p.position}</td>
                <td>{p.team}</td>
                <td>@ {p.opponent}</td>
                <td>{p.injuryStatus ?? "HEALTHY"}</td>
                <td>
                  {p.trend ? (
                    <span>snap {p.trend.snapShare ?? 0}% • tgt {p.trend.targetShare ?? 0}% • RZ {p.trend.redZoneTouches ?? 0}</span>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button onClick={getAdvice} disabled={loadingAdvice} style={{ padding: "10px 14px", background: "#3b82f6", color: "white", border: 0, borderRadius: 8, cursor: "pointer" }}>
            {loadingAdvice ? "Analyzing…" : "Get Start/Sit Advice"}
          </button>
          <a href="/game/demo" style={{ padding: "10px 14px", background: "#10b981", color: "white", borderRadius: 8, textDecoration: "none" }}>Watch Simulated Game</a>
        </div>

        {advice && (
          <div style={{ marginTop: 16, background: "#0e1530", border: "1px solid #1d2b52", borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Recommendations</h3>
            <ol>
              {advice.recommendations.map((r: any, idx: number) => (
                <li key={idx}><strong>{r.player.name}</strong>: {r.action} — {r.reason}</li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </main>
  );
}
