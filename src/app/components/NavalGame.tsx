import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface NavalGameProps {
  onNavigate: (screen: string) => void;
}

type CellState = 'empty' | 'ship' | 'hit' | 'miss';

interface Cell {
  state: CellState;
  shipId?: number;
}

export function NavalGame({ onNavigate }: NavalGameProps) {
  const gridSize = 10;
  const [gamePhase, setGamePhase] = useState<'placement' | 'playing'>('placement');
  const [selectedShip, setSelectedShip] = useState<number | null>(0);
  const [shipOrientation, setShipOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [placedShips, setPlacedShips] = useState<number[]>([]);
  
  const ships = [
    { id: 0, length: 5, emoji: '🍾', name: 'Carrier' },
    { id: 1, length: 4, emoji: '🥃', name: 'Battleship' },
    { id: 2, length: 3, emoji: '🍷', name: 'Cruiser' },
    { id: 3, length: 3, emoji: '🍸', name: 'Submarine' },
    { id: 4, length: 2, emoji: '🥂', name: 'Destroyer' },
  ];
  
  const [myGrid, setMyGrid] = useState<Cell[][]>(() => 
    Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => ({ state: 'empty' as CellState }))
    )
  );
  
  const [opponentGrid, setOpponentGrid] = useState<Cell[][]>(() => {
    const grid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => ({ state: 'empty' as CellState }))
    );
    
    ships.forEach((ship, shipId) => {
      let placed = false;
      while (!placed) {
        const horizontal = Math.random() > 0.5;
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        
        if (horizontal && col + ship.length <= gridSize) {
          let canPlace = true;
          for (let i = 0; i < ship.length; i++) {
            if (grid[row][col + i].state === 'ship') canPlace = false;
          }
          if (canPlace) {
            for (let i = 0; i < ship.length; i++) {
              grid[row][col + i] = { state: 'ship', shipId };
            }
            placed = true;
          }
        } else if (!horizontal && row + ship.length <= gridSize) {
          let canPlace = true;
          for (let i = 0; i < ship.length; i++) {
            if (grid[row + i][col].state === 'ship') canPlace = false;
          }
          if (canPlace) {
            for (let i = 0; i < ship.length; i++) {
              grid[row + i][col] = { state: 'ship', shipId };
            }
            placed = true;
          }
        }
      }
    });
    
    return grid;
  });

  const canPlaceShip = (row: number, col: number, shipId: number): boolean => {
    const ship = ships[shipId];
    if (shipOrientation === 'horizontal' && col + ship.length > gridSize) return false;
    if (shipOrientation === 'vertical' && row + ship.length > gridSize) return false;
    
    for (let i = 0; i < ship.length; i++) {
      const checkRow = shipOrientation === 'horizontal' ? row : row + i;
      const checkCol = shipOrientation === 'horizontal' ? col + i : col;
      if (myGrid[checkRow][checkCol].state === 'ship') return false;
    }
    return true;
  };

  const placeShip = (row: number, col: number) => {
    if (selectedShip === null || placedShips.includes(selectedShip)) return;
    if (!canPlaceShip(row, col, selectedShip)) return;
    
    const ship = ships[selectedShip];
    setMyGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      for (let i = 0; i < ship.length; i++) {
        const placeRow = shipOrientation === 'horizontal' ? row : row + i;
        const placeCol = shipOrientation === 'horizontal' ? col + i : col;
        newGrid[placeRow][placeCol] = { state: 'ship', shipId: selectedShip };
      }
      return newGrid;
    });
    
    setPlacedShips(prev => [...prev, selectedShip]);
    setSelectedShip(ships.find(s => !placedShips.includes(s.id) && s.id !== selectedShip)?.id ?? null);
  };

  const handleCellClick = (row: number, col: number, isOpponentGrid: boolean) => {
    if (gamePhase === 'placement' && !isOpponentGrid) {
      placeShip(row, col);
    } else if (gamePhase === 'playing' && isOpponentGrid) {
      if (opponentGrid[row][col].state === 'hit' || opponentGrid[row][col].state === 'miss') return;
      
      setOpponentGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        const cell = newGrid[row][col];
        cell.state = cell.state === 'ship' ? 'hit' : 'miss';
        return newGrid;
      });
      
      setTimeout(() => {
        let hitRow, hitCol;
        do {
          hitRow = Math.floor(Math.random() * gridSize);
          hitCol = Math.floor(Math.random() * gridSize);
        } while (myGrid[hitRow][hitCol].state === 'hit' || myGrid[hitRow][hitCol].state === 'miss');
        
        setMyGrid(prev => {
          const newGrid = prev.map(r => r.map(c => ({ ...c })));
          const cell = newGrid[hitRow][hitCol];
          cell.state = cell.state === 'ship' ? 'hit' : 'miss';
          return newGrid;
        });
      }, 1000);
    }
  };

  const letters = 'ABCDEFGHIJ';

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: '#1a0f0a' }}>
      {/* WINE CELLAR BACKGROUND */}
      
      {/* Stone wall texture */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stone" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="48" height="48" x="0" y="0" fill="#3d2817" stroke="#2a1810" strokeWidth="2"/>
              <rect width="48" height="48" x="52" y="0" fill="#4a3219" stroke="#2a1810" strokeWidth="2"/>
              <rect width="48" height="48" x="0" y="52" fill="#4a3219" stroke="#2a1810" strokeWidth="2"/>
              <rect width="48" height="48" x="52" y="52" fill="#3d2817" stroke="#2a1810" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stone)" />
        </svg>
      </div>
      
      {/* Ambient warm glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, #d4af37 0%, #8b6f47 40%, transparent 70%)',
          left: '50%',
          top: '20%',
          transform: 'translateX(-50%)'
        }}
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity
        }}
      />
      
      {/* Wine bottles in background (shelves) */}
      <div className="absolute top-0 left-0 right-0 h-32 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-24 rounded-t-full"
            style={{
              background: 'linear-gradient(180deg, #2d5016 0%, #1a3010 100%)',
              left: `${10 + i * 11}%`,
              top: '10px',
              transform: `rotate(${Math.random() * 10 - 5}deg)`
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-black/40 rounded-t-full" />
          </div>
        ))}
      </div>
      
      {/* Barrels on sides */}
      <div className="absolute left-4 top-1/3 w-20 h-24 opacity-15">
        <div className="w-full h-full rounded-lg" style={{ background: 'linear-gradient(90deg, #654321 0%, #8b6f47 50%, #654321 100%)' }}>
          <div className="h-1 bg-black/60 mt-6" />
          <div className="h-1 bg-black/60 mt-6" />
          <div className="h-1 bg-black/60 mt-6" />
        </div>
      </div>
      
      <div className="absolute right-4 top-1/2 w-20 h-24 opacity-15">
        <div className="w-full h-full rounded-lg" style={{ background: 'linear-gradient(90deg, #8b6f47 0%, #654321 50%, #8b6f47 100%)' }}>
          <div className="h-1 bg-black/60 mt-6" />
          <div className="h-1 bg-black/60 mt-6" />
          <div className="h-1 bg-black/60 mt-6" />
        </div>
      </div>
      
      {/* Candle light particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: '#d4af37',
            left: `${20 + Math.random() * 60}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px #d4af37'
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -30, -60],
            scale: [1, 1.5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: Math.random() * 4
          }}
        />
      ))}

      {gamePhase === 'placement' ? (
        <>
          {/* Placement phase */}
          <div className="p-6 flex-1 flex flex-col relative z-10">
            <h2 className="text-2xl font-bold text-center mb-6" style={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#d4af37',
              textShadow: '0 2px 10px rgba(212, 175, 55, 0.5)'
            }}>
              Place your ships
            </h2>
            
            {/* Grid */}
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-2xl" style={{
                background: 'rgba(26, 15, 10, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(212, 175, 55, 0.1)'
              }}>
                <div className="flex mb-1">
                  <div className="w-8" />
                  {letters.split('').map(letter => (
                    <div key={letter} className="w-8 h-8 flex items-center justify-center text-sm font-bold" style={{ color: '#d4af37' }}>
                      {letter}
                    </div>
                  ))}
                </div>
                {myGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-bold" style={{ color: '#d4af37' }}>
                      {rowIndex + 1}
                    </div>
                    {row.map((cell, colIndex) => (
                      <motion.button
                        key={colIndex}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCellClick(rowIndex, colIndex, false)}
                        className="w-8 h-8 flex items-center justify-center text-xs"
                        style={{
                          background: cell.state === 'ship' 
                            ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.6), rgba(101, 67, 33, 0.6))'
                            : selectedShip !== null && canPlaceShip(rowIndex, colIndex, selectedShip)
                            ? 'rgba(212, 175, 55, 0.3)'
                            : 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                          boxShadow: cell.state === 'ship' ? 'inset 0 0 8px rgba(212, 175, 55, 0.3)' : 'none'
                        }}
                      >
                        {cell.state === 'ship' && ships[cell.shipId!]?.emoji}
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Ships to place */}
            <div className="space-y-2 mb-4">
              {ships.map(ship => (
                <button
                  key={ship.id}
                  onClick={() => setSelectedShip(ship.id)}
                  disabled={placedShips.includes(ship.id)}
                  className="w-full py-3 rounded-xl font-bold transition-all"
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    background: placedShips.includes(ship.id)
                      ? 'rgba(46, 125, 50, 0.3)'
                      : selectedShip === ship.id
                      ? 'rgba(212, 175, 55, 0.4)'
                      : 'rgba(139, 69, 19, 0.3)',
                    color: placedShips.includes(ship.id) ? '#81c784' : '#d4af37',
                    border: `2px solid ${placedShips.includes(ship.id) ? 'rgba(129, 199, 132, 0.5)' : 'rgba(212, 175, 55, 0.3)'}`,
                    boxShadow: selectedShip === ship.id ? '0 4px 20px rgba(212, 175, 55, 0.4)' : 'none'
                  }}
                >
                  {ship.emoji} {ship.name} ({ship.length}) {placedShips.includes(ship.id) && '✓'}
                </button>
              ))}
            </div>

            {/* Rotate button */}
            <button
              onClick={() => setShipOrientation(o => o === 'horizontal' ? 'vertical' : 'horizontal')}
              className="w-full py-4 rounded-xl font-bold mb-2 transition-all"
              style={{
                fontFamily: 'Arial, sans-serif',
                background: 'rgba(212, 175, 55, 0.2)',
                color: '#d4af37',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              ↻ Rotate ({shipOrientation === 'horizontal' ? '→' : '↓'})
            </button>

            {/* Start button */}
            {placedShips.length === ships.length && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGamePhase('playing')}
                className="w-full py-5 rounded-xl font-bold text-xl"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e4c1 50%, #d4af37 100%)',
                  color: '#1a0f0a',
                  boxShadow: '0 6px 30px rgba(212, 175, 55, 0.6)'
                }}
              >
                START BATTLE
              </motion.button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Playing phase */}
          <div className="flex-1 overflow-y-auto p-4 relative z-10">
            {/* Opponent grid */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 text-center" style={{ 
                fontFamily: 'Arial, sans-serif',
                color: '#d4af37',
                textShadow: '0 2px 10px rgba(212, 175, 55, 0.5)'
              }}>
                OPPONENT
              </h3>
              <div className="flex justify-center">
                <div className="p-2 rounded-xl" style={{
                  background: 'rgba(26, 15, 10, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                }}>
                  <div className="flex mb-1">
                    <div className="w-7" />
                    {letters.split('').map(letter => (
                      <div key={letter} className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ color: '#d4af37' }}>
                        {letter}
                      </div>
                    ))}
                  </div>
                  {opponentGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      <div className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ color: '#d4af37' }}>
                        {rowIndex + 1}
                      </div>
                      {row.map((cell, colIndex) => (
                        <motion.button
                          key={colIndex}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCellClick(rowIndex, colIndex, true)}
                          className="w-7 h-7 flex items-center justify-center text-xs"
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(212, 175, 55, 0.2)'
                          }}
                        >
                          {cell.state === 'hit' && <span className="font-bold" style={{ color: '#ff4444' }}>X</span>}
                          {cell.state === 'miss' && <span className="font-bold" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>O</span>}
                        </motion.button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My grid */}
            <div>
              <h3 className="text-lg font-bold mb-2 text-center" style={{ 
                fontFamily: 'Arial, sans-serif',
                color: '#d4af37',
                textShadow: '0 2px 10px rgba(212, 175, 55, 0.5)'
              }}>
                YOUR SHIPS
              </h3>
              <div className="flex justify-center">
                <div className="p-2 rounded-xl" style={{
                  background: 'rgba(26, 15, 10, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                }}>
                  <div className="flex mb-1">
                    <div className="w-7" />
                    {letters.split('').map(letter => (
                      <div key={letter} className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ color: '#d4af37' }}>
                        {letter}
                      </div>
                    ))}
                  </div>
                  {myGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      <div className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ color: '#d4af37' }}>
                        {rowIndex + 1}
                      </div>
                      {row.map((cell, colIndex) => (
                        <div
                          key={colIndex}
                          className="w-7 h-7 flex items-center justify-center text-xs"
                          style={{
                            background: cell.state === 'ship' || cell.state === 'hit' 
                              ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.5), rgba(101, 67, 33, 0.5))' 
                              : 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(212, 175, 55, 0.2)'
                          }}
                        >
                          {cell.state === 'hit' && <span className="font-bold" style={{ color: '#ff4444' }}>X</span>}
                          {cell.state === 'miss' && <span className="font-bold" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>O</span>}
                          {cell.state === 'ship' && ships[cell.shipId!]?.emoji}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
