import { useState } from "react";
import {
  applyDelta,
  clampStep,
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_STEP,
  isAtMax,
  isAtMin,
} from "./counterLogic";
import HistoryLog from "./HistoryLog";

const MAX_HISTORY_ENTRIES = 5;

function Counter({ min = DEFAULT_MIN, max = DEFAULT_MAX } = {}) {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(DEFAULT_STEP);
  const [history, setHistory] = useState([]);

  const recordEntry = (label, from, to) => {
    setHistory((prev) =>
      [{ id: prev.length + 1, label, from, to }, ...prev].slice(0, MAX_HISTORY_ENTRIES)
    );
  };

  const handleIncrement = () => {
    const next = applyDelta(count, step, min, max);
    recordEntry(`+${step}`, count, next);
    setCount(next);
  };

  const handleDecrement = () => {
    const next = applyDelta(count, -step, min, max);
    recordEntry(`-${step}`, count, next);
    setCount(next);
  };

  const handleReset = () => {
    recordEntry("reset", count, 0);
    setCount(0);
  };

  const handleStepChange = (event) => {
    setStep(clampStep(Number(event.target.value)));
  };

  return (
    <section className="counter" aria-label="Counter">
      <p className="counter-value" data-testid="counter-value">
        {count}
      </p>

      <div className="counter-controls">
        <button
          type="button"
          className="btn btn--outline"
          onClick={handleDecrement}
          disabled={isAtMin(count, min)}
        >
          − {step}
        </button>
        <button type="button" className="btn btn--ghost" onClick={handleReset}>
          Reset
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleIncrement}
          disabled={isAtMax(count, max)}
        >
          + {step}
        </button>
      </div>

      <label className="counter-step">
        <span>Step</span>
        <input
          type="number"
          min="1"
          value={step}
          onChange={handleStepChange}
        />
      </label>

      <p className="counter-bounds">
        Bounds: {min} to {max}
      </p>

      <HistoryLog entries={history} />
    </section>
  );
}

export default Counter;
