import { ArrowLeft, Share2, Copy, Check, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Player {
  id: string;
  name: string;
  gradient: string;
  isReady: boolean;
  isEmpty?: boolean;
}

interface LobbyProps {
  onNavigate: (screen: string) => void;
  gameId: string;
}

export function Lobby({ onNavigate, gameId }: LobbyProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Kenny', gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)', isReady: true },
    { id: '2', name: 'Sandy', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', isReady: true },
    { id: '3', name: 'En attente...', gradient: 'linear-gradient(135deg, #3a3a52 0%, #2a2a3e 100%)', isReady: false, isEmpty: true },
    { id: '4', name: 'En attente...', gradient: 'linear-gradient(135deg, #3a3a52 0%, #2a2a3e 100%)', isReady: false, isEmpty: true },
  ]);

  const gameConfig = {
    sandy: {
      name: 'Rosé Pong',
      subtitle: 'Beer Pong Élégant',
      gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)',
      particles: ['🌸', '✨', '💫']
    },
    liliano: {
      name: 'Thunder',
      subtitle: 'Tank Électrique',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      particles: ['⚡', '🎸', '⭐']
    },
    lea: {
      name: 'Naval',
      subtitle: 'Bataille Tactique',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      particles: ['🌊', '⚓', '🎯']
    },
    nour: {
      name: 'Archery',
      subtitle: 'Tir de Précision',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      particles: ['🎯', '🏹', '💎']
    }
  };

  const game = gameConfig[gameId as keyof typeof gameConfig] || gameConfig.sandy;
  const readyPlayers = players.filter(p => !p.isEmpty && p.isReady);
  const allReady = players.filter(p => !p.isEmpty).every(p => p.isReady) && readyPlayers.length >= 2;

  useEffect(() => {
    if (allReady && countdown === null) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [allReady, countdown]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://kennygames.app/j/abc123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    if (gameId === 'sandy') {
      onNavigate('sandy-game');
    } else if (gameId === 'liliano') {
      onNavigate('thunder-game');
    } else if (gameId === 'lea') {
      onNavigate('naval-game');
    } else if (gameId === 'nour') {
      onNavigate('archery-game');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: game.gradient }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 py-5 backdrop-blur-2xl bg-white/[0.03] border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('home')}
            className="w-11 h-11 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          
          <h1 
            className="text-base font-semibold text-white"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Salle d'attente
          </h1>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="w-11 h-11 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} className="text-white" />}
          </motion.button>
        </div>
      </header>

      {/* Game banner */}
      <div className="relative z-10 px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/[0.08] border border-white/[0.15] p-8 shadow-2xl"
        >
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: game.gradient,
              mixBlendMode: 'overlay'
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {game.particles.map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl opacity-20"
                style={{
                  left: `${15 + i * 30}%`,
                  top: `${20 + i * 20}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                  opacity: [0.1, 0.25, 0.1]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 mb-4"
            >
              <p className="text-xs font-medium text-white/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Créée par Kenny
              </p>
            </motion.div>
            
            <h2 
              className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {game.name}
            </h2>
            <p className="text-base text-white/60 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {game.subtitle}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Players section */}
      <div className="relative z-10 px-6 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-white/50" />
            <h3 
              className="text-sm font-semibold text-white/80"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Joueurs ({readyPlayers.length}/{players.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20">
            <motion.div 
              className={`w-2 h-2 rounded-full ${allReady ? 'bg-green-400' : 'bg-yellow-400'}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-white/70 font-medium">
              {allReady ? 'Prêts' : 'En attente'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl border transition-all ${
                player.isEmpty
                  ? 'bg-white/[0.03] border-dashed border-white/10'
                  : 'bg-white/[0.08] border-white/15'
              }`}
            >
              {/* Player gradient background */}
              {!player.isEmpty && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: player.gradient,
                    mixBlendMode: 'overlay'
                  }}
                />
              )}

              <div className="relative z-10 p-5 flex flex-col items-center gap-3">
                {/* Avatar */}
                <motion.div 
                  className={`w-14 h-14 rounded-2xl backdrop-blur-xl flex items-center justify-center font-bold text-xl border-2 ${
                    player.isEmpty ? 'border-white/10 text-white/20' : 'border-white/20 text-white'
                  }`}
                  style={{ 
                    background: player.isEmpty ? 'rgba(255, 255, 255, 0.03)' : player.gradient,
                  }}
                  whileHover={!player.isEmpty ? { rotate: [0, -5, 5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {player.isEmpty ? '?' : player.name.charAt(0).toUpperCase()}
                </motion.div>
                
                {/* Name */}
                <p className={`text-sm font-semibold text-center ${player.isEmpty ? 'text-white/30' : 'text-white'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {player.name}
                </p>
                
                {/* Status */}
                {!player.isEmpty && (
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    player.isReady 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {player.isReady ? 'Prêt' : 'En attente'}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Share link */}
      <div className="relative z-10 px-6 pb-6">
        <div className="rounded-2xl backdrop-blur-2xl bg-white/[0.08] border border-white/[0.15] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-white/50" />
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Inviter des amis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 rounded-xl backdrop-blur-xl bg-black/20 border border-white/10 text-xs text-white/50 font-mono overflow-hidden">
              kennygames.app/j/abc123
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="px-5 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 font-semibold text-xs text-white hover:bg-white/20 transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copié
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copier
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {allReady ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {countdown !== null && (
                <motion.div 
                  className="text-center py-3 rounded-2xl backdrop-blur-2xl bg-green-500/10 border border-green-500/30"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Clock size={18} />
                    <p className="text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Démarrage dans {countdown}s...
                    </p>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
                className="w-full py-5 rounded-2xl backdrop-blur-2xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl border border-white/20 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 text-lg font-bold text-white flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  C'est parti ! 🚀
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              disabled
              className="w-full py-5 rounded-2xl backdrop-blur-2xl bg-white/5 border border-white/10 cursor-not-allowed"
            >
              <span className="text-lg font-bold text-white/30" style={{ fontFamily: 'Poppins, sans-serif' }}>
                En attente des joueurs...
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}