import "./Player.css";

const cardThemes = {
  toty: {
    bg: "linear-gradient(150deg, #041830 0%, #0b3d6b 35%, #1565c0 55%, #0b3d6b 75%, #041830 100%)",
    accent: "#64b5f6",
    textMain: "#e3f2fd",
    textSub: "#90caf9",
    glow: "0 0 35px rgba(66,165,245,0.65), 0 0 70px rgba(66,165,245,0.3)",
    border: "2px solid #42a5f5",
    jerseyBg: "#1565c0",
  },
  gold: {
    bg: "linear-gradient(150deg, #2d1e00 0%, #a07820 30%, #e8c84a 50%, #a07820 70%, #2d1e00 100%)",
    accent: "#fff8dc",
    textMain: "#1a1200",
    textSub: "#4a3800",
    glow: "0 0 35px rgba(232,200,74,0.65), 0 0 70px rgba(232,200,74,0.3)",
    border: "2px solid #e8c84a",
    jerseyBg: "#a07820",
  },
  potm: {
    bg: "linear-gradient(150deg, #16002e 0%, #5b1490 35%, #9c27b0 55%, #5b1490 75%, #16002e 100%)",
    accent: "#e040fb",
    textMain: "#f3e5f5",
    textSub: "#ce93d8",
    glow: "0 0 35px rgba(224,64,251,0.65), 0 0 70px rgba(224,64,251,0.3)",
    border: "2px solid #ce93d8",
    jerseyBg: "#6a1b9a",
  },
  hero: {
    bg: "linear-gradient(150deg, #1a0800 0%, #bf360c 35%, #f4511e 55%, #bf360c 75%, #1a0800 100%)",
    accent: "#ffe0b2",
    textMain: "#fff8f5",
    textSub: "#ffccbc",
    glow: "0 0 35px rgba(244,81,30,0.65), 0 0 70px rgba(244,81,30,0.3)",
    border: "2px solid #ff7043",
    jerseyBg: "#bf360c",
  },
  silver: {
    bg: "linear-gradient(150deg, #111 0%, #455a64 30%, #8faab5 50%, #455a64 70%, #111 100%)",
    accent: "#eceff1",
    textMain: "#eceff1",
    textSub: "#b0bec5",
    glow: "0 0 35px rgba(143,170,181,0.5), 0 0 70px rgba(143,170,181,0.25)",
    border: "2px solid #78909c",
    jerseyBg: "#455a64",
  },
  wonderkid: {
    bg: "linear-gradient(150deg, #021a0e 0%, #1b5e20 35%, #43a047 55%, #1b5e20 75%, #021a0e 100%)",
    accent: "#b9f6ca",
    textMain: "#f1fff5",
    textSub: "#a5d6a7",
    glow: "0 0 35px rgba(67,160,71,0.65), 0 0 70px rgba(67,160,71,0.3)",
    border: "2px solid #66bb6a",
    jerseyBg: "#1b5e20",
  },
};

function Player({ name, team, nationality, jerseyNumber, age, image, rating, position, stats, cardType, flag }) {
  const theme = cardThemes[cardType] || cardThemes.gold;

  return (
    <div
      className="fifa-card"
      style={{ background: theme.bg, boxShadow: theme.glow, border: theme.border }}
    >
      <div className="card-shine" />

      <div className="card-inner">
        {/* Top row: rating + position | flag + jersey */}
        <div className="card-top">
          <div className="card-rating-block">
            <span className="card-rating" style={{ color: theme.textMain }}>{rating}</span>
            <span className="card-position" style={{ color: theme.accent }}>{position}</span>
          </div>
          <div className="card-top-right">
            <span className="card-flag">{flag}</span>
            <span
              className="card-jersey"
              style={{ background: theme.jerseyBg, color: theme.textMain }}
            >
              #{jerseyNumber}
            </span>
          </div>
        </div>

        {/* Player image */}
        <div className="card-image-wrapper">
          <img src={image} alt={name} />
        </div>

        {/* Name & team */}
        <div className="card-name" style={{ color: theme.textMain }}>{name}</div>
        <div className="card-team" style={{ color: theme.accent }}>{team} · {nationality} · {age} y.o.</div>

        {/* Divider */}
        <div className="card-divider" style={{ background: theme.accent }} />

        {/* Stats */}
        <div className="card-stats">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="stat-block">
              <span className="stat-value" style={{ color: theme.textMain }}>{value}</span>
              <span className="stat-label" style={{ color: theme.textSub }}>{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Player.defaultProps = {
  name: "Unknown Player",
  team: "Unknown Team",
  nationality: "Unknown",
  jerseyNumber: 0,
  age: 0,
  image: "https://via.placeholder.com/160x185?text=Player",
  rating: 75,
  position: "MID",
  cardType: "gold",
  flag: "🌍",
  stats: { PAC: 10, FIN: 10, PAS: 10, DRI: 10, VIS: 10, STR: 10 },
};

export default Player;
