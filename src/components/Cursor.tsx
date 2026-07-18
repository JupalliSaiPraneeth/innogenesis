import { useEffect, useRef } from 'react';

interface CursorProps {
  theme?: 'light' | 'dark';
}

export default function Cursor({ theme = 'dark' }: CursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Glow particle canvas only (custom cursor elements removed)
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      decay: number;
      sizeType: 'small' | 'medium' | 'large';
      driftSpeed: number;
    }

    const particles: Particle[] = [];
    let lastX = width / 2;
    let lastY = height / 2;
    let lastSpawnTime = 0;

    const spawnParticle = (x: number, y: number, burst: boolean) => {
      // Pick size category like in index2.html
      const rand = Math.random();
      let sizeType: 'small' | 'medium' | 'large' = 'small';
      let r = 1;
      let alpha = 0.5;
      let decay = 0.012;

      if (burst) {
        sizeType = rand > 0.6 ? 'large' : rand > 0.2 ? 'medium' : 'small';
      } else {
        sizeType = rand > 0.85 ? 'large' : rand > 0.4 ? 'medium' : 'small';
      }

      if (sizeType === 'small') {
        r = 1.0;
        alpha = burst ? 0.8 : 0.5;
        decay = burst ? 0.015 : 0.02;
      } else if (sizeType === 'medium') {
        r = 1.75;
        alpha = burst ? 0.95 : 0.8;
        decay = burst ? 0.012 : 0.016;
      } else {
        r = 2.75; // translates to 5.5px diameter
        alpha = 1.0;
        decay = burst ? 0.008 : 0.012;
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? Math.random() * 3.5 + 1.2 : Math.random() * 0.8 + 0.2;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r,
        alpha,
        decay,
        sizeType,
        driftSpeed: Math.random() * 0.02
      });
    };

    const handleSparksMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const dist = Math.hypot(clientX - lastX, clientY - lastY);
      const now = performance.now();

      if (dist > 4 && now - lastSpawnTime > 12) {
        const count = Math.min(3, Math.ceil(dist / 12));
        for (let i = 0; i < count; i++) {
          spawnParticle(clientX, clientY, false);
        }
        lastSpawnTime = now;
        lastX = clientX;
        lastY = clientY;
      }
    };

    const handleSparksBurst = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Large burst of 22 star dots
      for (let i = 0; i < 22; i++) {
        spawnParticle(clientX, clientY, true);
      }
      lastX = clientX;
      lastY = clientY;
    };

    window.addEventListener('mousemove', handleSparksMove, { passive: true });
    window.addEventListener('touchmove', handleSparksMove, { passive: true });
    window.addEventListener('mousedown', handleSparksBurst, { passive: true });
    window.addEventListener('touchstart', handleSparksBurst, { passive: true });

    let canvasAnimId: number;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        
        // Twinkling drift effect (from index2.html's floating stars feel)
        p.vy -= p.driftSpeed; 
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        
        const rgb = theme === 'light' ? '0, 0, 0' : '255, 255, 255';
        
        // If large star, render custom box shadow-like radial gradient glow
        if (p.sizeType === 'large') {
          ctx.shadowColor = theme === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.5)';
          ctx.shadowBlur = 6;
          ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        } else if (p.sizeType === 'medium') {
          ctx.fillStyle = `rgba(${rgb}, ${p.alpha * 0.85})`;
        } else {
          ctx.fillStyle = `rgba(${rgb}, ${p.alpha * 0.6})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Capacity guard
      if (particles.length > 250) {
        particles.splice(0, particles.length - 250);
      }

      canvasAnimId = requestAnimationFrame(tick);
    };
    canvasAnimId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleSparksMove);
      window.removeEventListener('touchmove', handleSparksMove);
      window.removeEventListener('mousedown', handleSparksBurst);
      window.removeEventListener('touchstart', handleSparksBurst);

      cancelAnimationFrame(canvasAnimId);
    };
  }, [theme]);

  return (
    <>
      {/* Spark particles canvas only (cursor visuals removed) */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full pointer-events-none z-[10000] ${theme === 'light' ? 'mix-blend-multiply' : 'mix-blend-screen'}`}
      />
    </>
  );
}
