import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col pt-20 bg-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif font-bold text-5xl md:text-6xl text-deepNavy mb-6 leading-tight">
          How Eyra Works
        </h1>
        <p className="text-2xl text-textMuted font-medium">
          A three-step system designed around the user's remaining abilities.
        </p>
      </section>

      {/* Deep Dive Steps */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-32">
        
        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-medicalBlue font-bold text-xl uppercase tracking-wider">Step 1</h2>
            <h3 className="font-serif font-bold text-4xl text-textPrimary">Gaze Calibration</h3>
            <p className="text-xl text-textMuted leading-relaxed">
              Before typing, the application needs to learn how your eyes move relative to the webcam. 
              Calibration involves looking at 4 specific points on the screen and clicking (or dwelling). 
              This builds an active map of your pupil positions, taking just 30 seconds to complete.
            </p>
          </div>
          <div className="bg-bgAlternate p-8 rounded-2xl shadow-subtle aspect-video relative flex items-center justify-center border border-gray-100">
            <div className="w-[80%] h-[70%] border-2 border-dashed border-medicalBlue/40 rounded-xl relative flex items-center justify-center">
              {/* Dots */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-medicalBlue rounded-full shadow-lg ring-4 ring-medicalBlue/20"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="w-16 h-16 rounded-full bg-medicalBlue/10 flex items-center justify-center animate-pulse">
                <span className="text-2xl">👁</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
          <div className="bg-bgAlternate p-8 rounded-2xl shadow-subtle aspect-video border border-gray-100 grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto_1fr] gap-3">
             <div className="bg-white border-2 border-medicalBlue shadow-sm rounded-lg flex items-center justify-center p-2">
                 <span className="font-bold text-textMuted text-xs sm:text-lg">A-F</span>
             </div>
             <div className="w-8"></div>
             <div className="bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-center">
                 <span className="font-bold text-gray-300 text-xs sm:text-lg">G-M</span>
             </div>
             <div className="w-8"></div>
             <div className="flex flex-col gap-2 items-center justify-center">
                 <div className="border border-gray-300 w-12 h-6 rounded flex items-center justify-center text-[10px] text-gray-400">SPC</div>
                 <div className="bg-gray-200 w-12 h-8 rounded flex items-center justify-center text-[10px] text-gray-600 font-bold">SPK</div>
             </div>
             <div className="w-8"></div>
             <div className="bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-center">
                 <span className="font-bold text-gray-300 text-xs sm:text-lg">N-T</span>
             </div>
             <div className="w-8"></div>
             <div className="bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-center">
                 <span className="font-bold text-gray-300 text-xs sm:text-lg">U-Z</span>
             </div>
          </div>
          <div className="space-y-6 md:order-last order-first">
            <h2 className="text-medicalBlue font-bold text-xl uppercase tracking-wider">Step 2</h2>
            <h3 className="font-serif font-bold text-4xl text-textPrimary">The Keyboard Grid</h3>
            <p className="text-xl text-textMuted leading-relaxed">
              Standard keyboards require pinpoint precision. We divided the keyboard into 4 large visual zones. 
              By dwelling your gaze on a zone, it zooms in to reveal letters. Dwell again to type the letter. 
              This grouped approach drastically reduces errors for eye-tracking interfaces.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-medicalBlue font-bold text-xl uppercase tracking-wider">Step 3</h2>
            <h3 className="font-serif font-bold text-4xl text-textPrimary">LLM Sentence Expansion</h3>
            <p className="text-xl text-textMuted leading-relaxed">
              Eye-typing takes time. To speed up communication, users only need to type abbreviations or core words. 
              If a user types <span className="font-mono bg-gray-100 text-medicalBlue px-2 py-1 rounded">BATHRM</span>, our integrated Gemini AI instantly interprets the context and expands it into a fully vocalized sentence.
            </p>
          </div>
          <div className="bg-bgAlternate p-8 rounded-2xl shadow-subtle aspect-video border border-gray-100 flex flex-col items-center justify-center gap-6">
            <div className="bg-white px-6 py-3 rounded-lg border border-gray-200 font-mono text-xl shadow-sm text-textPrimary">BATHRM</div>
            <div className="text-medicalBlue">↓</div>
            <div className="flex items-center gap-2">
               <span className="font-bold text-xl text-textPrimary">Gemini AI</span>
               <span className="text-xl">✨</span>
            </div>
            <div className="text-medicalBlue">↓</div>
            <div className="bg-medicalBlue text-white px-6 py-4 rounded-lg font-serif italic text-xl shadow-md">
              "I want to go to the bathroom."
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-bgAlternate p-12 md:p-16 rounded-3xl text-center space-y-6 border border-gray-100">
          <h2 className="text-medicalBlue font-bold text-xl uppercase tracking-wider">Step 4</h2>
          <h3 className="font-serif font-bold text-4xl text-textPrimary">Text to Speech Voices</h3>
          <p className="text-xl text-textMuted leading-relaxed max-w-3xl mx-auto">
            Once the sentence is constructed, Eyra utilizes the native Web Speech API to vocalize the intent. 
            Caregivers can immediately hear the patient's request across the room, restoring real-time conversational latency.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-deepNavy py-24 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-10">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'WebGazer.js', 'Gemini 2.5 Flash', 'Web Speech API', 'Vercel', 'Tailwind CSS'].map(tech => (
              <div key={tech} className="bg-white/10 px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
