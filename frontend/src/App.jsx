import React, { useState } from 'react';
import Header from './components/Header';
import AudioRecorder from './components/AudioRecorder';
import ResultsView from './components/ResultsView';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [analysis, setAnalysis] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysis(data);
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full" />
      </div>

      <Header />

      <main className="flex flex-col items-center pt-20 pb-32 px-6">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-12 w-full max-w-2xl text-center"
            >
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold tracking-[0.3em] text-indigo-400 uppercase">
                  Linguistic Analysis AI
                </span>
                <h2 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  Voice Health <br /> Assessment
                </h2>
                <p className="text-lg text-white/50 max-w-lg mx-auto leading-relaxed mt-4">
                  Cogniscan analyzes your speech patterns in real-time to provide insights into cognitive health markers and linguistic fluency.
                </p>
              </div>

              <div className="w-full max-w-md">
                <AudioRecorder onAnalysisComplete={handleAnalysisComplete} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 w-full opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-[1px] bg-white/20 mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Fast Transcription</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-[1px] bg-white/20 mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Risk Scoring</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-[1px] bg-white/20 mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Privacy First</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-[1px] bg-white/20 mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Expert Insights</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1"
            >
              <ResultsView analysis={analysis} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Experimental Tag */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 glass rounded-full border border-white/5 opacity-40 hover:opacity-100 cursor-help transition-all duration-300">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Experimental Demo • AI Generated</span>
      </div>
    </div>
  );
}

export default App;
