import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, Square, Loader2, Sparkles, Trash2, AudioLines } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioRecorder = ({ onAnalysisComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = useMemo(() => {
    if (isAnalyzing) return { label: 'Analyzing', tone: 'bg-indigo-500/10 text-indigo-200 border-indigo-400/20' };
    if (isRecording) return { label: 'Recording', tone: 'bg-red-500/10 text-red-200 border-red-400/20' };
    if (audioUrl) return { label: 'Ready', tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/20' };
    return { label: 'Idle', tone: 'bg-white/5 text-white/70 border-white/10' };
  }, [isAnalyzing, isRecording, audioUrl]);

  const startRecording = async () => {
    setError(null);

    // reset old audio if any
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);

      timerIntervalRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } catch (err) {
      setError('Microphone access denied or not available.');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setTimer(0);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed. Please try again.');

      const data = await response.json();
      onAnalysisComplete(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/30">
        {/* subtle gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Assessment</p>
              <h2 className="mt-1 text-xl font-semibold text-white/90">Voice Recording</h2>
              <p className="mt-2 text-sm text-white/45 leading-relaxed">
                Record a short sample, then run an analysis.
              </p>
            </div>

            <span className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${status.tone}`}>
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full ${
                    isRecording ? 'bg-red-400 animate-ping' : 'bg-white/30'
                  } opacity-60`}
                />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${isRecording ? 'bg-red-300' : 'bg-white/30'}`} />
              </span>
              {status.label}
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center">
              {/* outer ring */}
              <motion.div
                animate={{
                  opacity: isRecording ? 1 : 0.35,
                  scale: isRecording ? [1, 1.06, 1] : 1,
                }}
                transition={{ duration: 1.6, repeat: isRecording ? Infinity : 0, ease: 'easeInOut' }}
                className="absolute h-36 w-36 rounded-full border border-white/10 bg-white/[0.02]"
              />

              {/* animated bars */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute -bottom-6 flex items-end gap-1.5"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 7 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 rounded-full bg-red-300/80"
                        animate={{ height: [6, 18, 10, 22, 8] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.07 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: isAnalyzing ? 1 : 1.05 }}
                whileTap={{ scale: isAnalyzing ? 1 : 0.96 }}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                className={[
                  'relative z-10 grid h-24 w-24 place-items-center rounded-full shadow-xl',
                  'ring-1 ring-white/10 transition-all',
                  isRecording
                    ? 'bg-gradient-to-b from-red-500 to-red-600 shadow-red-500/20 hover:from-red-400 hover:to-red-600'
                    : 'bg-gradient-to-b from-indigo-500 to-purple-600 shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-600',
                  isAnalyzing ? 'opacity-50 cursor-not-allowed' : '',
                ].join(' ')}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? <Square fill="white" size={30} /> : <Mic size={30} className="text-white" />}
              </motion.button>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span className={`text-3xl font-mono tracking-tight ${isRecording ? 'text-red-200' : 'text-white/70'}`}>
                {formatTime(timer)}
              </span>
              <p className="text-sm text-white/40">
                {isAnalyzing
                  ? 'Running analysis…'
                  : isRecording
                    ? 'Recording in progress…'
                    : audioUrl
                      ? 'Preview your audio, then continue'
                      : 'Tap to start recording'}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {audioUrl && !isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mt-8"
              >
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <AudioLines size={16} className="text-white/60" />
                      <span className="font-medium">Playback</span>
                    </div>
                    <span className="text-xs text-white/40">webm</span>
                  </div>

                  <audio src={audioUrl} controls className="w-full h-10 opacity-90" />
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={resetRecording}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75 hover:bg-white/[0.07] transition-colors"
                  >
                    <Trash2 size={18} />
                    Reset
                  </button>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={[
                      'flex-[1.35] inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold',
                      'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500',
                      'shadow-lg shadow-indigo-500/20 border border-white/10',
                      'disabled:opacity-50 disabled:cursor-not-allowed transition-all',
                    ].join(' ')}
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {isAnalyzing ? 'Analyzing…' : 'Start Assessment'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-5"
              >
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AudioRecorder;