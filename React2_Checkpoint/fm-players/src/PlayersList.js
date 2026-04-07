import { useState } from "react";
import Player from "./Player";
import players from "./players";

const carouselStyles = `
  .carousel-track {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 520px;
    perspective: 1200px;
  }

  .carousel-card-wrapper {
    position: absolute;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }

  /* Centre */
  .carousel-card-wrapper.pos-center {
    transform: translateX(0px) scale(1) translateZ(0px);
    z-index: 10;
    opacity: 1;
    filter: none;
  }

  /* Gauche immédiat */
  .carousel-card-wrapper.pos-left1 {
    transform: translateX(-280px) scale(0.82) translateZ(-80px) rotateY(12deg);
    z-index: 6;
    opacity: 0.65;
    filter: brightness(0.55);
  }

  /* Droite immédiat */
  .carousel-card-wrapper.pos-right1 {
    transform: translateX(280px) scale(0.82) translateZ(-80px) rotateY(-12deg);
    z-index: 6;
    opacity: 0.65;
    filter: brightness(0.55);
  }

  /* Loin gauche */
  .carousel-card-wrapper.pos-left2 {
    transform: translateX(-490px) scale(0.65) translateZ(-160px) rotateY(20deg);
    z-index: 3;
    opacity: 0.3;
    filter: brightness(0.35);
  }

  /* Loin droite */
  .carousel-card-wrapper.pos-right2 {
    transform: translateX(490px) scale(0.65) translateZ(-160px) rotateY(-20deg);
    z-index: 3;
    opacity: 0.3;
    filter: brightness(0.35);
  }

  /* Caché */
  .carousel-card-wrapper.pos-hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateX(0px) scale(0.5);
    z-index: 0;
  }

  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    backdrop-filter: blur(6px);
  }

  .carousel-btn:hover {
    background: rgba(255,255,255,0.18);
  }

  .carousel-btn.left  { left:  16px; }
  .carousel-btn.right { right: 16px; }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
  }

  .carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    border: none;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }

  .carousel-dot.active {
    background: #64b5f6;
    transform: scale(1.4);
  }
`;

function getPosition(index, current, total) {
  const diff = (index - current + total) % total;
  if (diff === 0) return "pos-center";
  if (diff === 1) return "pos-right1";
  if (diff === 2) return "pos-right2";
  if (diff === total - 1) return "pos-left1";
  if (diff === total - 2) return "pos-left2";
  return "pos-hidden";
}

function PlayersList() {
  const [current, setCurrent] = useState(0);
  const total = players.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div style={{ padding: "0 0 3rem", position: "relative" }}>
      <style>{carouselStyles}</style>

      <div className="carousel-track">
        <button className="carousel-btn left" onClick={prev}>&#8249;</button>

        {players.map((player, index) => (
          <div
            key={player.id}
            className={`carousel-card-wrapper ${getPosition(index, current, total)}`}
            onClick={() => setCurrent(index)}
          >
            <Player {...player} />
          </div>
        ))}

        <button className="carousel-btn right" onClick={next}>&#8250;</button>
      </div>

      <div className="carousel-dots">
        {players.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default PlayersList;
