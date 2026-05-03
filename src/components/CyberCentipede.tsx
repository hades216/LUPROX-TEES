import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

export function CyberCentipede() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener("resize", resize);
    resize();

    const SEGMENTS = 25;
    const SEGMENT_SPACING = 25;
    
    // Centipede array
    const points: Point[] = Array.from({ length: SEGMENTS }).map(() => ({
      x: width / 2,
      y: height / 2,
    }));

    let target = { x: width / 2, y: height / 2 };
    let time = 0;

    // Movement noise parameters
    let noiseX = Math.random() * 1000;
    let noiseY = Math.random() * 1000;

    // Some simple pseudo-random noise
    const noise = (t: number) => Math.sin(t) * Math.cos(t * 1.5) * Math.sin(t * 0.3);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.01;
      noiseX += 0.005;
      noiseY += 0.007;

      // Make it wander smoothly across the whole screen
      const wanderX = width / 2 + noise(noiseX) * (width * 0.9);
      const wanderY = height / 2 + noise(noiseY * 1.2) * (height * 0.9);
      
      target.x += (wanderX - target.x) * 0.02;
      target.y += (wanderY - target.y) * 0.02;

      // Move head
      points[0].x += (target.x - points[0].x) * 0.05;
      points[0].y += (target.y - points[0].y) * 0.05;

      // Inverse Kinematics for body
      for (let i = 1; i < SEGMENTS; i++) {
        const dx = points[i - 1].x - points[i].x;
        const dy = points[i - 1].y - points[i].y;
        const dist = Math.hypot(dx, dy);

        if (dist > SEGMENT_SPACING) {
          const angle = Math.atan2(dy, dx);
          points[i].x = points[i - 1].x - Math.cos(angle) * SEGMENT_SPACING;
          points[i].y = points[i - 1].y - Math.sin(angle) * SEGMENT_SPACING;
        }
      }

      // DRAWING
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Draw Legs
      for (let i = 1; i < SEGMENTS; i++) {
        if (i > SEGMENTS - 3) continue;

        const p = points[i];
        const nextP = points[i - 1];
        const angle = Math.atan2(nextP.y - p.y, nextP.x - p.x);

        const sizeFade = 1 - (i / SEGMENTS);
        const legBaseSize = 15 + sizeFade * 25;
        const walkCycle = Math.sin(time * 10 + i * 0.5) * 0.5;

        // Neon legs
        ctx.strokeStyle = `hsl(${(time * 50 + i * 10) % 360}, 100%, 60%)`;
        ctx.lineWidth = 4 + sizeFade * 4;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 15;

        // Left Leg
        ctx.beginPath();
        const lBaseX = p.x + Math.cos(angle - Math.PI / 2) * (5 + sizeFade * 10);
        const lBaseY = p.y + Math.sin(angle - Math.PI / 2) * (5 + sizeFade * 10);
        const lJointX = lBaseX + Math.cos(angle - 1.2 + walkCycle) * legBaseSize;
        const lJointY = lBaseY + Math.sin(angle - 1.2 + walkCycle) * legBaseSize;
        const lTipX = lJointX + Math.cos(angle - 2 + walkCycle * 0.5) * legBaseSize * 1.5;
        const lTipY = lJointY + Math.sin(angle - 2 + walkCycle * 0.5) * legBaseSize * 1.5;

        ctx.moveTo(lBaseX, lBaseY);
        ctx.quadraticCurveTo(lJointX, lJointY, lTipX, lTipY);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        const rBaseX = p.x + Math.cos(angle + Math.PI / 2) * (5 + sizeFade * 10);
        const rBaseY = p.y + Math.sin(angle + Math.PI / 2) * (5 + sizeFade * 10);
        const rJointX = rBaseX + Math.cos(angle + 1.2 - walkCycle) * legBaseSize;
        const rJointY = rBaseY + Math.sin(angle + 1.2 - walkCycle) * legBaseSize;
        const rTipX = rJointX + Math.cos(angle + 2 - walkCycle * 0.5) * legBaseSize * 1.5;
        const rTipY = rJointY + Math.sin(angle + 2 - walkCycle * 0.5) * legBaseSize * 1.5;

        ctx.moveTo(rBaseX, rBaseY);
        ctx.quadraticCurveTo(rJointX, rJointY, rTipX, rTipY);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // Draw Body Plates
      for (let i = 0; i < SEGMENTS; i++) {
        const p = points[i];
        let angle = 0;
        if (i === 0) {
          angle = Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x);
        } else {
          angle = Math.atan2(points[i - 1].y - p.y, points[i - 1].x - p.x);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);

        const sizeFade = Math.sin((i / SEGMENTS) * Math.PI) * 0.8 + 0.2;
        const width = (i === 0 ? 35 : 28) * sizeFade;
        const height = (i === 0 ? 45 : 35) * sizeFade;

        // Base Glassy Armor Plate
        ctx.beginPath();
        if (i === 0) {
          // Gothic Skull Head
          ctx.moveTo(height * 1.5, 0);
          ctx.lineTo(height * 0.8, width * 0.6);
          ctx.lineTo(0, width * 1.2);
          ctx.lineTo(-height * 0.5, width * 1.8); // Sweeping Horn
          ctx.lineTo(-height * 0.2, width * 0.8);
          ctx.lineTo(-height * 0.8, 0);
          ctx.lineTo(-height * 0.2, -width * 0.8);
          ctx.lineTo(-height * 0.5, -width * 1.8); // Sweeping Horn
          ctx.lineTo(0, -width * 1.2);
          ctx.lineTo(height * 0.8, -width * 0.6);
          ctx.closePath();
        } else if (i === SEGMENTS - 1) {
          // Tail
          ctx.moveTo(height, width - 5);
          ctx.lineTo(-height * 2, 0);
          ctx.lineTo(height, -width + 5);
        } else {
          // Body 
          ctx.beginPath();
          ctx.moveTo(-height * 0.5, -width);
          ctx.lineTo(height * 0.8, 0);
          ctx.lineTo(-height * 0.5, width);
          ctx.lineTo(-height, 0);
        }

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, height);
        gradient.addColorStop(0, "rgba(10, 10, 30, 0.9)");
        gradient.addColorStop(1, i === 0 ? "rgba(200, 0, 30, 0.4)" : "rgba(0, 255, 255, 0.2)"); // Crimson glow for head

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = i === 0 ? "rgba(255, 0, 50, 0.8)" : `hsl(${(time * 50 + i * 10) % 360}, 100%, 50%)`;
        ctx.lineWidth = i === 0 ? 3 : 2;
        ctx.stroke();

        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = i === 0 ? 30 : 20;

        // Inner glowing core
        if (i !== 0) {
          ctx.beginPath();
          ctx.ellipse(0, 0, height * 0.2, width * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        }

        ctx.shadowBlur = 0;

        // Head Details
        if (i === 0) {
          // Multi-eyed gothic cluster
          ctx.shadowColor = "rgba(255, 0, 0, 1)";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          // Center main eye
          ctx.ellipse(height * 0.6, 0, height * 0.15, width * 0.1, 0, 0, Math.PI * 2);
          // Secondary eyes
          ctx.ellipse(height * 0.4, width * 0.35, height * 0.1, width * 0.2, Math.PI / 6, 0, Math.PI * 2);
          ctx.ellipse(height * 0.4, -width * 0.35, height * 0.1, width * 0.2, -Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowColor = "rgba(255, 0, 50, 1)";
          ctx.shadowBlur = 25;
          ctx.strokeStyle = "rgba(255, 0, 50, 1)";
          ctx.lineWidth = 4;

          const pinch = Math.sin(time * 8) * 0.4;
          
          // Outer jagged mandibles
          ctx.beginPath();
          ctx.moveTo(height * 1.2, width * 0.5);
          ctx.lineTo(height * 2.0 + pinch * 15, width * 0.7 - pinch * 10);
          ctx.lineTo(height * 2.8, pinch * 25);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(height * 1.2, -width * 0.5);
          ctx.lineTo(height * 2.0 + pinch * 15, -width * 0.7 + pinch * 10);
          ctx.lineTo(height * 2.8, -pinch * 25);
          ctx.stroke();

          // Inner scythes
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(height * 1.4, width * 0.2);
          ctx.quadraticCurveTo(height * 2.0 + pinch * 8, width * 0.3, height * 1.8, pinch * 5);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(height * 1.4, -width * 0.2);
          ctx.quadraticCurveTo(height * 2.0 + pinch * 8, -width * 0.3, height * 1.8, -pinch * 5);
          ctx.stroke();
          
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[5] pointer-events-none opacity-60 mix-blend-screen mix-blend-plus-lighter blur-[1px]"
    />
  );
}
