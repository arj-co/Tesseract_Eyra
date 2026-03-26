
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![WebGazer.js](https://img.shields.io/badge/WebGazer.js-F24E1E?style=for-the-badge)
![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Web Speech API](https://img.shields.io/badge/Web_Speech_API-FFB800?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<div align="center">
  <img src="./assets/logo.png" alt="Eyra Logo" width="300" />
</div>

# Eyra — Your Eyes Are Your Voice

**Eyra** is a modern, web-based Augmentative and Alternative Communication (AAC) application designed specifically for patients with ALS and severe motor disabilities. 

By leveraging standard webcams and advanced computer vision, Eyra allows users to compose words, expand them into full sentences using an onboard LLM, and synthesize speech—entirely through natural eye movements.

> [!IMPORTANT]
> **Note:** It will take 10 seconds for the ML model to load, after you have turned on the camera, wait for 10 seconds. Then webcam will be ready to select words.

---

## Features

- **Hardware-Free Eye Tracking:** Powered by `WebGazer.js` running entirely in the browser. No expensive, specialized eye-tracking hardware required.
- **Progressive Dwell Interactions:** Navigate the interface completely hands-free. Staring at a zone or letter initiates a 0.25-second dwell timer with crisp visual feedback (progress bars and rings).
- **Intelligent Sentence Expansion:** Don't type every letter. Simply gaze at shorthand characters and Eyra's integrated LLM expands them into complete, context-aware sentences automatically.
- **Text-to-Speech (TTS):** The vivid blue **SPEAK** button utilizes the browser's native `speechSynthesis` API to immediately vocalize the generated sentence.
- **Professional, Accessible UI:** 
  - A clean, high-contrast structural interface inspired by modern design systems like Linear and Vercel.
  - Interactive details like a breathing dot-grid background, shimmering text effects, layered drop shadows, and a logo pupil that tracks your gaze.
  - Grouped quadrants (A-F, G-M, N-T, U-Z) color-coded for distinct cognitive mapping.

## Sustainable Development Goals (SDGs)

Eyra is built to actively contribute to the United Nations SDGs:
- **SDG 3:** Good Health and Well-being
- **SDG 10:** Reduced Inequalities

---

## Getting Started

### Prerequisites
Make sure you have Node.js and `npm` installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/arj-co/Tesseract.git
   cd Tesseract
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` (ensure you allow webcam access when prompted).

---

## How It Works

1. **Calibration:** Upon loading, WebGazer initializes the webcam. 
2. **Selection:** Look at one of the four main zone cards to open its respective letter grid. 
3. **Typing:** Fix your gaze on a specific letter. The visual ring will fill up, selecting the letter when complete. Repeat for your desired shorthand.
4. **Expansion:** Once input halts, the LLM takes your shorthand buffer and predicts the most likely full sentence. 
5. **Vocalization:** Dwell on the "SPEAK" button to clear the buffer and narrate the expanded sentence.

## Tech Stack

- **Framework:** [React 18](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Eye-Tracking Engine:** [WebGazer.js](https://webgazer.cs.brown.edu/)
- **AI Expansion:** Large Language Model API Integration
- **Speech Synthesis:** Web Speech API

---
*Eyra was built to bridge the communication gap, providing independence, dignity, and a voice back to those who need it most.*
