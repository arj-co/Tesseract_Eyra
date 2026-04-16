import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col pt-20 bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-bgAlternate py-32 text-center border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-deepNavy mb-6 leading-tight">
            Why We Built Eyra
          </h1>
          <p className="text-2xl text-textMuted font-medium italic font-serif opacity-80">
            "ALS takes away movement. Then speech. But never vision."
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <blockquote className="font-serif text-3xl md:text-4xl text-textPrimary leading-relaxed font-bold border-l-8 border-medicalBlue pl-8 text-left mb-12 shadow-sm italic p-8 bg-gray-50 rounded-r-3xl">
          Every 90 minutes, someone is diagnosed with ALS. Most will lose their voice within 3 years.
        </blockquote>
        <div className="max-w-3xl mx-auto text-lg text-textMuted text-left space-y-6">
          <p>
            The communication gap for ALS patients is immense. In the late stages of motor neuron diseases, individuals retain full cognitive function while completely losing control of their voluntary muscles. Standard AAC (Augmentative and Alternative Communication) devices exist, but they are prohibitively expensive—often costing upwards of $15,000.
          </p>
          <p>
            By the time a patient's insurance approves funding for specialized eye-tracking hardware, the disease has often progressed further, leading to months of locked-in isolation. Eyra was born to fill this gap instantaneously.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-deepNavy py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold mb-16 text-center">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">💻</div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Zero Hardware</h3>
              <p className="text-gray-300 leading-relaxed text-lg">Works on any standard laptop or smartphone with a camera. No proprietary infrared trackers or specialized screens required.</p>
            </div>
            <div className="bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🔓</div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Open Source</h3>
              <p className="text-gray-300 leading-relaxed text-lg">Free for every patient, forever. Eyra breaks financial barriers by operating exclusively within standard web browsers.</p>
            </div>
            <div className="bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🧠</div>
              <h3 className="text-2xl font-bold mb-4 font-serif">Human-Centered</h3>
              <p className="text-gray-300 leading-relaxed text-lg">Designed around what ALS patients can still do. By reducing visual effort and leveraging AI sentence generation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="font-serif text-4xl font-bold mb-16 text-center text-deepNavy">The Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { initials: 'HS', name: 'Harsh Sharma', role: 'Frontend', color: 'bg-medicalBlue' },
            { initials: 'AS', name: 'Arjun Shewalkar', role: 'AI Integration', color: 'bg-softGreen' },
            { initials: 'SP', name: 'Sandhya Patil', role: 'UX & Research', color: 'bg-[#E11484]' },
            { initials: 'HS', name: 'Harsh Shedge', role: 'Presentation', color: 'bg-[#19486A]' }
          ].map((person, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-subtle border border-gray-100 flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full ${person.color} text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-md`}>
                {person.initials}
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">{person.name}</h3>
              <p className="text-textMuted font-medium bg-bgAlternate px-4 py-1.5 rounded-full text-sm">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hackathon Context */}
      <section className="bg-bgAlternate py-16 text-center border-t border-gray-100 mb-12">
        <div className="max-w-3xl mx-auto px-6 bg-white p-12 rounded-3xl shadow-subtle border border-gray-200">
          <h3 className="font-serif text-3xl font-bold text-deepNavy mb-6">Built at Vishwanova '26 — VIT Pune</h3>
          <div className="flex flex-wrap justify-center gap-4 text-textMuted font-medium mb-6">
            <span className="bg-blue-50 text-medicalBlue px-4 py-2 rounded-lg border border-blue-100">Open Innovation / SDG</span>
          </div>
          <div className="text-gray-500 text-lg space-y-4">
            <p>
              This project was conceived and prototyped entirely during the Vishwanova '26 Hackathon.
            </p>
            <p>
              <span className="font-semibold text-textPrimary">Round 1</span> — The project is submitted to the Open Innovation track, aligned with SDG 3 (Good Health) and SDG 10 (Reduced Inequalities).
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
