import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import ResultsView from './ResultsView';

export default function AssessmentPage() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <main className="min-h-[calc(100vh-80px)] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="w-full">
            <AudioRecorder onAnalysisComplete={setAnalysis} />
          </div>

          <div className="w-full">
            {analysis ? (
              <ResultsView analysis={analysis} onReset={() => setAnalysis(null)} />
            ) : (
              <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/25">
                <div className="p-6 lg:p-8">
                  <h3 className="text-lg font-semibold text-white/85">Results will appear here</h3>
                  <p className="mt-2 text-sm text-white/50">
                    Record a sample and start the assessment to view insights, suggestions, and transcription.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}