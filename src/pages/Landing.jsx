import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          <h1 className="font-serif font-bold text-6xl text-deepNavy leading-tight relative">
            <style>{`
              @keyframes marker-highlight {
                0% { background-size: 0% 4px; }
                100% { background-size: 100% 4px; }
              }
            `}</style>
            <span 
              className="inline bg-no-repeat pb-2"
              style={{
                backgroundImage: 'linear-gradient(to right, #1A73E8, #1A73E8)',
                backgroundPosition: '0 90%',
                animation: 'marker-highlight 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.2s forwards',
                backgroundSize: '0% 4px'
              }}
            >
              Your eyes are your voice.
            </span>
          </h1>
          <p className="text-xl text-textMuted font-medium leading-relaxed max-w-lg">
            Eyra is a browser-based communication tool for people living with ALS — no hardware, no installation, just a webcam.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/app" className="bg-medicalBlue text-white px-8 py-4 rounded-lg font-semibold hover:bg-deepNavy transition-colors text-center shadow-subtle text-lg">
              Launch Eyra
            </Link>
            <Link to="/how-it-works" className="border-2 border-medicalBlue text-medicalBlue px-8 py-4 rounded-lg font-semibold hover:bg-medicalBlue hover:text-white transition-colors text-center shadow-subtle text-lg">
              See How It Works
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 pt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bgAlternate rounded-full border border-gray-200">
              <span className="w-2.5 h-2.5 rounded-full bg-softGreen"></span>
              <span className="text-sm font-semibold text-textPrimary">SDG 3: Good Health</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bgAlternate rounded-full border border-gray-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11484]"></span>
              <span className="text-sm font-semibold text-textPrimary">SDG 10: Reduced Inequalities</span>
            </div>

          </div>
        </div>

        {/* Right Column - Mockup */}
        <div className="w-full bg-white rounded-2xl shadow-[0_25px_65px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden min-h-[500px] flex flex-col hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] transition-shadow duration-500">
          <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-inner"></div>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            {/* Top Bar Mock */}
            <div className="h-12 border-b border-gray-100 flex items-center gap-4 py-2 opacity-50">
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
              <div className="flex-1 text-center font-mono text-xl tracking-widest font-bold text-gray-400">HEA_</div>
              <div className="w-32 h-6 bg-gray-100 rounded"></div>
            </div>
            
            {/* Grid Mock */}
            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto_1fr] gap-4">
              <div className="bg-white border-2 border-medicalBlue shadow-subtle rounded-xl p-4 grid grid-cols-3 gap-2 relative">
                <div className="absolute inset-0 ring-4 ring-medicalBlue/20 rounded-xl"></div>
                <div className="bg-gray-50 rounded aspect-square flex items-center justify-center font-bold text-gray-400">A</div>
                <div className="bg-medicalBlue/10 rounded aspect-square flex relative items-center justify-center font-bold text-medicalBlue ring-2 ring-medicalBlue">
                  B
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#1A73E8" strokeWidth="4" strokeDasharray="100" strokeDashoffset="40" className="opacity-50" />
                  </svg>
                </div>
                <div className="bg-gray-50 rounded aspect-square flex items-center justify-center font-bold text-gray-400">C</div>
                <div className="bg-gray-50 rounded aspect-square flex items-center justify-center font-bold text-gray-400">D</div>
                <div className="bg-gray-50 rounded aspect-square flex items-center justify-center font-bold text-gray-400">E</div>
                <div className="bg-gray-50 rounded aspect-square flex items-center justify-center font-bold text-gray-400">F</div>
              </div>
              <div className="w-16"></div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-2 opacity-60">
                <div className="bg-gray-50 rounded aspect-square"></div>
                <div className="bg-gray-50 rounded aspect-square"></div>
                <div className="bg-gray-50 rounded aspect-square"></div>
              </div>
              
              <div className="w-16"></div>
              
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="px-6 py-2 border-2 border-gray-200 rounded-lg text-gray-400 font-bold text-sm">SPACE</div>
                <div className="px-6 py-2 border-2 border-gray-200 rounded-lg text-gray-400 font-bold text-sm">BACK</div>
                <div className="px-6 py-3 bg-medicalBlue rounded-lg text-white font-bold text-sm w-full text-center">SPEAK</div>
              </div>
              
              <div className="w-16"></div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-2 opacity-60"></div>
              <div className="w-16"></div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-2 opacity-60"></div>
            </div>
            {/* Status bar mock */}
            <div className="h-8 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 pt-2 opacity-50">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>Webcam: Active</div>
              <div>Dwell: 0.25s</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-bgAlternate py-16 w-full mt-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="py-4 px-4">
            <h2 className="font-serif text-5xl font-bold text-deepNavy mb-2">500,000+</h2>
            <p className="text-textMuted font-medium text-lg">People living with ALS worldwide</p>
          </div>
          <div className="py-4 px-4">
            <h2 className="font-serif text-5xl font-bold text-deepNavy mb-2">90%</h2>
            <p className="text-textMuted font-medium text-lg">Lose ability to speak over time</p>
          </div>
          <div className="py-4 px-4">
            <h2 className="font-serif text-5xl font-bold text-deepNavy mb-2">0</h2>
            <p className="text-textMuted font-medium text-lg">Hardware required to use Eyra</p>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-deepNavy mb-4">How Eyra Works</h2>
          <p className="text-xl text-textMuted">A system designed to adapt to your abilities.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-medicalBlue/10 flex items-center justify-center text-medicalBlue text-3xl mb-6 mx-auto md:mx-0">
              👁
            </div>
            <h3 className="font-bold text-2xl text-textPrimary">1. Calibrate</h3>
            <p className="text-textMuted leading-relaxed text-lg">Look at 4 points on screen to calibrate your gaze specifically to your eye movements.</p>
          </div>
          
          {/* Step 2 */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-medicalBlue/10 flex items-center justify-center text-medicalBlue text-3xl mb-6 mx-auto md:mx-0">
              ⌨
            </div>
            <h3 className="font-bold text-2xl text-textPrimary">2. Type</h3>
            <p className="text-textMuted leading-relaxed text-lg">Dwell your gaze on large visual clusters and drill down to select letters efficiently.</p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-medicalBlue/10 flex items-center justify-center text-medicalBlue text-3xl mb-6 mx-auto md:mx-0">
              🔊
            </div>
            <h3 className="font-bold text-2xl text-textPrimary">3. Speak</h3>
            <p className="text-textMuted leading-relaxed text-lg">Eyra expands your word or abbreviation into a full sentence and speaks it aloud using the Web Speech API.</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/how-it-works" className="inline-block text-medicalBlue font-bold text-lg hover:text-deepNavy transition-colors border-b-2 border-medicalBlue/20 hover:border-deepNavy pb-1">
            Learn more about the technology →
          </Link>
        </div>
      </section>

      {/* SDG Impact Section */}
      <section className="bg-bgAlternate py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold text-deepNavy mb-12 text-center">Built for Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-subtle border-l-4 border-softGreen">
              <div className="w-12 h-12 rounded bg-softGreen/10 flex items-center justify-center text-softGreen text-2xl font-bold mb-4">3</div>
              <h3 className="text-2xl font-bold text-textPrimary mb-3">Good Health and Well-being</h3>
              <p className="text-textMuted text-lg">
                Ensuring healthy lives and promoting well-being for all at all ages by providing accessible communication tools for patients with motor neuron diseases.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-subtle border-l-4 border-[#E11484]">
              <div className="w-12 h-12 rounded bg-[#E11484]/10 flex items-center justify-center text-[#E11484] text-2xl font-bold mb-4">10</div>
              <h3 className="text-2xl font-bold text-textPrimary mb-3">Reduced Inequalities</h3>
              <p className="text-textMuted text-lg">
                Reducing inequalities by providing an open-access, zero-hardware solution that bridges the gap for disabled individuals who cannot afford expensive proprietary AAC devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
