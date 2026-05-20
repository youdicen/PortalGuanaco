import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const Constellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Configuración
    const maxParticles = Math.min(Math.floor((width * height) / 18000), 120);
    const connectionDistance = 180;
    const mouseDistance = 250;
    const particleColor = 'rgba(204, 88, 51, 0.7)'; // #CC5833 con opacidad aumentada
    const lineColor = 'rgba(204, 88, 51, ';

    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2.5 + 1.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Actualizar posiciones
      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en los bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      // Dibujar conexiones
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        
        // Conexión con el mouse
        const dxMouse = p1.x - mouse.current.x;
        const dyMouse = p1.y - mouse.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouseDistance) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          const opacity = 1 - distMouse / mouseDistance;
          ctx.strokeStyle = `${lineColor}${opacity * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Conexión entre partículas
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - dist / connectionDistance;
            ctx.strokeStyle = `${lineColor}${opacity * 0.35})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    initParticles();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
