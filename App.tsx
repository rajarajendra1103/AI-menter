
import React, { useState } from 'react';
import { AppMode } from './types';
import NotesGenerator from './components/NotesGenerator';
import CompilerVisualizer from './components/CompilerVisualizer';
import KeywordsExplorer from './components/KeywordsExplorer';
import { BookOpen, Terminal, Sparkles, Code2, GraduationCap, Key } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.NOTES);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMode(AppMode.NOTES)}>
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-lg shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AI MENTOR</h1>
          </div>

          <nav className="flex gap-2">
            <button
              onClick={() => setMode(AppMode.NOTES)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                mode === AppMode.NOTES 
                  ? 'bg-indigo-600 text-white shadow-indigo-600/20 shadow-xl' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Notes</span>
            </button>
            <button
              onClick={() => setMode(AppMode.KEYWORDS)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                mode === AppMode.KEYWORDS 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20 shadow-xl' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" /> <span className="hidden sm:inline">Keywords</span>
            </button>
            <button
              onClick={() => setMode(AppMode.COMPILER)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                mode === AppMode.COMPILER 
                  ? 'bg-violet-600 text-white shadow-violet-600/20 shadow-xl' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" /> <span className="hidden sm:inline">Compiler</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Powered by Gemini 3 Flash
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
        {mode === AppMode.NOTES && (
          <div className="space-y-10">
            <div className="text-center space-y-4 mb-10">
               <GraduationCap className="w-12 h-12 text-indigo-500 mx-auto" />
               <h2 className="text-4xl font-extrabold tracking-tight">Personalized <span className="text-indigo-500">Coding Mentor</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto">Get deep insights, clean syntax, flowcharts, and use cases for any programming concept in seconds.</p>
            </div>
            <NotesGenerator />
          </div>
        )}

        {mode === AppMode.KEYWORDS && (
          <div className="space-y-10">
            <div className="text-center space-y-4 mb-10">
               <Key className="w-12 h-12 text-emerald-500 mx-auto" />
               <h2 className="text-4xl font-extrabold tracking-tight">Language <span className="text-emerald-500">Keywords Deep Dive</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto">Master the vocabulary of any programming language. Understand every reserved word with precision.</p>
            </div>
            <KeywordsExplorer />
          </div>
        )}

        {mode === AppMode.COMPILER && (
          <div className="space-y-10">
            <div className="text-center space-y-4 mb-10">
               <Code2 className="w-12 h-12 text-violet-500 mx-auto" />
               <h2 className="text-4xl font-extrabold tracking-tight">Visual <span className="text-violet-500">Execution Analysis</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto">Trace code execution step-by-step with state tables, animations, and natural language narration.</p>
            </div>
            <CompilerVisualizer />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 p-6 text-center text-slate-600 text-sm">
        <p>© 2026 AI Mentor - Built for Accelerated Learning</p>
      </footer>
    </div>
  );
};

export default App;
