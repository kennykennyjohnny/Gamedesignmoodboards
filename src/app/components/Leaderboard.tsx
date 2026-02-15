import { ArrowLeft, Trophy, TrendingUp, Crown, Sparkles, Medal } from "lucide-react";
import { motion } from "motion/react";

interface LeaderboardProps {
  onNavigate: (screen: string) => void;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  initial: string;
  gradient: string;
  score: number;
  wins: number;
  isGoat?: boolean;
}

export function Leaderboard({ onNavigate }: LeaderboardProps) {
  const games = [
    { id: 'sandy', name: 'Rosé Pong', gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)' },
    { id: 'liliano', name: 'Thunder', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { id: 'lea', name: 'Naval', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'nour', name: 'Archery', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Kenny', initial: 'K', gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)', score: 2450, wins: 24, isGoat: true },
    { rank: 2, name: 'Sandy', initial: 'S', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', score: 2380, wins: 22 },
    { rank: 3, name: 'Liliano', initial: 'L', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', score: 2150, wins: 19 },
    { rank: 4, name: 'Léa', initial: 'L', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', score: 1980, wins: 17 },
    { rank: 5, name: 'Nour', initial: 'N', gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)', score: 1750, wins: 15 },
    { rank: 6, name: 'Alex', initial: 'A', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', score: 1620, wins: 14 },
    { rank: 7, name: 'Marie', initial: 'M', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', score: 1450, wins: 12 },
    { rank: 8, name: 'Tom', initial: 'T', gradient: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)', score: 1290, wins: 10 },
  ];

  const myStats = {
    totalWins: 87,
    totalGames: 124,
    winRate: 70,
    goatCount: 12,
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ff6b9d 100%)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
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
            Classements
          </h1>
          
          <div className="w-11" />
        </div>
      </header>

      {/* Hero profile card */}
      <div className="relative z-10 px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/[0.08] border border-white/[0.15] p-6 shadow-2xl"
        >
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ff6b9d 100%)',
              mixBlendMode: 'overlay'
            }}
          />

          {/* Floating crown */}
          <motion.div
            className="absolute top-4 right-4"
            animate={{
              y: [0, -8, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Crown size={32} className="text-yellow-400" style={{ filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.5))' }} />
          </motion.div>
          
          <div className="relative z-10">
            {/* User info */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="w-16 h-16 rounded-2xl backdrop-blur-xl flex items-center justify-center font-bold text-2xl text-white border-2 border-white/30 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)' }}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                K
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Kenny
                </h2>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full backdrop-blur-xl bg-yellow-400/20 border border-yellow-400/30">
                    <p className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider">
                      Rang #1
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Victoires', value: myStats.totalWins },
                { label: 'Win Rate', value: `${myStats.winRate}%` },
                { label: 'Parties', value: myStats.totalGames },
                { label: 'Goat', value: myStats.goatCount },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 p-3 text-center"
                >
                  <p className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stat.value}
                  </p>
                  <p className="text-[9px] text-white/50 font-medium uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Game selector */}
      <div className="relative z-10 px-6 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {games.map((game, index) => (
            <button
              key={game.id}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl backdrop-blur-xl font-semibold text-xs transition-all ${
                index === 0
                  ? 'bg-white/10 border-2 border-white/20'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={index === 0 ? 'text-white' : 'text-white/50'}>
                {game.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Period tabs */}
      <div className="relative z-10 px-6 pb-4">
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
          {['Aujourd\'hui', 'Semaine', 'All-time'].map((period, i) => (
            <button
              key={period}
              className={`py-2.5 rounded-lg font-semibold text-xs transition-all ${
                i === 0
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'text-white/50 hover:text-white'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="relative z-10 px-6 pb-20">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={18} className="text-yellow-400" />
          <h3 
            className="text-sm font-semibold text-white/70"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Top Joueurs — Rosé Pong
          </h3>
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry, index) => {
            const isTop3 = entry.rank <= 3;
            const medalIcons = [
              <Crown size={18} className="text-yellow-400" />,
              <Medal size={18} className="text-gray-300" />,
              <Medal size={18} className="text-amber-600" />
            ];

            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl p-4 transition-all ${
                  entry.isGoat
                    ? 'bg-yellow-400/10 border-2 border-yellow-400/50'
                    : isTop3
                    ? 'bg-white/[0.08] border border-white/20'
                    : 'bg-white/[0.03] border border-white/10'
                }`}
              >
                {/* Goat badge */}
                {entry.isGoat && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center border-2 border-yellow-400 shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ff6b9d 100%)' }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles size={16} className="text-white" />
                  </motion.div>
                )}

                {/* Gradient overlay */}
                {isTop3 && (
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: entry.gradient,
                      mixBlendMode: 'overlay'
                    }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  {/* Rank/Medal */}
                  <div 
                    className={`flex-shrink-0 w-10 h-10 rounded-xl backdrop-blur-xl flex items-center justify-center font-bold text-sm border-2 ${
                      isTop3 ? 'border-white/30' : 'border-white/10'
                    }`}
                    style={{
                      background: isTop3 
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
                        : 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    {isTop3 ? medalIcons[entry.rank - 1] : `#${entry.rank}`}
                  </div>

                  {/* Avatar */}
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl backdrop-blur-xl flex items-center justify-center font-bold text-base text-white border-2 border-white/20 shadow-xl"
                    style={{ background: entry.gradient }}
                    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    {entry.initial}
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-bold text-white truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {entry.name}
                      </p>
                      {entry.isGoat && (
                        <div className="flex-shrink-0 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400">
                          <p className="text-[9px] font-bold text-black uppercase tracking-wider">
                            Goat
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={10} />
                        {entry.wins} victoires
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <p 
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {entry.score}
                    </p>
                    <p className="text-[9px] text-white/40 uppercase tracking-wider font-bold">pts</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-2xl backdrop-blur-2xl bg-white/[0.05] border border-white/10 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl backdrop-blur-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
              <Crown size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-300 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Goat du jour 🐐
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                Le joueur avec le meilleur score quotidien devient le Goat. Le classement se réinitialise chaque jour à minuit.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
