import React, { useState } from 'react';
import { GameItem } from '../types';
import { Search, Sparkles, Filter, Laptop, Smartphone } from 'lucide-react';

interface GameGridProps {
  games: GameItem[];
  selectedGame: GameItem | null;
  onSelectGame: (game: GameItem) => void;
  darkMode: boolean;
}

export default function GameGrid({ games, selectedGame, onSelectGame, darkMode }: GameGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Mobile', 'PC'];

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' ||
      game.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Category buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/20'
                  : darkMode
                  ? 'bg-slate-900/50 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat === 'Mobile' && <Smartphone className="w-3.5 h-3.5" />}
              {cat === 'PC' && <Laptop className="w-3.5 h-3.5" />}
              {cat === 'Semua' && <Filter className="w-3.5 h-3.5" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Search input bar */}
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Cari game favorit Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none border focus:ring-2 ${
              darkMode
                ? 'bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/10'
            }`}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
        </div>
      </div>

      {/* Grid displays */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map((game) => {
            const isSelected = selectedGame?.id === game.id;
            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className={`group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border h-full transform hover:-translate-y-1.5 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-900/10 shadow-lg shadow-blue-500/20 scale-[0.99] ring-2 ring-blue-500/50'
                    : darkMode
                    ? 'border-slate-800 bg-[#0f172a] hover:border-slate-700 hover:shadow-cyan-900/10 hover:shadow-xl'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                }`}
                id={`game-card-${game.id}`}
              >
                {/* Image Section */}
                <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-800">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
                  
                  {/* Category overlay tags */}
                  <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    game.category.includes('PC') 
                      ? 'bg-indigo-600/90 text-white' 
                      : 'bg-emerald-600/90 text-white'
                  }`}>
                    {game.category}
                  </span>
                  
                  {/* Hot tag overlay for first couple games */}
                  {(game.id === 'mobile-legends' || game.id === 'free-fire' || game.id === 'valorant') && (
                    <span className="absolute top-2.5 left-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>POPULER</span>
                    </span>
                  )}
                </div>

                {/* Info details */}
                <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className={`font-bold text-sm sm:text-base tracking-tight ${
                      darkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'
                    }`}>
                      {game.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">Proses Instan ~ 1 Detik</p>
                  </div>

                  <div className="mt-3.5">
                    <button
                      className={`w-full py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : darkMode
                          ? 'bg-slate-800/80 text-slate-300 hover:bg-blue-600 hover:text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Terpilih' : 'Pilih Game'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-12 rounded-2xl border ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <p className="text-slate-400 text-sm">Tidak ada game yang cocok dengan pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}
