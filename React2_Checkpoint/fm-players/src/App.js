import "bootstrap/dist/css/bootstrap.min.css";
import PlayersList from "./PlayersList";

const heroStyle = {
  minHeight: "100vh",
  background: "radial-gradient(ellipse at top, #0d1f3c 0%, #060d1a 60%, #000 100%)",
  fontFamily: "'Arial Black', Arial, sans-serif",
};

const titleStyle = {
  fontSize: "clamp(2rem, 5vw, 3.5rem)",
  fontWeight: 900,
  letterSpacing: "6px",
  textTransform: "uppercase",
  background: "linear-gradient(90deg, #64b5f6, #e040fb, #f5d060, #64b5f6)",
  backgroundSize: "300% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: "gradientText 4s linear infinite",
};

const badgeStyle = {
  display: "inline-block",
  background: "linear-gradient(90deg, #1565c0, #6a1b9a)",
  color: "#fff",
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "3px",
  padding: "5px 16px",
  borderRadius: "20px",
  marginBottom: "1.2rem",
  textTransform: "uppercase",
};

const descStyle = {
  color: "#90caf9",
  fontSize: "1rem",
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: "1.8",
  letterSpacing: "0.5px",
};

const dividerStyle = {
  width: "60px",
  height: "3px",
  background: "linear-gradient(90deg, #64b5f6, #e040fb)",
  margin: "1.5rem auto",
  borderRadius: "2px",
};

const keyframes = `
  @keyframes gradientText {
    0%   { background-position: 0% center; }
    100% { background-position: 300% center; }
  }
`;

function App() {
  return (
    <div style={heroStyle}>
      <style>{keyframes}</style>

      {/* Hero intro */}
      <div style={{ textAlign: "center", padding: "4rem 2rem 2rem" }}>
        <span style={badgeStyle}>⚽ Football Manager</span>

        <h1 style={titleStyle}>FM Players</h1>

        <div style={dividerStyle} />

        <p style={descStyle}>
          <strong style={{ color: "#e3f2fd" }}>Football Manager</strong> is a football management
          simulation game where you take charge of a club and lead your squad to glory. Every
          decision matters — from transfer windows and tactics to training sessions and press
          conferences. Build your dynasty, one season at a time.
        </p>

        <p style={{ ...descStyle, marginTop: "1rem", color: "#ce93d8" }}>
          These are the players who left a mark on my saves — virtual legends who turned entire
          seasons around and wrote their names into my personal FM history. Stats are rated on
          the FM scale of 1 to 20.
        </p>
      </div>

      {/* Player cards carousel */}
      <PlayersList />
    </div>
  );
}

export default App;
