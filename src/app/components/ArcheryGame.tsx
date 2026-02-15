import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ArcheryGameProps {
  onNavigate: (screen: string) => void;
}

export function ArcheryGame({ onNavigate }: ArcheryGameProps) {
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [arrows, setArrows] = useState(3);
  const [windSpeed] = useState(Math.floor(Math.random() * 16 - 8));
  
  const [aimPosition, setAimPosition] = useState({ x: 50, y: 50 });
  const [isShooting, setIsShooting] = useState(false);
  const [arrow, setArrow] = useState<{ x: number; y: number } | null>(null);
  const [lastHitScore, setLastHitScore] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || isShooting) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    
    setAimPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleTouchEnd = () => {
    if (isShooting || arrows === 0) return;
    
    shoot();
  };

  const shoot = () => {
    setIsShooting(true);
    setArrows(prev => prev - 1);
    
    const drift = (windSpeed / 10) * 5;
    const finalX = aimPosition.x + drift + (Math.random() - 0.5) * 3;
    const finalY = aimPosition.y + (Math.random() - 0.5) * 3;
    
    setArrow({ x: finalX, y: finalY });
    
    setTimeout(() => {
      const distanceFromCenter = Math.sqrt(
        Math.pow(finalX - 50, 2) + Math.pow(finalY - 50, 2)
      );
      
      let points = 0;
      if (distanceFromCenter < 4) points = 10;
      else if (distanceFromCenter < 8) points = 9;
      else if (distanceFromCenter < 12) points = 8;
      else if (distanceFromCenter < 16) points = 7;
      else if (distanceFromCenter < 20) points = 6;
      else if (distanceFromCenter < 24) points = 5;
      else if (distanceFromCenter < 28) points = 4;
      else if (distanceFromCenter < 32) points = 3;
      
      setLastHitScore(points);
      setMyScore(prev => prev + points);
      
      setTimeout(() => {
        setArrow(null);
        setLastHitScore(null);
        setIsShooting(false);
        
        if (arrows - 1 === 0) {
          setTimeout(() => {
            const oppScore = Math.floor(Math.random() * 25) + 5;
            setOpponentScore(prev => prev + oppScore);
            
            if (round < 3) {
              setRound(prev => prev + 1);
              setArrows(3);
            }
          }, 1000);
        }
      }, 2000);
    }, 800);
  };

  // Matrix rain characters
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-black">
      {/* MATRIX DIGITAL RAIN BACKGROUND */}
      
      {/* Dark gradient base */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, #001a00 0%, #000d00 50%, #000000 100%)'
      }} />
      
      {/* Matrix falling code */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-sm font-mono whitespace-pre"
            style={{
              left: `${(i / 30) * 100}%`,
              color: i % 3 === 0 ? '#00ff41' : i % 3 === 1 ? '#00d936' : '#00b32c',
              textShadow: '0 0 8px currentColor',
              filter: 'blur(0.5px)'
            }}
            animate={{
              y: ['0%', '100%']
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            {Array.from({ length: 20 }, () => 
              matrixChars[Math.floor(Math.random() * matrixChars.length)]
            ).join('\n')}
          </motion.div>
        ))}
      </div>
      
      {/* Circuit board pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Horizontal lines */}
              <line x1="0" y1="50" x2="80" y2="50" stroke="#00ff41" strokeWidth="1"/>
              <line x1="120" y1="50" x2="200" y2="50" stroke="#00ff41" strokeWidth="1"/>
              <line x1="0" y1="150" x2="60" y2="150" stroke="#00ff41" strokeWidth="1"/>
              <line x1="140" y1="150" x2="200" y2="150" stroke="#00ff41" strokeWidth="1"/>
              {/* Vertical lines */}
              <line x1="50" y1="0" x2="50" y2="80" stroke="#00ff41" strokeWidth="1"/>
              <line x1="50" y1="120" x2="50" y2="200" stroke="#00ff41" strokeWidth="1"/>
              <line x1="150" y1="0" x2="150" y2="60" stroke="#00ff41" strokeWidth="1"/>
              <line x1="150" y1="140" x2="150" y2="200" stroke="#00ff41" strokeWidth="1"/>
              {/* Nodes */}
              <circle cx="50" cy="50" r="3" fill="#00ff41"/>
              <circle cx="150" cy="50" r="3" fill="#00ff41"/>
              <circle cx="50" cy="150" r="3" fill="#00ff41"/>
              <circle cx="150" cy="150" r="3" fill="#00ff41"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>
      
      {/* Scanning lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, #00ff4180, transparent)',
            boxShadow: '0 0 20px #00ff41'
          }}
          animate={{
            y: ['0%', '100%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2.7
          }}
        />
      ))}
      
      {/* Digital hexagons floating */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '40px',
            height: '40px',
            border: '2px solid #00ff41',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            opacity: 0.2
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 1.5
          }}
        />
      ))}
      
      {/* Glowing particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: '#00ff41',
            boxShadow: '0 0 8px #00ff41',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}

      {/* Top info */}
      <div className="p-4 flex items-center justify-between relative z-10">
        <div className="px-4 py-2 rounded-lg" style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #00ff41',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 10px rgba(0, 255, 65, 0.1)'
        }}>
          <p className="text-sm font-bold font-mono" style={{ 
            color: '#00ff41',
            textShadow: '0 0 10px #00ff41'
          }}>
            R {round}/3
          </p>
        </div>
        
        <div className="px-4 py-2 rounded-lg" style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #00ff41',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 10px rgba(0, 255, 65, 0.1)'
        }}>
          <p className="text-sm font-bold font-mono" style={{ 
            color: '#00ff41',
            textShadow: '0 0 10px #00ff41'
          }}>
            {arrows}/3 ▶
          </p>
        </div>
        
        <div className="px-4 py-2 rounded-lg" style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #00ff41',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 10px rgba(0, 255, 65, 0.1)'
        }}>
          <p className="text-sm font-bold font-mono" style={{ 
            color: '#00ff41',
            textShadow: '0 0 10px #00ff41'
          }}>
            {windSpeed > 0 ? '▶' : '◀'} {Math.abs(windSpeed)}
          </p>
        </div>
      </div>

      {/* Score */}
      <div className="px-6 py-3 flex justify-center gap-12 relative z-10">
        <div className="text-center">
          <p className="text-xs font-mono mb-1" style={{ 
            color: '#00ff41',
            opacity: 0.6 
          }}>
            YOU
          </p>
          <motion.p 
            className="text-4xl font-bold font-mono" 
            style={{ 
              color: '#00ff41',
              textShadow: '0 0 20px #00ff41'
            }}
            animate={{
              textShadow: [
                '0 0 15px #00ff41',
                '0 0 30px #00ff41',
                '0 0 15px #00ff41'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            {myScore}
          </motion.p>
        </div>
        <div className="text-center">
          <p className="text-xs font-mono mb-1" style={{ 
            color: '#00ff41',
            opacity: 0.4 
          }}>
            OPP
          </p>
          <p className="text-4xl font-bold font-mono" style={{ 
            color: '#00ff41',
            opacity: 0.6,
            textShadow: '0 0 10px #00ff41'
          }}>
            {opponentScore}
          </p>
        </div>
      </div>

      {/* Target area */}
      <div 
        ref={containerRef}
        className="flex-1 relative select-none"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Target with digital glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[10, 9, 8, 7, 6, 5, 4, 3].map((score, index) => (
            <motion.div
              key={score}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: `${(11 - score) * 30}px`,
                height: `${(11 - score) * 30}px`,
                border: `2px solid ${score === 10 ? '#00ff41' : score % 2 === 0 ? '#00ff41' : '#00d936'}`,
                background: score === 10 
                  ? 'radial-gradient(circle, rgba(0, 255, 65, 0.3), transparent)'
                  : score % 2 === 0
                  ? 'rgba(0, 255, 65, 0.05)'
                  : 'rgba(0, 217, 54, 0.03)',
                boxShadow: score === 10 
                  ? '0 0 30px #00ff41, inset 0 0 20px rgba(0, 255, 65, 0.2)' 
                  : `0 0 10px ${score % 2 === 0 ? '#00ff41' : '#00d936'}`
              }}
              animate={score === 10 ? {
                boxShadow: [
                  '0 0 20px #00ff41, inset 0 0 15px rgba(0, 255, 65, 0.2)',
                  '0 0 40px #00ff41, inset 0 0 25px rgba(0, 255, 65, 0.3)',
                  '0 0 20px #00ff41, inset 0 0 15px rgba(0, 255, 65, 0.2)'
                ]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          ))}
          
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{
              background: '#00ff41',
              boxShadow: '0 0 30px #00ff41, 0 0 60px #00ff41'
            }}
            animate={{
              scale: [1, 1.5, 1],
              boxShadow: [
                '0 0 20px #00ff41, 0 0 40px #00ff41',
                '0 0 40px #00ff41, 0 0 80px #00ff41',
                '0 0 20px #00ff41, 0 0 40px #00ff41'
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
        </div>

        {/* Crosshair with digital style */}
        {!isShooting && arrows > 0 && (
          <div
            className="absolute pointer-events-none z-20"
            style={{
              left: `${aimPosition.x}%`,
              top: `${aimPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative w-16 h-16">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ 
                borderColor: '#00ff41',
                boxShadow: '0 0 10px #00ff41'
              }} />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ 
                borderColor: '#00ff41',
                boxShadow: '0 0 10px #00ff41'
              }} />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ 
                borderColor: '#00ff41',
                boxShadow: '0 0 10px #00ff41'
              }} />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ 
                borderColor: '#00ff41',
                boxShadow: '0 0 10px #00ff41'
              }} />
              
              {/* Center dot */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{
                  background: '#00ff41',
                  boxShadow: '0 0 15px #00ff41'
                }}
                animate={{
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              />
            </div>
            
            {/* Scanning ring */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                border: '2px solid #00ff41',
                boxShadow: '0 0 20px #00ff41'
              }}
              animate={{
                width: [30, 60, 30],
                height: [30, 60, 30],
                opacity: [0.8, 0.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </div>
        )}

        {/* Arrow hit */}
        {arrow && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute z-30"
            style={{
              left: `${arrow.x}%`,
              top: `${arrow.y}%`,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 0 15px #00ff41)'
            }}
          >
            <div className="text-4xl">🏹</div>
          </motion.div>
        )}

        {/* Score popup */}
        <AnimatePresence>
          {lastHitScore !== null && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
            >
              <div className="px-10 py-5 rounded-lg font-mono" style={{
                background: 'rgba(0, 0, 0, 0.95)',
                border: '3px solid #00ff41',
                boxShadow: '0 0 50px #00ff41, inset 0 0 30px rgba(0, 255, 65, 0.2)'
              }}>
                <p className="text-6xl font-black" style={{ 
                  color: '#00ff41',
                  textShadow: '0 0 30px #00ff41, 0 0 60px #00ff41'
                }}>
                  {lastHitScore === 10 ? '🎯' : lastHitScore}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instruction */}
      {!isShooting && arrows > 0 && (
        <div className="p-6 text-center relative z-10">
          <motion.p 
            className="text-base font-mono" 
            style={{ 
              color: '#00ff41',
              textShadow: '0 0 10px #00ff41'
            }}
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            [ DRAG_TO_AIM | RELEASE_TO_FIRE ]
          </motion.p>
        </div>
      )}
    </div>
  );
}
