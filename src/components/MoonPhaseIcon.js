import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const MoonPhaseIcon = ({ phase, size = '1em' }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let canvasSize;

      p.setup = () => {
        canvasSize = parseFloat(getComputedStyle(document.documentElement).fontSize) * parseFloat(size); // 1em = 16px
        p.createCanvas(canvasSize, canvasSize).parent(canvasRef.current);
      };

      p.draw = () => {
        p.clear();
        p.noStroke();

        // Rond de fase af naar 28 stappen
        const roundedPhase = Math.round(phase * 28) / 28;

        // Basis cirkel voor de volle maan
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        const radius = canvasSize * 0.8;

        // Teken de volle maan
        p.fill(200); // Lichtgrijs
        p.ellipse(centerX, centerY, radius, radius);

        // Bereken masker-positie en grootte
        const offset = radius * (roundedPhase <= 0.5 ? roundedPhase * 2 : (1 - roundedPhase) * 2); // Hoeveelheid verduistering
        p.fill(0); // Zwart voor verduistering

        if (roundedPhase <= 0.5) {
          // Wassende maan: verduistering aan de linkerkant
          p.arc(centerX, centerY, radius, radius, p.HALF_PI + p.PI, p.HALF_PI + p.PI + p.PI, p.CHORD);
          p.fill(200); // Herstel grijs voor belichting
          p.arc(centerX - offset, centerY, radius, radius, -p.HALF_PI, p.HALF_PI, p.CHORD);
        } else {
          // Afnemende maan: verduistering aan de rechterkant
          p.arc(centerX, centerY, radius, radius, -p.HALF_PI, p.HALF_PI, p.CHORD);
          p.fill(200); // Herstel grijs voor belichting
          p.arc(centerX + offset, centerY, radius, radius, p.HALF_PI, p.HALF_PI + p.PI, p.CHORD);
        }
      };
    };

    const myP5 = new p5(sketch);
    return () => myP5.remove(); // Verwijder canvas bij unmount
  }, [phase, size]);

  return <div ref={canvasRef} style={{ height: size, width: size }}></div>;
};

export default MoonPhaseIcon;
