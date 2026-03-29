import React from 'react';
import { BrainCircuit, Code, ShieldCheck, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#"
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
          aria-label="Cogniscan Home"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-purple-600/40 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="text-white" size={28} />
            </div>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-medium tracking-[0.22em] text-white/45">
              AI VOICE SCREENING
            </span>
            <h1 className="mt-1 text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              COGNISCAN
            </h1>
          </div>
        </a>

        <nav className="flex items-center gap-2 sm:gap-3 md:gap-6">
          <a
            href="#how-it-works"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            <Sparkles size={16} className="text-white/60" />
            How it works
          </a>

          <a
            href="#privacy"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            <ShieldCheck size={16} className="text-white/60" />
            Privacy
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] p-2.5 hover:bg-white/[0.05] transition-colors"
            aria-label="GitHub"
          >
            <Code className="text-white/70" size={20} />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;