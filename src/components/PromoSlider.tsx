import React, { useState, useEffect } from 'react';
import { PromoBanner } from '../types';
import { ChevronLeft, ChevronRight, Tag, Zap } from 'lucide-react';

interface PromoSliderProps {
  promos: PromoBanner[];
  darkMode: boolean;
  onTopUpClick: () => void;
}

export default function PromoSlider({ promos, darkMode, onTopUpClick }: PromoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promos.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promos.length) % promos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promos.length);
  };

  if (!promos || promos.length === 0) return null;

  const currentPromo = promos[currentIndex];

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl">
      {/* Background Banner with glassmorphism overlay */}
      <div className="relative h-[250px] sm:h-[400px] w-full transition-all duration-700 ease-in-out">
        <img
          src={currentPromo.image}
          alt={currentPromo.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/40 to-transparent" />

        {/* Action Content aligned with margins */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-2 sm:mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 mr-1" />
              {currentPromo.badge}
            </span>
          </div>
          
          <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 sm:mb-4 select-none">
            {currentPromo.title}
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-base font-normal tracking-wide mb-4 sm:mb-6 line-clamp-2 select-none">
            {currentPromo.subtitle}
          </p>

          <div>
            <button
              onClick={onTopUpClick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/25 hover:scale-[1.03] transition-all hover:bg-gradient-to-r active:scale-95 duration-200"
            >
              Top Up Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Control Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-930/60 text-slate-300 pointer-events-auto cursor-pointer border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 hover:text-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-930/60 text-slate-300 pointer-events-auto cursor-pointer border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 hover:text-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Navigation Indicators */}
      <div className="absolute bottom-4 right-6 flex space-x-2 z-20">
        {promos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-blue-500' : 'bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
