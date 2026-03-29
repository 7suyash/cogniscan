import React from 'react';
import { BrainCircuit, Info, Code } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6 px-10 w-full max-w-7xl mx-auto border-b border-white/5 bg-transparent">
      <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 transform hover:scale-105">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40">
          <BrainCircuit className="text-white" size={28} />
        </div>
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          COGNISCAN
        </h1>
      </div>

      <nav className="flex items-center gap-8">
        <a href="#" className="text-sm font-semibold text-white/50 hover:text-white transition-colors">How it works</a>
        <a href="#" className="hidden md:flex text-sm font-semibold text-white/50 hover:text-white transition-colors">Privacy</a>
        <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
        <a href="https://github.com" target="_blank" className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all">
          <Code className="text-white/60" size={20} />
        </a>
      </nav>
    </header>
  );
};

export default Header;
