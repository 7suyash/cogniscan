import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageCircle, FileText, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const InsightCard = ({ icon: Icon, title, content, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex flex-col gap-4 p-6 glass rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <h3 className="text-lg font-bold text-white/90">{title}</h3>
    </div>
    <p className="text-sm text-white/70 leading-relaxed">
      {content || "No data available."}
    </p>
  </motion.div>
);

const ResultsView = ({ analysis, onReset }) => {
  // Extract data from the new structure
  const { transcript, analysis: qualAnalysis } = analysis || {};
  const { fluency, confidence, clarity, suggestions } = qualAnalysis || {};

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-20 p-6"
    >
      <div className="text-center mb-4">
         <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Analysis Complete</h2>
         <p className="text-white/50 mt-2">Here are your personalized speech insights</p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard 
          icon={Activity} 
          title="Fluency" 
          content={fluency} 
          color="bg-emerald-500" 
          delay={0.1}
        />
        <InsightCard 
          icon={CheckCircle2} 
          title="Confidence" 
          content={confidence} 
          color="bg-indigo-500" 
          delay={0.2}
        />
        <InsightCard 
          icon={MessageCircle} 
          title="Clarity" 
          content={clarity} 
          color="bg-cyan-500" 
          delay={0.3}
        />
        <InsightCard 
          icon={Sparkles} 
          title="Suggestions" 
          content={suggestions} 
          color="bg-amber-500" 
          delay={0.4}
        />
      </div>

      {/* Transcription block */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-4 mt-6"
      >
        <h3 className="text-lg font-bold flex items-center gap-2 text-white/90">
          <FileText size={20} className="text-purple-400" />
          Transcription
        </h3>
        <div className="p-6 glass rounded-2xl bg-white/5 min-h-[120px] leading-relaxed italic text-white/70 border border-white/5">
          "{transcript || "No transcription available."}"
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center mt-8"
      >
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-10 py-4 font-bold text-indigo-400 border border-indigo-400/30 rounded-2xl hover:bg-indigo-400/10 transition-all hover:scale-105"
        >
          Perform Another Scan
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ResultsView;
