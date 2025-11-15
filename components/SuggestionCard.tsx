
import React from 'react';
import type { Suggestion } from '../types';
import { LightbulbIcon } from './icons';

interface SuggestionCardProps {
  suggestion: Suggestion;
  index: number;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, index }) => {
  const animationDelay = `${index * 100}ms`;
  return (
    <div 
        className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80 animate-fade-in-up"
        style={{ animationDelay }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            <LightbulbIcon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-lg text-slate-900 mb-1">{suggestion.area}</h4>
          <p className="text-slate-600 leading-relaxed">{suggestion.suggestionText}</p>
        </div>
      </div>
    </div>
  );
};

// Add keyframes for animation in a style tag if not using a CSS file
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
    opacity: 0;
  }
`;
document.head.appendChild(style);
