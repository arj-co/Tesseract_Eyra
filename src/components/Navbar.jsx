import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <nav className={`fixed top-0 w-full z-50 bg-bgAlternate border-b border-black/5 transition-shadow duration-200 ${scrolled ? 'shadow-subtle' : ''}`}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between w-full">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span className="font-serif font-bold text-3xl text-softGreen tracking-tight">Eyra</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#who-we-serve" className="text-textMuted hover:text-deepNavy transition-colors font-medium">Who We Serve</a>
          <Link to="/how-it-works" className="text-textMuted hover:text-deepNavy transition-colors font-medium">How It Works</Link>
          <Link to="/about" className="text-textMuted hover:text-deepNavy transition-colors font-medium">About</Link>
        </div>
      </div>
    </nav>
  );
}
