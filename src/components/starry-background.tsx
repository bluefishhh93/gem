"use client"

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  size: number;
  top: number;
  left: number;
  initialOpacity: number;
  duration: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
}

const StarryBackground = (): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Create static stars array once and reuse
  const stars: Star[] = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      initialOpacity: 0.1 + Math.random() * 0.5,
      duration: 2 + Math.random() * 5
    }));
  }, []);

  // Handle shooting stars
  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      const newShootingStar: ShootingStar = {
        id: Date.now(),
        startX: Math.random() * 100,
        startY: Math.random() * 30,
      };
      
      setShootingStars(prev => [...prev, newShootingStar]);

      // Remove shooting star after animation
      setTimeout(() => {
        setShootingStars(prev => 
          prev.filter(star => star.id !== newShootingStar.id)
        );
      }, 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-purple-950/40 to-gray-950">
        {/* Static stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
            }}
            initial={{ opacity: star.initialOpacity }}
            animate={{ 
              opacity: [star.initialOpacity, 0.8, star.initialOpacity],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: star.duration,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-gradient-to-r from-white to-transparent"
            style={{
              height: "2px",
              width: "50px",
              top: `${star.startY}%`,
              left: `${star.startX}%`,
            }}
            initial={{
              opacity: 1,
              rotate: 45,
              scale: 0
            }}
            animate={{
              x: 200,
              y: 200,
              opacity: [1, 1, 0],
              scale: [0, 1, 1]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarryBackground;