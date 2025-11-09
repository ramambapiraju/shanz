import { useEffect, useState } from "react";

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  throttleUp: boolean;
  throttleDown: boolean;
}

export const useKeyboardControls = (enabled: boolean = true) => {
  const [keys, setKeys] = useState<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    throttleUp: false,
    throttleDown: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case "ArrowDown":
        case "s":
        case "S":
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case "ArrowRight":
        case "d":
        case "D":
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case " ": // Space
          e.preventDefault();
          setKeys((prev) => ({ ...prev, up: true }));
          break;
        case "Shift":
          setKeys((prev) => ({ ...prev, down: true }));
          break;
        case "+":
        case "=":
          setKeys((prev) => ({ ...prev, throttleUp: true }));
          break;
        case "-":
        case "_":
          setKeys((prev) => ({ ...prev, throttleDown: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case "ArrowDown":
        case "s":
        case "S":
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case "ArrowRight":
        case "d":
        case "D":
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case " ":
          setKeys((prev) => ({ ...prev, up: false }));
          break;
        case "Shift":
          setKeys((prev) => ({ ...prev, down: false }));
          break;
        case "+":
        case "=":
          setKeys((prev) => ({ ...prev, throttleUp: false }));
          break;
        case "-":
        case "_":
          setKeys((prev) => ({ ...prev, throttleDown: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled]);

  return keys;
};