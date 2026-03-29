import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder.jsx';
import ResultsView from './ResultsView.jsx';

export default function AssessmentPage() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <main className="min-h-[calc(100vh-84px)] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        {/* Page heading */}
        <div className="mb-6 lg:mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white/90">
            Assessment
          </h1>
          <p className="mt-3 max-w-3xl text-white/55 leading-relaxed">
            Cogniscan analyzes your speech patterns in real-time to provide insights into cognitive health markers and
            linguistic fluency.
          </p>
        </div>

        {/* Full-width responsive layout:
            - mobile: 1 column (stacked)
            - desktop: 2 columns (side-by-side)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left: Recorder */}
          <div className="w-full">
            <AudioRecorder onAnalysisComplete={setAnalysis} />
          </div>

          {/* Right: Results */}
          <div className="w-full">
            {analysis ? (
              <ResultsView analysis={analysis} onReset={() => setAnalysis(null)} />
            ) : (
              <div className="relative w-full rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/25 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
                <div className="relative p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-white/85">Results will appear here</h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">
                    Record a sample and start the assessment to view score, insights, suggestions, and transcription.
                  </p>

                  {/* Skeleton placeholders */}
                  <div className="mt-6 grid grid-cols-2 gap-3 opacity-70">
                    <div className="h-20 rounded-2xl border border-white/10 bg-black/20" />
                    <div className="h-20 rounded-2xl border border-white/10 bg-black/20" />
                    <div className="h-20 rounded-2xl border border-white/10 bg-black/20" />
                    <div className="h-20 rounded-2xl border border-white/10 bg-black/20" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}