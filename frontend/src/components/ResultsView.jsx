import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageCircle, FileText, Sparkles, CheckCircle2, ArrowRight, BadgeCheck } from 'lucide-react';

const InsightCard = ({ icon: Icon, title, content, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: 'easeOut' }}
    whileHover={{ y: -3 }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-xl shadow-black/25"
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-70" />
    <div className="relative flex flex-col gap-4 p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/20">
          <div className={`grid h-9 w-9 place-items-center rounded-lg ${color} bg-opacity-20`}>
            <Icon className={color.replace('bg-', 'text-')} size={20} />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white/85">{title}</h3>
          <p className="mt-1 text-xs text-white/45">AI-generated insight</p>
        </div>
      </div>

      <p className="text-sm text-white/70 leading-relaxed">
        {content || 'No data available.'}
      </p>

      <div className="mt-1 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  </motion.div>
);

const ResultsView = ({ analysis, onReset }) => {
  const { transcript, analysis: qualAnalysis } = analysis || {};
  const { fluency, confidence, clarity, suggestions } = qualAnalysis || {};

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="relative w-full rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/25 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />

        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Analysis Complete
              </h2>
              <p className="text-white/50 mt-2">Here are your personalized speech insights</p>
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Ready
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <BadgeCheck className="text-white" size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/85">Scan completed successfully</p>
                <p className="mt-1 text-sm text-white/50 leading-relaxed">
                  Review each insight and try applying 1–2 suggestions in your next recording.
                </p>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <InsightCard icon={Activity} title="Fluency" content={fluency} color="bg-emerald-500" delay={0.08} />
            <InsightCard icon={CheckCircle2} title="Confidence" content={confidence} color="bg-indigo-500" delay={0.16} />
            <InsightCard icon={MessageCircle} title="Clarity" content={clarity} color="bg-cyan-500" delay={0.24} />
            <InsightCard icon={Sparkles} title="Suggestions" content={suggestions} color="bg-amber-500" delay={0.32} />
          </div>

          {/* Transcription */}
          <div className="mt-7">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white/90">
              <FileText size={20} className="text-purple-300" />
              Transcription
            </h3>

            <div className="mt-3 relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
              <blockquote className="relative text-white/75 leading-relaxed">
                <span className="text-white/40 mr-2">“</span>
                <span className="italic">{transcript || 'No transcription available.'}</span>
                <span className="text-white/40 ml-2">”</span>
              </blockquote>
            </div>
          </div>

          <div className="mt-8 flex justify-start sm:justify-end">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 sm:px-8 sm:py-4 font-bold text-white
                         border border-white/10 bg-gradient-to-r from-indigo-500 to-purple-600
                         hover:from-indigo-400 hover:to-purple-500 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Perform Another Scan
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ResultsView;