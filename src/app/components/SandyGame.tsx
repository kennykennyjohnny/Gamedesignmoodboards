import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SandyGameProps {
  onNavigate: (screen: string) => void;
}

interface Cup {
  id: number;
  x: number;
  y: number;
  hit: boolean;
}

export function SandyGame({ onNavigate }: SandyGameProps) {
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [isShooting, setIsShooting] = useState(false);
  
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [opponentCups, setOpponentCups] = useState<Cup[]>([
    { id: 0, x: 0, y: 0, hit: false },
    { id: 1, x: 1, y: 0, hit: false },
    { id: 2, x: 2, y: 0, hit: false },
    { id: 3, x: 3, y: 0, hit: false },
    { id: 4, x: 0.5, y: 1, hit: false },
    { id: 5, x: 1.5, y: 1, hit: false },
    { id: 6, x: 2.5, y: 1, hit: false },
    { id: 7, x: 1, y: 2, hit: false },
    { id: 8, x: 2, y: 2, hit: false },
    { id: 9, x: 1.5, y: 3, hit: false },
  ]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMyTurn || isShooting) return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    });
    setDragCurrent({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragCurrent({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    });
  };

  const handleTouchEnd = () => {
    if (!dragStart || !dragCurrent || !containerRef.current) return;
    
    const deltaX = dragCurrent.x - dragStart.x;
    const deltaY = dragCurrent.y - dragStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < 20) {
      setDragStart(null);
      setDragCurrent(null);
      return;
    }
    
    setIsShooting(true);
    setDragStart(null);
    setDragCurrent(null);
    
    const power = Math.min(distance / 200, 1.5);
    const angle = Math.atan2(-deltaY, deltaX);
    
    const trajectory: Array<{ x: number; y: number }> = [];
    const steps = 40;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = 50 + (Math.cos(angle) * power * t * 40);
      const y = 85 - (Math.sin(angle) * power * t * 80) + (t * t * 40);
      trajectory.push({ x, y });
    }
    
    let step = 0;
    const animationInterval = setInterval(() => {
      if (step < trajectory.length) {
        setBallPosition(trajectory[step]);
        step++;
      } else {
        clearInterval(animationInterval);
        
        const hit = power > 0.5 && power < 1.2 && Math.abs(angle) < 0.5;
        
        if (hit) {
          const availableCups = opponentCups.filter(c => !c.hit);
          if (availableCups.length > 0) {
            const targetCup = availableCups[Math.floor(Math.random() * availableCups.length)];
            setOpponentCups(prev => prev.map(c => c.id === targetCup.id ? { ...c, hit: true } : c));
            setMyScore(prev => prev + 1);
          }
        }
        
        setTimeout(() => {
          setBallPosition(null);
          setIsShooting(false);
          setIsMyTurn(false);
          
          setTimeout(() => {
            const availableCups = opponentCups.filter(c => !c.hit);
            if (availableCups.length > 0 && Math.random() > 0.4) {
              const targetCup = availableCups[Math.floor(Math.random() * availableCups.length)];
              setOpponentCups(prev => prev.map(c => c.id === targetCup.id ? { ...c, hit: true } : c));
              setOpponentScore(prev => prev + 1);
            }
            setTimeout(() => {
              setIsMyTurn(true);
            }, 800);
          }, 1000);
        }, 500);
      }
    }, 25);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden select-none"
      style={{ background: '#fef5e7' }}
    >
      {/* CÔTE D'AZUR SUNSET BACKGROUND */}
      
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #ffa07a 0%, #ffb6c1 25%, #ffd1dc 50%, #ffe4e1 75%, #fef5e7 100%)'
      }} />
      
      {/* Sun */}
      <motion.div
        className="absolute w-40 h-40 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, #ffcccb 0%, #ff9999 40%, transparent 70%)',
          left: '20%',
          top: '15%'
        }}
        animate={{
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
      />
      
      {/* Clouds */}
      <motion.div
        className="absolute w-32 h-12 rounded-full opacity-30"
        style={{ background: 'white', left: '10%', top: '10%', filter: 'blur(15px)' }}
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-40 h-14 rounded-full opacity-20"
        style={{ background: 'white', right: '15%', top: '20%', filter: 'blur(20px)' }}
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />
      
      {/* Palm trees silhouettes */}
      <div className="absolute bottom-0 left-10 w-16 h-48 opacity-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-32 bg-black rounded-t" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-2 bg-black rounded-full transform -rotate-45" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-black rounded-full transform -rotate-30" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-black rounded-full transform rotate-30" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-black rounded-full transform rotate-45" />
      </div>
      
      <div className="absolute bottom-0 right-16 w-20 h-56 opacity-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-40 bg-black rounded-t" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-28 h-2 bg-black rounded-full transform -rotate-40" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-2 bg-black rounded-full transform -rotate-25" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-2 bg-black rounded-full transform rotate-25" />
      </div>
      
      {/* Wooden deck texture at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-15">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wood" x="0" y="0" width="120" height="20" patternUnits="userSpaceOnUse">
              <rect width="120" height="20" fill="#8b6f47"/>
              <line x1="0" y1="0" x2="120" y2="0" stroke="#654321" strokeWidth="2"/>
              <line x1="0" y1="20" x2="120" y2="20" stroke="#654321" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wood)" />
        </svg>
      </div>

      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}

      {/* Score */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="px-8 py-3 rounded-full" style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(255, 182, 193, 0.3)'
        }}>
          <p className="text-3xl font-bold" style={{ 
            fontFamily: 'Arial, sans-serif',
            color: '#ff69b4'
          }}>
            {myScore} - {opponentScore}
          </p>
        </div>
      </div>

      {/* Game table */}
      <div 
        ref={containerRef}
        className="relative h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: '1200px' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            transform: 'rotateX(50deg)',
            transformOrigin: 'center center',
          }}
        >
          {/* Table line */}
          <div className="absolute top-1/2 left-0 right-0 h-1" style={{
            background: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 2px 10px rgba(255, 255, 255, 0.3)'
          }} />

          {/* Opponent cups */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2" style={{ width: '300px' }}>
            {opponentCups.map((cup) => (
              <AnimatePresence key={cup.id}>
                {!cup.hit && (
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="absolute"
                    style={{
                      left: `${cup.x * 65}px`,
                      top: `${cup.y * 55}px`,
                      width: '55px',
                      height: '60px',
                    }}
                  >
                    <div className="relative w-full h-full">
                      {/* Glass reflection */}
                      <div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-b-3xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 192, 203, 0.9) 0%, rgba(255, 182, 193, 0.95) 100%)',
                          clipPath: 'polygon(22% 0%, 78% 0%, 88% 100%, 12% 100%)',
                          boxShadow: '0 6px 20px rgba(255, 105, 180, 0.4), inset -2px -2px 8px rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        <div 
                          className="absolute top-2 left-2 w-4 h-8 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, transparent 60%)',
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* Ball */}
          {ballPosition && (
            <motion.div
              className="absolute rounded-full"
              style={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
                width: '24px',
                height: '24px',
                background: 'radial-gradient(circle at 30% 30%, #ffffff, #ffcccb)',
                boxShadow: '0 4px 20px rgba(255, 182, 193, 0.8), inset -2px -2px 6px rgba(0, 0, 0, 0.1)',
                transform: 'translate(-50%, -50%)',
                zIndex: 100
              }}
            />
          )}

          {/* Drag arrow */}
          {dragStart && dragCurrent && !isShooting && (
            <div 
              className="absolute z-50 pointer-events-none"
              style={{
                left: dragStart.x,
                top: dragStart.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <svg width="200" height="200" style={{ overflow: 'visible' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="rgba(255, 105, 180, 0.8)" />
                  </marker>
                </defs>
                <line
                  x1="100"
                  y1="100"
                  x2={100 + (dragCurrent.x - dragStart.x)}
                  y2={100 + (dragCurrent.y - dragStart.y)}
                  stroke="rgba(255, 105, 180, 0.8)"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Swipe zone indicator */}
      {isMyTurn && !isShooting && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40">
          <motion.div 
            className="px-10 py-4 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 25px rgba(255, 182, 193, 0.4)'
            }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-lg font-bold" style={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#ff69b4'
            }}>
              Swipe to throw
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
