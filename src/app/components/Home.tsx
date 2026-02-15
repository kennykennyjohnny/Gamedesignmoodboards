import { motion } from "motion/react";

interface HomeProps {
  onNavigate: (screen: string) => void;
}

const games = [
  {
    id: 'sandy',
    name: 'SandyPong',
    emoji: '🍷',
    gradient: 'linear-gradient(135deg, #ffc0cb 0%, #ff9a9e 100%)'
  },
  {
    id: 'lea',
    name: 'LéaNaval',
    emoji: '🍾',
    gradient: 'linear-gradient(135deg, #8b4513 0%, #d4af37 100%)'
  },
  {
    id: 'liliano',
    name: 'LilianoThunder',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)'
  },
  {
    id: 'nour',
    name: 'NourArchery',
    emoji: '🎯',
    gradient: 'linear-gradient(135deg, #00d9ff 0%, #00ff41 100%)'
  }
];

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white mb-12"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        KENNYGAMES 🎮
      </motion.h1>

      {/* Grid 2x2 */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(game.id === 'sandy' ? 'sandy-game' : game.id === 'lea' ? 'naval-game' : game.id === 'liliano' ? 'thunder-game' : 'archery-game')}
            className="aspect-square rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4 border-2 border-white/10"
            style={{ background: game.gradient }}
          >
            <div className="text-6xl">{game.emoji}</div>
            <div className="text-center">
              <p className="text-xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
                {game.name}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
