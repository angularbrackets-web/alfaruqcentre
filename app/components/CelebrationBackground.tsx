"use client";

import { motion } from "framer-motion";

export function CelebrationBackground({ type = 'particles' }: { type?: 'none' | 'particles' | 'fireworks' }) {
  if (type === 'none') return null;

  if (type === 'fireworks') {
    return <FireworksAnimation />;
  }

  return <ParticlesAnimation />;
}

function ParticlesAnimation() {
  // We use deterministic values to avoid React hydration mismatches between Server and Client
  const particles = Array.from({ length: 15 }).map((_, i) => {
    // Pseudo-random generation based on index
    const size = (i % 3) * 1.5 + 2; // 2px to 5px
    const left = (i * 23) % 100; // 0% to 100% spread
    const delay = (i * 0.3) % 5; // Staggered delays
    const duration = 12 + (i % 5) * 2.5; // 12s to 22s duration
    const driftX1 = (i % 2 === 0 ? 1 : -1) * ((i * 10) % 40); 
    const driftX2 = driftX1 * -1; // Drift back

    return { id: i, size, left, delay, duration, driftX1, driftX2 };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Ambient Orbs */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
        }}
        initial={{ x: "-10%", y: "20%", opacity: 0 }}
        animate={{
          x: ["-10%", "20%", "-5%", "-10%"],
          y: ["20%", "40%", "10%", "20%"],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          right: "-15%",
          bottom: "-20%",
        }}
        animate={{
          x: ["0%", "-20%", "10%", "0%"],
          y: ["0%", "-30%", "-10%", "0%"],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Magic Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#C9A84C]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: "-5%",
            filter: "blur(1px)",
            boxShadow: "0 0 12px 2px rgba(201,168,76,0.5)",
          }}
          initial={{ y: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: ["0vh", "-110vh"],
            opacity: [0, 0.8, 1, 0],
            scale: [0.5, 1, 1, 0.5],
            x: [0, p.driftX1, p.driftX2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function FireworksAnimation() {
  // Pre-calculated multiple bursts
  const bursts = [
    { id: 1, x: 25, y: 30, delay: 0.5, color: "#C9A84C" },
    { id: 2, x: 75, y: 40, delay: 1.8, color: "#ffffff" },
    { id: 3, x: 50, y: 15, delay: 3.5, color: "#F5E0A0" },
    { id: 4, x: 15, y: 55, delay: 5.2, color: "#C9A84C" },
    { id: 5, x: 85, y: 65, delay: 7.0, color: "#ffffff" },
    { id: 6, x: 40, y: 80, delay: 8.5, color: "#F5E0A0" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bursts.map((b) => (
        <FireworkBurst key={b.id} {...b} />
      ))}
    </div>
  );
}

function FireworkBurst({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  const particles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    // Varying distances to make it look like a spherical explosion with depth
    const distance = 60 + (i % 3) * 35; 
    const dx = Math.cos((angle * Math.PI) / 180) * distance;
    const dy = Math.sin((angle * Math.PI) / 180) * distance;
    return { id: i, dx, dy };
  });

  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            backgroundColor: color,
            boxShadow: `0 0 10px 2px ${color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: [0, p.dx],
            y: [0, p.dy + 40], // add gravity drop at the end
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2.2,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 8.5, // 10.7s total cycle
            delay: delay,
          }}
        />
      ))}
      
      {/* Center explosion flash */}
      <motion.div
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 80,
          height: 80,
          background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 0] }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 9.9, // Match the cycle speed
          delay: delay,
        }}
      />
    </div>
  );
}
