import { useState, useEffect, useRef, useCallback } from 'react';
import { SENSORS, generateVariant } from '../data/mockData';

/**
 * useAutoRefresh — simulates live data updates every 30 seconds
 */
export function useAutoRefresh(initialSensors, intervalMs = 30000) {
  const [sensors, setSensors] = useState(initialSensors);
  const [countdown, setCountdown] = useState(intervalMs / 1000);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setSensors(prev => prev.map(s => generateVariant(s)));
    setCountdown(intervalMs / 1000);
    setTimeout(() => setIsRefreshing(false), 800);
  }, [intervalMs]);

  useEffect(() => {
    intervalRef.current = setInterval(refresh, intervalMs);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? intervalMs / 1000 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, [refresh, intervalMs]);

  return { sensors, countdown, isRefreshing, refresh };
}

/**
 * useParticles — simple particle effect for background canvas
 */
export function useParticles(canvasRef, aqiLevel) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Color based on AQI level
    const colorMap = {
      good: '34, 197, 94',
      moderate: '234, 179, 8',
      sensitive: '249, 115, 22',
      unhealthy: '239, 68, 68',
      veryUnhealthy: '168, 85, 247',
      hazardous: '190, 18, 60',
    };
    const color = colorMap[aqiLevel] || '59, 130, 246';

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.05,
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, aqiLevel]);
}
