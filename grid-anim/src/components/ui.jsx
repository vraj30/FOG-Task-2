import React from "react";
import MatrixRainingColor from "./rain";
import "./GameUI.css";

const GameUI = () => {
  return (
    <div className="game-ui">
      <header className="game-header">
        <h1>Color Rain </h1>
      </header>
      <main className="game-content">
        <MatrixRainingColor />
        <div className="game-panel">
          <button className="neon-button">Start</button>
          <button className="neon-button">Pause</button>
          <button className="neon-button">Reset</button>
        </div>
      </main>
      <footer className="game-footer">
        <p>Designed for an Immersive Experience</p>
      </footer>
    </div>
  );
};

export default GameUI;
