import { useState } from "react";
import { motion } from "motion/react";

interface ThunderGameProps {
  onNavigate: (screen: string) => void;
}

export function ThunderGame({ onNavigate }: ThunderGameProps) {
  const [myHealth, setMyHealth] = useState(3);
  const [opponentHealth, setOpponentHealth] = useState(3);
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(50);
  const [windSpeed] = useState(Math.floor(Math.random() * 30 - 15));
  const [isShooting, setIsShooting] = useState(false);
  const [projectile, setProjectile] = useState<{ x: number; y: number } | null>(null);

  const shoot = () => {
    setIsShooting(true);
    
    const trajectory: Array<{ x: number; y: number }> = [];
    const steps = 60;
    const angleRad = (angle * Math.PI) / 180;
    const velocity = power * 1.2;
    const gravity = 0.5;
    const startX = 10;
    const startY = 70;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / 10;
      const windEffect = (windSpeed / 15) * t * 0.3;
      
      const x = startX + (velocity * Math.cos(angleRad) * t * 0.8) + windEffect;
      const y = startY - (velocity * Math.sin(angleRad) * t - gravity * t * t);
      
      if (y >= 70) break;
      trajectory.push({ x, y });
    }
    
    let step = 0;
    const animationInterval = setInterval(() => {
      if (step < trajectory.length) {
        setProjectile(trajectory[step]);
        step++;
      } else {
        clearInterval(animationInterval);
        setProjectile(null);
        
        const hit = Math.random() > 0.5;
        if (hit) {
          setOpponentHealth(prev => Math.max(0, prev - 1));
        }
        
        setTimeout(() => {
          const enemyHit = Math.random() > 0.5;
          if (enemyHit) {
            setMyHealth(prev => Math.max(0, prev - 1));
          }
          setIsShooting(false);
        }, 1500);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: '#000' }}>
      {/* SYNTHWAVE 80s NEON CITY BACKGROUND */}
      
      {/* Starry night sky */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at top, #1a0033 0%, #0d001a 50%, #000000 100%)'
      }} />
      
      {/* Stars */}
      {[...Array(120)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() > 0.8 ? '2px' : '1px',
            height: Math.random() > 0.8 ? '2px' : '1px',
            background: Math.random() > 0.7 ? '#ff00ff' : Math.random() > 0.5 ? '#00ffff' : '#ffffff',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            boxShadow: Math.random() > 0.7 ? '0 0 4px currentColor' : 'none'
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
      
      {/* Neon grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(138, 43, 226, 0.1) 50%, rgba(75, 0, 130, 0.2) 100%)',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'bottom'
      }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="neonGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ff00ff" strokeWidth="0.5" opacity="0.6"/>
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00ffff" strokeWidth="0.5" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neonGrid)" />
        </svg>
      </div>
      
      {/* City silhouette with neon windows */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-60">
        {/* Buildings */}
        {[
          { left: '5%', width: 60, height: 140, color: '#ff00ff' },
          { left: '12%', width: 45, height: 100, color: '#00ffff' },
          { left: '18%', width: 55, height: 120, color: '#ff00ff' },
          { left: '25%', width: 70, height: 150, color: '#ff00ff' },
          { left: '35%', width: 50, height: 110, color: '#00ffff' },
          { left: '45%', width: 65, height: 130, color: '#ff00ff' },
          { left: '55%', width: 55, height: 115, color: '#00ffff' },
          { left: '65%', width: 75, height: 145, color: '#ff00ff' },
          { left: '75%', width: 50, height: 105, color: '#ff00ff' },
          { left: '85%', width: 60, height: 125, color: '#00ffff' },
        ].map((building, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: building.left,
              width: building.width,
              height: building.height,
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 0, 51, 0.8) 100%)`,
              borderTop: `2px solid ${building.color}`,
              boxShadow: `0 -2px 20px ${building.color}40`
            }}
          >
            {/* Windows */}
            <div className="grid grid-cols-3 gap-2 p-2">
              {[...Array(9)].map((_, j) => (
                <motion.div
                  key={j}
                  className="w-3 h-3"
                  style={{
                    background: Math.random() > 0.6 ? building.color : 'transparent',
                    boxShadow: Math.random() > 0.6 ? `0 0 8px ${building.color}` : 'none'
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Neon light beams */}
      <motion.div
        className="absolute top-0 w-1 h-full opacity-20"
        style={{
          left: '30%',
          background: 'linear-gradient(180deg, #ff00ff 0%, transparent 60%)',
          filter: 'blur(2px)'
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      />
      <motion.div
        className="absolute top-0 w-1 h-full opacity-20"
        style={{
          left: '70%',
          background: 'linear-gradient(180deg, #00ffff 0%, transparent 60%)',
          filter: 'blur(2px)'
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 1
        }}
      />
      
      {/* Floating neon particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? '#ff00ff' : '#00ffff',
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 50}%`,
            boxShadow: `0 0 10px currentColor`,
            filter: 'blur(1px)'
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Top info */}
      <div className="p-4 flex items-center justify-between relative z-10">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i} 
              className="w-10 h-10 rounded-lg" 
              style={{
                background: i < myHealth 
                  ? 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)'
                  : 'rgba(100, 100, 100, 0.3)',
                boxShadow: i < myHealth ? '0 0 15px #ff00ff' : 'none',
                border: '2px solid rgba(255, 0, 255, 0.5)'
              }}
              animate={i < myHealth ? {
                boxShadow: ['0 0 10px #ff00ff', '0 0 20px #ff00ff', '0 0 10px #ff00ff']
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>
        
        <div className="px-5 py-2 rounded-full" style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
        }}>
          <p className="text-sm font-bold" style={{ 
            fontFamily: 'Arial, sans-serif',
            color: '#00ffff',
            textShadow: '0 0 10px #00ffff'
          }}>
            Wind: {windSpeed > 0 ? '→' : '←'} {Math.abs(windSpeed)} km/h
          </p>
        </div>
        
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i} 
              className="w-10 h-10 rounded-lg" 
              style={{
                background: i < opponentHealth 
                  ? 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)'
                  : 'rgba(100, 100, 100, 0.3)',
                boxShadow: i < opponentHealth ? '0 0 15px #00ffff' : 'none',
                border: '2px solid rgba(0, 255, 255, 0.5)'
              }}
              animate={i < opponentHealth ? {
                boxShadow: ['0 0 10px #00ffff', '0 0 20px #00ffff', '0 0 10px #00ffff']
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 relative">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-24" style={{ 
            background: 'linear-gradient(180deg, transparent 0%, rgba(138, 43, 226, 0.3) 100%)',
            borderTop: '2px solid #ff00ff',
            boxShadow: '0 -2px 30px #ff00ff80'
          }} />
          
          {/* My tank */}
          <div className="absolute bottom-24 left-[10%] w-14 h-10" style={{ transform: 'translateX(-50%)' }}>
            <div className="w-full h-full rounded-lg relative" style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.6), rgba(138, 43, 226, 0.6))',
              border: '2px solid #ff00ff',
              boxShadow: '0 0 20px #ff00ff, inset 0 0 10px rgba(255, 0, 255, 0.3)'
            }}>
              <motion.div 
                className="absolute top-2 right-0 h-2 origin-left rounded-r"
                style={{ 
                  width: '32px',
                  background: 'linear-gradient(90deg, #ff00ff, #ff0080)',
                  transform: `rotate(-${angle}deg)`,
                  boxShadow: '0 0 10px #ff00ff'
                }}
              />
            </div>
            <motion.div 
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl"
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              style={{
                filter: 'drop-shadow(0 0 10px #ff00ff)'
              }}
            >
              🎸
            </motion.div>
          </div>
          
          {/* Opponent tank */}
          <div className="absolute bottom-24 right-[10%] w-14 h-10" style={{ transform: 'translateX(50%)' }}>
            <div className="w-full h-full rounded-lg relative" style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.6), rgba(0, 139, 139, 0.6))',
              border: '2px solid #00ffff',
              boxShadow: '0 0 20px #00ffff, inset 0 0 10px rgba(0, 255, 255, 0.3)'
            }} />
            <motion.div 
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl"
              animate={{
                rotate: [0, -5, 5, 0],
                y: [0, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
              style={{
                filter: 'drop-shadow(0 0 10px #00ffff)'
              }}
            >
              ⚡
            </motion.div>
          </div>
          
          {/* Neon obstacles */}
          {[
            { left: '30%', height: 50, color: '#ff00ff' },
            { left: '50%', height: 70, color: '#00ffff' },
            { left: '70%', height: 45, color: '#ff00ff' }
          ].map((obs, i) => (
            <motion.div
              key={i}
              className="absolute bottom-24 rounded-t-lg"
              style={{
                left: obs.left,
                width: '40px',
                height: `${obs.height}px`,
                transform: 'translateX(-50%)',
                background: `linear-gradient(180deg, ${obs.color}40 0%, ${obs.color}20 100%)`,
                border: `2px solid ${obs.color}`,
                borderBottom: 'none',
                boxShadow: `0 0 20px ${obs.color}, inset 0 0 15px ${obs.color}40`
              }}
              animate={{
                boxShadow: [
                  `0 0 15px ${obs.color}, inset 0 0 10px ${obs.color}40`,
                  `0 0 30px ${obs.color}, inset 0 0 20px ${obs.color}60`,
                  `0 0 15px ${obs.color}, inset 0 0 10px ${obs.color}40`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xl"
                   style={{ filter: `drop-shadow(0 0 5px ${obs.color})` }}>
                🎸
              </div>
            </motion.div>
          ))}
        </div>

        {/* Projectile */}
        {projectile && (
          <motion.div
            className="absolute text-4xl z-50"
            style={{
              left: `${projectile.x}%`,
              top: `${projectile.y}%`,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 0 15px #ff00ff) drop-shadow(0 0 25px #ff00ff)'
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            🎸
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4 relative z-10" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 30%)',
        borderTop: '2px solid rgba(255, 0, 255, 0.3)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold" style={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#00ffff',
              textShadow: '0 0 8px #00ffff'
            }}>
              Angle
            </label>
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#00ffff',
              background: 'rgba(0, 255, 255, 0.2)',
              border: '1px solid rgba(0, 255, 255, 0.5)',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
            }}>
              {angle}°
            </span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(0, 255, 255, 0.3)'
          }}>
            <div 
              className="h-full rounded-full transition-all"
              style={{
                width: `${(angle / 80) * 100}%`,
                background: 'linear-gradient(90deg, #00ffff, #0080ff)',
                boxShadow: '0 0 15px #00ffff'
              }}
            />
            <input
              type="range"
              min="10"
              max="80"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              disabled={isShooting}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold" style={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#ff00ff',
              textShadow: '0 0 8px #ff00ff'
            }}>
              Power
            </label>
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#ff00ff',
              background: 'rgba(255, 0, 255, 0.2)',
              border: '1px solid rgba(255, 0, 255, 0.5)',
              boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)'
            }}>
              {power}%
            </span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 0, 255, 0.3)'
          }}>
            <div 
              className="h-full rounded-full transition-all"
              style={{
                width: `${power}%`,
                background: 'linear-gradient(90deg, #ff00ff, #ff0080)',
                boxShadow: '0 0 15px #ff00ff'
              }}
            />
            <input
              type="range"
              min="20"
              max="100"
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              disabled={isShooting}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={shoot}
          disabled={isShooting}
          className="w-full py-5 rounded-2xl font-bold text-xl disabled:opacity-50 relative overflow-hidden"
          style={{
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
            color: '#000',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(255, 0, 255, 0.6), 0 0 50px rgba(0, 255, 255, 0.4)'
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                'linear-gradient(90deg, transparent, transparent, transparent)'
              ],
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
          <span className="relative z-10">
            {isShooting ? 'FIRING...' : 'FIRE 🎸'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
