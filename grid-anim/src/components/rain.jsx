import React, { useRef, useEffect, useState } from "react";
import "./styles.css";

const MatrixRainingColor = (props) => {
  const ref = useRef();
  const rainDropsRef = useRef([]);
  const [dimensions, setDimensions] = useState({ columns: 0, rows: 0 });
  const [currentColor, setCurrentColor] = useState("rgb(255, 0, 0)");
  const fontSize = 66;

  useEffect(() => {
    const canvas = ref.current;

    const updateDimensions = () => {
      const columns = Math.floor(canvas.width / fontSize);
      const rows = Math.floor(canvas.height / fontSize);
      setDimensions({ columns, rows });

      // Calculate the max number of raindrops based on the total grid cells
      const maxDrops = Math.floor(columns * rows * 0.025); // 2.5% of the total grid cells

      // Initialize raindrops with random columns
      rainDropsRef.current = Array.from({ length: maxDrops }, () => ({
        x: Math.floor(Math.random() * columns), // Random column
        y: Math.floor(Math.random() * -rows),  // Random starting position above the screen
      }));
    };

    // Set initial canvas size and dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateDimensions();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fontSize]);

  // Change color dynamically
  useEffect(() => {
    const changeColor = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      setCurrentColor(`rgb(${r},${g},${b})`);
    };

    const intervalId = setInterval(changeColor, 2000); // Change color every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");

    const render = () => {
      // Clear the canvas with a slight fade for trailing effect
      context.fillStyle = "rgba(0, 0, 0, 0.18)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      context.strokeStyle = "rgba(200, 200, 200, 0.5)";
      context.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += fontSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
      }

      for (let y = 0; y < canvas.height; y += fontSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
      }

      // Draw raindrops
      rainDropsRef.current.forEach((drop) => {
        context.fillStyle = currentColor;
        context.fillRect(
          drop.x * fontSize,
          drop.y * fontSize,
          fontSize,
          fontSize
        );

        // Move the drop down and reset if it goes off-screen
        if (drop.y * fontSize >= canvas.height) {
          // Reset y to start above the screen, and randomize x
          drop.y = Math.floor(Math.random() * -10); // Random position above the screen
          drop.x = Math.floor(Math.random() * dimensions.columns); // Random column
        } else {
          drop.y += 1; // Move down
        }
      });
    };

    const intervalId = setInterval(render, 35); // Continuously render every 35ms
    return () => clearInterval(intervalId);
  }, [dimensions, fontSize, currentColor]);

  return (
    <React.Fragment>
      <canvas
        key={`mrc-${props.key}`}
        className={`mrc-container ${props.custom_class}`}
        ref={ref}
      />
    </React.Fragment>
  );
};

export default MatrixRainingColor;
