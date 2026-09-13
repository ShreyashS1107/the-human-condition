import React, { useRef, useEffect } from 'react';

/**
 * Sacred Ceremony Visual System for Stage 07 — THE END.
 * Renders an extremely subtle, slow-rotating sacred astronomical / manuscript diagram
 * in deep darkness behind the sacred Sanskrit verse.
 * 
 * Felt more than consciously noticed. Completely non-intrusive.
 */
export function SacredCeremonyBackground({ phase }) {
  const canvasRef = useRef(null);

  const showGeometry =
    phase !== 'INITIAL_BLACK' &&
    phase !== 'MID_BLACK' &&
    phase !== 'THE_END_IN' &&
    phase !== 'THE_END_HOLD' &&
    phase !== 'THE_END_OUT' &&
    phase !== 'PERMANENT_BLACK';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle dust motes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 1.4,
      alpha: 0.04 + Math.random() * 0.12,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.05 - Math.random() * 0.1,
    }));

    let rotation = 0;
    let rayOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.38;

      rotation += 0.0003;
      rayOffset += 0.001;

      // 1. Subtle Golden Shimmer Ray passing across
      const rayGradient = ctx.createLinearGradient(
        cx + Math.cos(rayOffset) * baseRadius,
        cy + Math.sin(rayOffset) * baseRadius,
        cx - Math.cos(rayOffset) * baseRadius,
        cy - Math.sin(rayOffset) * baseRadius
      );
      rayGradient.addColorStop(0, 'rgba(196, 154, 69, 0)');
      rayGradient.addColorStop(0.5, 'rgba(196, 154, 69, 0.025)');
      rayGradient.addColorStop(1, 'rgba(196, 154, 69, 0)');

      ctx.fillStyle = rayGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Concentric Astronomical / Sacred Manuscript Geometry
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // Outermost concentric ring
      ctx.strokeStyle = 'rgba(217, 205, 180, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Dashed planetary orbit ring
      ctx.setLineDash([4, 16]);
      ctx.strokeStyle = 'rgba(196, 154, 69, 0.05)';
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner astrological cross markers
      ctx.strokeStyle = 'rgba(217, 205, 180, 0.03)';
      ctx.beginPath();
      ctx.moveTo(-baseRadius * 0.9, 0);
      ctx.lineTo(baseRadius * 0.9, 0);
      ctx.moveTo(0, -baseRadius * 0.9);
      ctx.lineTo(0, baseRadius * 0.9);
      ctx.stroke();

      // Interlocking subtle 12-point star nodes
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x = Math.cos(angle) * (baseRadius * 0.82);
        const y = Math.sin(angle) * (baseRadius * 0.82);
        ctx.fillStyle = 'rgba(196, 154, 69, 0.06)';
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 3. Floating Dust & Parchment Ink Motes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(237, 229, 211, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`sacred-ceremony-canvas ${showGeometry ? 'opacity-100' : 'opacity-0'}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'opacity 3.5s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    />
  );
}
