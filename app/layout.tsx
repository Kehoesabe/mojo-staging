export const metadata = { title: "Fantasy Mojo — MVP", description: "Simulated-live MVP" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:"system-ui",margin:0,background:"#0b1020",color:"#e6eaf2"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:24}}>
          <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h1 style={{margin:0,fontSize:24}}>🏈 Fantasy Mojo — MVP</h1>
            <nav style={{display:"flex",gap:16}}>
              <a style={{color:"#a5b4fc",textDecoration:"none"}} href="/">Dashboard</a>
              <a style={{color:"#a5b4fc",textDecoration:"none"}} href="/game/demo">Live Game</a>
            </nav>
          </header>
          {children}
          <footer style={{opacity:0.7,marginTop:32,fontSize:12}}>
            v0.1 — Simulated-live demo. Add your OPENAI_API_KEY in Vercel → Settings → Environment Variables.
          </footer>
        </div>
      </body>
    </html>
  );
}
