import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Play, Trash2 } from 'lucide-react';
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
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Microphone access denied or not available.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
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

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

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
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-8 glass rounded-3xl">
      <h2 className="text-xl font-semibold text-white/90">Voice Recording</h2>
      
      <div className="relative flex items-center justify-center">
        {isRecording && <div className="pulse-ring" />}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-colors shadow-xl ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? <Square fill="white" size={32} /> : <Mic size={32} />}
        </motion.button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className={`text-2xl font-mono ${isRecording ? 'text-red-400 animate-pulse' : 'text-white/60'}`}>
          {formatTime(timer)}
        </span>
        <p className="text-sm text-white/40">
          {isRecording ? 'Recording in progress...' : 'Tap to start recording'}
        </p>
      </div>

      <AnimatePresence>
        {audioUrl && !isRecording && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <audio src={audioUrl} controls className="w-full h-10 opacity-70" />
            <div className="flex gap-4 w-full">
              <button 
                onClick={resetRecording}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70"
              >
                <Trash2 size={18} />
                Reset
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : null}
                {isAnalyzing ? 'Analyzing...' : 'Start Assessment'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 mt-2">
          {error}
        </span>
      )}
    </div>
  );
};

export default AudioRecorder;
