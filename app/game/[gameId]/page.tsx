"use client";
import { useEffect, useRef, useState } from "react";

type EventItem = { ts: number; type: string; description: string; team?: string; player?: string; };

export default function GamePage({ params }: { params: { gameId: string } }) {
  const { gameId } = params;
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stories, setStories] = useState<string[]>([]);
  const evtRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/replay/${gameId}/stream`);
    evtRef.current = es;
    es.onmessage = async (msg) => {
      try {
        const evt: EventItem = JSON.parse(msg.data);
        setEvents(prev => [...prev, evt]);

        const storyRes = await fetch("/api/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: evt })
        });
        const storyData = await storyRes.json();
        setStories(prev => [...prev, storyData.text]);
      } catch (e) {
        console.error(e);
      }
    };
    es.onerror = () => { es.close(); };
    return () => { es.close(); };
  }, [gameId]);

  return (
    <main>
      <section style={{ background: "#11172e", padding: 16, borderRadius: 12, border: "1px solid #1f2a44" }}>
        <h2 style={{ marginTop: 0 }}>Live Game (Simulated): {gameId}</h2>
        <p style={{ marginTop: 0, opacity: 0.8 }}>This replays a past game's event list as an SSE stream. No real live data needed.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <h3 style={{ marginTop: 0 }}>Incoming Events</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {events.map((e, i) => (
                <li key={i} style={{ marginBottom: 8, padding: 8, background: "#0e1530", border: "1px solid #1d2b52", borderRadius: 8 }}>
                  <div style={{ opacity: 0.8, fontSize: 12 }}>{new Date(e.ts).toLocaleTimeString()}</div>
                  <div><strong>{e.type}</strong> — {e.description}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ marginTop: 0 }}>AI Game Stories</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {stories.map((s, i) => (
                <li key={i} style={{ marginBottom: 8, padding: 8, background: "#0e1530", border: "1px solid #1d2b52", borderRadius: 8 }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
