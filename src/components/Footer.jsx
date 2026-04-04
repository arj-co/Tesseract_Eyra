import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-bgAlternate py-12">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between w-full">
        <div className="flex flex-col mb-6 md:mb-0">
          <span className="font-serif font-bold text-2xl text-deepNavy">Eyra</span>
          <span className="text-textMuted text-sm mt-1">Built for Tesseract '26</span>
        </div>
        
        <div className="flex items-center space-x-6 mb-6 md:mb-0 text-sm font-medium text-textMuted">
          <Link to="/how-it-works" className="hover:text-deepNavy transition-colors">How It Works</Link>
          <Link to="/about" className="hover:text-deepNavy transition-colors">About</Link>
          <Link to="/app" className="hover:text-deepNavy transition-colors">Launch App</Link>
        </div>

        <div className="text-textMuted text-sm text-right">
          <p>SDG 3 · SDG 10 · Open Innovation Track</p>
        </div>
      </div>
    </footer>
  );
}
