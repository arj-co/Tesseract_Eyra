import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GooglyEyes from './GooglyEyes';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white border-b border-gray-800 transition-shadow duration-200 ${scrolled ? 'shadow-subtle' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <GooglyEyes />
          <span className="font-serif font-bold text-3xl text-deepNavy tracking-tight">Eyra</span>
        </Link>
        <div className="flex items-center space-x-8">
          <Link to="/how-it-works" className="text-textMuted hover:text-deepNavy transition-colors font-medium">How It Works</Link>
          <Link to="/about" className="text-textMuted hover:text-deepNavy transition-colors font-medium">About</Link>
          <Link to="/app" className="bg-medicalBlue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-deepNavy transition-colors">Launch App</Link>
        </div>
      </div>
    </nav>
  );
}
