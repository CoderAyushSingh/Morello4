import React, { useEffect, useRef } from 'react';

const SnowEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; radius: number; speed: number; opacity: number }[] = [];
        const particleCount = 40; // Reduced for performance

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.2, // Slower, more calming
                opacity: Math.random() * 0.4 + 0.1,
            });
        }

        let wind = 0;
        let targetWind = 0;

        const handleMouseMove = (e: MouseEvent) => {
            // Calculate wind based on cursor X position relative to center
            // Range: -1 (left) to 1 (right)
            const xRatio = (e.clientX / width) * 2 - 1;
            targetWind = xRatio * 2; // Max wind speed multiplier
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth wind transition
            wind += (targetWind - wind) * 0.05;

            particles.forEach((p) => {
                p.y += p.speed;
                p.x += wind * p.speed; // Wind affects lighter particles more effectively in real physics, but here uniform for style

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();

                // Wrap around
                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
                if (p.x > width) {
                    p.x = 0;
                } else if (p.x < 0) {
                    p.x = width;
                }
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default SnowEffect;
