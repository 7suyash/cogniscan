import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, FileText, Repeat, LayoutGrid, ArrowRight } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="flex items-center gap-4 p-5 glass rounded-2xl bg-white/5 border border-white/10">
    <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-white/50">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {subtext && <span className="text-xs text-white/30">{subtext}</span>}
      </div>
    </div>
  </div>
);

const ResultsView = ({ analysis, onReset }) => {
  const { transcription, metrics, riskScore, breakdown, analysis: qualitativeAnalysis } = analysis;

  const getScoreColor = (score) => {
    if (score < 30) return 'text-emerald-400';
    if (score < 60) return 'text-amber-400';
    return 'text-rose-500';
  };

  const getScoreBg = (score) => {
    if (score < 30) return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20';
    if (score < 60) return 'from-amber-500/20 to-amber-500/5 border-amber-500/20';
    return 'from-rose-500/20 to-rose-500/5 border-rose-500/20';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-20 p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <div className={`col-span-1 md:col-span-1 flex flex-col items-center justify-center p-8 glass rounded-3xl border-2 bg-gradient-to-br transition-all duration-500 ${getScoreBg(riskScore)}`}>
          <Brain className={getScoreColor(riskScore)} size={48} />
          <div className="flex flex-col items-center mt-4">
            <span className={`text-6xl font-black ${getScoreColor(riskScore)}`}>
              {riskScore}
            </span>
            <span className="text-sm font-semibold tracking-widest text-white/40 uppercase mt-2">
              Cognitive Risk
            </span>
          </div>
          <p className="text-xs text-center text-white/50 mt-6 leading-relaxed">
            Overall risk assessment based on linguistic patterns and markers.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard 
            icon={FileText} 
            label="Word Count" 
            value={metrics.wordCount} 
            subtext="words total"
            color="bg-indigo-500" 
          />
          <MetricCard 
            icon={Repeat} 
            label="Repetition Rate" 
            value={`${metrics.repetitionRate}%`} 
            color="bg-purple-500" 
          />
          <MetricCard 
            icon={Activity} 
            label="Avg Sentence Length" 
            value={metrics.avgSentenceLength} 
            subtext="words/sent"
            color="bg-pink-500" 
          />
          <MetricCard 
            icon={LayoutGrid} 
            label="Complexity" 
            value={breakdown.vocabulary || "Normal"} 
            color="bg-cyan-500" 
          />
        </div>
      </div>

      {/* Transcription & Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-white/90">
            <FileText size={20} className="text-indigo-400" />
            Transcription
          </h3>
          <div className="p-6 glass rounded-2xl bg-white/5 min-h-[200px] leading-relaxed italic text-white/70">
            "{transcription}"
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-white/90">
            <Activity size={20} className="text-purple-400" />
            Linguistic Analysis
          </h3>
          <div className="flex flex-col gap-4 p-6 glass rounded-2xl bg-white/5 min-h-[200px]">
            <div className="space-y-4">
               <div>
                  <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-1">Summary</h4>
                  <p className="text-sm text-white/80 leading-relaxed">{qualitativeAnalysis}</p>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-1">Fluency</h4>
                    <p className="text-sm text-white/80">{breakdown.fluency}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-1">Coherence</h4>
                    <p className="text-sm text-white/80">{breakdown.coherence}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-10 py-4 font-bold text-indigo-400 border border-indigo-400/30 rounded-2xl hover:bg-indigo-400/10 transition-all hover:scale-105"
        >
          Perform Another Scan
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsView;
