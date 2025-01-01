import React, { useRef, useEffect, useState } from "react";
import "./styles.css";

const renderMatrix = (canvas, columns, fontSize) => {
  const context = canvas.getContext("2d");

  // Function to generate a random color
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  };

  const rainDrops = [];

  // Initialize only a fraction of the columns (randomly picking some columns to have rain drops)
  for (let x = 0; x < columns; x++) {
    if (Math.random() > 0.7) {
      rainDrops[x] = { y: -3, color: generateRandomColor() };
    } else {
      rainDrops[x] = null;
    }
  }

  const render = () => {
    context.fillStyle = "rgba(0, 0, 0, 0.05)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    context.strokeStyle = "#7a7a7a80";
    context.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x < columns; x++) {
      context.beginPath();
      context.moveTo(x * fontSize, 0);
      context.lineTo(x * fontSize, canvas.height);
      context.stroke();
    }

    // Horizontal lines
    const rows = Math.floor(canvas.height / fontSize);
    for (let y = 0; y < rows; y++) {
      context.beginPath();
      context.moveTo(0, y * fontSize);
      context.lineTo(canvas.width, y * fontSize);
      context.stroke();
    }

    for (let i = 0; i < rainDrops.length; i++) {
      const drop = rainDrops[i];
      if (drop) {
        context.fillStyle = drop.color;
        
        context.fillRect(i * fontSize, drop.y * fontSize, fontSize, fontSize * 3);

        if (drop.y * fontSize > canvas.height && Math.random() > 0.975) {
          drop.y = -3; 
          drop.color = generateRandomColor(); 
        }

        drop.y++;
      }
    }
  };

  return render;
};


const MatrixRainingColor = (props) => {
  const ref = useRef();
  const [dimensions, setDimensions] = useState({ columns: 0, rows: 0 });
  const fontSize = 50;

  useEffect(() => {
  
    const canvas = ref.current;
    const updateDimensions = () => {
      const columns = Math.floor(canvas.width / fontSize);  // number of columns based on canvas width
      const rows = Math.floor(canvas.height / fontSize);    // number of rows based on canvas height
      setDimensions({ columns, rows });
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updateDimensions();

    // Add resize listener to update grid on window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateDimensions();
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    };
  }, [fontSize]);

  const { columns } = dimensions;

  useEffect(() => {
    const render = renderMatrix(ref.current, columns, fontSize);
    const intervalId = setInterval(render, 30);
    return () => clearInterval(intervalId);
  }, [columns, fontSize]);

  return (
    <React.Fragment>
      <canvas key={`mrc-${props.key}`} className={`mrc-container ${props.custom_class}`} ref={ref} />
    </React.Fragment>
  );
};

export default MatrixRainingColor;
