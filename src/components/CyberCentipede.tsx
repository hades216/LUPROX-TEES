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
    const SEGMENT_SPACING = 60;
    
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

      // Make it wander smoothly
      const wanderX = width / 2 + noise(noiseX) * (width / 2.5);
      const wanderY = height / 2 + noise(noiseY) * (height / 2.5);
      
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
        const legBaseSize = 60 + sizeFade * 90;
        const walkCycle = Math.sin(time * 10 + i * 0.5) * 0.5;

        // Gloomy vibrant legs
        ctx.strokeStyle = "rgba(180, 0, 255, 0.4)";
        ctx.lineWidth = 8 + sizeFade * 12;
        ctx.shadowColor = "rgba(180, 0, 255, 0.8)";
        ctx.shadowBlur = 20;

        // Left Leg
        ctx.beginPath();
        const lBaseX = p.x + Math.cos(angle - Math.PI / 2) * (20 + sizeFade * 40);
        const lBaseY = p.y + Math.sin(angle - Math.PI / 2) * (20 + sizeFade * 40);
        const lJointX = lBaseX + Math.cos(angle - 1.2 + walkCycle) * legBaseSize;
        const lJointY = lBaseY + Math.sin(angle - 1.2 + walkCycle) * legBaseSize;
        const lTipX = lJointX + Math.cos(angle - 2 + walkCycle * 0.5) * legBaseSize * 1.5;
        const lTipY = lJointY + Math.sin(angle - 2 + walkCycle * 0.5) * legBaseSize * 1.5;

        ctx.moveTo(lBaseX, lBaseY);
        ctx.quadraticCurveTo(lJointX, lJointY, lTipX, lTipY);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        const rBaseX = p.x + Math.cos(angle + Math.PI / 2) * (20 + sizeFade * 40);
        const rBaseY = p.y + Math.sin(angle + Math.PI / 2) * (20 + sizeFade * 40);
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
        const width = (i === 0 ? 100 : 80) * sizeFade;
        const height = (i === 0 ? 120 : 100) * sizeFade;

        // Base Glassy Armor Plate
        ctx.beginPath();
        if (i === 0) {
          // Head
          ctx.ellipse(0, 0, height, width, 0, -Math.PI / 2, Math.PI * 1.5);
        } else if (i === SEGMENTS - 1) {
          // Tail
          ctx.moveTo(height, width - 5);
          ctx.lineTo(-height * 1.5, 0);
          ctx.lineTo(height, -width + 5);
        } else {
          // Body 
          ctx.ellipse(0, 0, height, width, 0, 0, Math.PI * 2);
        }

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
        gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.15)");
        gradient.addColorStop(1, "rgba(20, 0, 40, 0.3)");

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
        ctx.shadowBlur = 10;

        // Inner glowing core
        ctx.beginPath();
        ctx.ellipse(0, 0, height * 0.4, width * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
        ctx.fill();

        ctx.shadowBlur = 0;

        // Head Mandibles
        if (i === 0) {
          ctx.shadowColor = "rgba(255, 0, 255, 0.8)";
          ctx.shadowBlur = 15;
          ctx.strokeStyle = "rgba(255, 0, 255, 0.7)";
          ctx.lineWidth = 2;

          const pinch = Math.sin(time * 5) * 0.2;
          
          ctx.beginPath();
          ctx.moveTo(height * 0.8, width * 0.6);
          ctx.quadraticCurveTo(height + 15, width + 10 + pinch * 10, height + 25, 0);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(height * 0.8, -width * 0.6);
          ctx.quadraticCurveTo(height + 15, -width - 10 - pinch * 10, height + 25, 0);
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
      className="fixed inset-0 z-[5] pointer-events-none opacity-40 mix-blend-screen mix-blend-plus-lighter blur-[1px]"
    />
  );
}
