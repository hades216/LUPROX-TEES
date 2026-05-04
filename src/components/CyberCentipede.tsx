import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
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

    const SEGMENTS = 40;
    const SEGMENT_SPACING = 12;
    
    const points: Point[] = Array.from({ length: SEGMENTS }).map(() => ({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
    }));

    let target = { x: width / 2, y: height / 2 };
    const mouse = { x: width / 2, y: height / 2 };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let time = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      // Slow drift if mouse is inactive, otherwise follow mouse
      const isMobile = window.innerWidth < 768;
      const wanderX = width / 2 + Math.sin(time) * (width / 3);
      const wanderY = height / 2 + Math.cos(time * 0.8) * (height / 3);
      
      const distToMouse = Math.hypot(mouse.x - points[0].x, mouse.y - points[0].y);
      
      if (!isMobile && distToMouse < 600) {
        target.x += (mouse.x - target.x) * 0.05;
        target.y += (mouse.y - target.y) * 0.05;
      } else {
        target.x += (wanderX - target.x) * 0.02;
        target.y += (wanderY - target.y) * 0.02;
      }

      // Spring physics for head
      points[0].vx += (target.x - points[0].x) * 0.05;
      points[0].vy += (target.y - points[0].y) * 0.05;
      points[0].vx *= 0.8;
      points[0].vy *= 0.8;
      points[0].x += points[0].vx;
      points[0].y += points[0].vy;

      // Kinematics for body
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

      // Draw minimal elegant line
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < SEGMENTS; i++) {
        // Bezier curve for smoothness
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.lineTo(points[SEGMENTS-1].x, points[SEGMENTS-1].y);
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 10;
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Draw minimal glowing dots
      for (let i = 0; i < SEGMENTS; i += 4) {
        const p = points[i];
        const size = (1 - i / SEGMENTS) * 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.3)";
        ctx.fill();
        
        if (i === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
    />
  );
}
