
import React, { useState, useEffect, useRef } from 'react';
import { analyzeCode } from '../services/geminiService';
import { CompilerAnalysis, ExecutionStep } from '../types';
import MermaidChart from './MermaidChart';
import { 
  Play, 
  Settings, 
  Table as TableIcon, 
  FileText, 
  GitBranch, 
  Activity, 
  Maximize, 
  ChevronRight, 
  ChevronLeft,
  FastForward,
  Repeat,
  Volume2,
  Terminal,
  Info,
  Globe
} from 'lucide-react';

const CompilerVisualizer: React.FC = () => {
  const [code, setCode] = useState(`// Try a simple calculation or loop\nlet sum = 0;\nfor(let i = 1; i <= 5; i++) {\n  sum += i;\n}\nconsole.log(sum);`);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CompilerAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('Flowchart');
  const [fullScreen, setFullScreen] = useState(false);

  // Animation states
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  const tabs = [
    { name: 'Flowchart', icon: <GitBranch className="w-4 h-4" /> },
    { name: 'ASCII Flow', icon: <FileText className="w-4 h-4" /> },
    { name: 'State Table', icon: <TableIcon className="w-4 h-4" /> },
    { name: 'Logic', icon: <Info className="w-4 h-4" /> },
    { name: 'Animation', icon: <Activity className="w-4 h-4" /> },
    { name: 'Narration', icon: <Volume2 className="w-4 h-4" /> },
  ];

  const languages = [
    'JavaScript', 'Python', 'Java', 'PHP', 'R', 'C', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift'
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeCode(code, language, input);
      setAnalysis(result);
      setAnimationStep(0);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying && analysis && animationStep < (analysis.animationData?.highlightSequence?.length || 0) - 1) {
      timer = setTimeout(() => {
        setAnimationStep(prev => prev + 1);
      }, playbackSpeed);
    } else if (animationStep >= (analysis?.animationData?.highlightSequence?.length || 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, animationStep, analysis, playbackSpeed]);

  const renderTabContent = () => {
    if (!analysis) return null;

    switch (activeTab) {
      case 'ASCII Flow':
        return (
          <div className="bg-slate-900 p-6 rounded-xl h-[500px] overflow-auto border border-slate-700">
            <pre className="text-emerald-400 font-mono text-sm leading-relaxed">{analysis.asciiFlow}</pre>
          </div>
        );
      case 'State Table':
        return (
          <div className="bg-slate-900 p-4 rounded-xl h-[500px] overflow-auto border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-3">Step</th>
                  <th className="p-3">Line</th>
                  <th className="p-3">Variables</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {analysis.stateTable.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-800/50">
                    <td className="p-3 text-indigo-400 font-bold">{s.step}</td>
                    <td className="p-3 text-slate-500">{s.line}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {s.variables.map((v, idx) => (
                          <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-xs">
                            <b className="text-slate-400">{v.name}:</b> <span className="text-emerald-400">{v.value}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-300 italic">{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Logic':
        return (
          <div className="bg-slate-900 p-6 rounded-xl h-[500px] overflow-auto border border-slate-700 text-slate-300 leading-relaxed space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
              <Info className="w-5 h-5" /> Interpretive Analysis
            </h3>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 whitespace-pre-wrap">
              {analysis.executionLogic}
            </div>
            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30 flex gap-4 items-start">
               <Globe className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
               <div>
                  <h4 className="font-bold text-indigo-300 mb-1">Real-World Logic Example</h4>
                  <p className="text-sm text-slate-400 italic">
                    The logic above is similar to everyday tasks. AI has analyzed the core pattern and provides this relatable context.
                  </p>
               </div>
            </div>
          </div>
        );
      case 'Flowchart':
        return <div className="h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
          <MermaidChart chart={analysis.mermaidChart} id="compiler-flow" />
        </div>;
      case 'Animation':
        const currentHighlight = analysis.animationData.highlightSequence[animationStep];
        return (
          <div className="bg-slate-900 p-6 rounded-xl h-[500px] flex flex-col items-center justify-between border border-slate-700 relative">
            <div className="flex-grow w-full flex items-center justify-center relative">
              <svg width="100%" height="100%" viewBox="0 0 400 300" className="max-w-md">
                {analysis.animationData.nodes.map((node, i) => {
                  const x = 50 + (i % 3) * 150;
                  const y = 50 + Math.floor(i / 3) * 100;
                  const isActive = currentHighlight?.nodeId === node.id;
                  return (
                    <g key={node.id}>
                      <rect
                        x={x-50} y={y-25} width="100" height="50" rx="10"
                        className={`${isActive ? 'fill-indigo-600 stroke-white' : 'fill-slate-800 stroke-slate-600'} transition-all duration-300 stroke-2`}
                      />
                      <text x={x} y={y} textAnchor="middle" fill="white" className="text-xs font-bold pointer-events-none">
                        {node.label}
                      </text>
                      {isActive && currentHighlight.value !== undefined && (
                        <text x={x} y={y+40} textAnchor="middle" fill="#10b981" className="text-xs font-mono animate-bounce">
                           {JSON.stringify(currentHighlight.value)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="w-full flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
               <button onClick={() => setAnimationStep(Math.max(0, animationStep - 1))} className="p-2 hover:bg-slate-700 rounded"><ChevronLeft className="w-5 h-5"/></button>
               <button onClick={() => setIsPlaying(!isPlaying)} className="bg-indigo-600 p-2 rounded-full hover:bg-indigo-500">
                 {isPlaying ? <div className="w-4 h-4 bg-white" /> : <Play className="w-4 h-4 fill-white" />}
               </button>
               <button onClick={() => setAnimationStep(Math.min((analysis.animationData.highlightSequence.length || 1) - 1, animationStep + 1))} className="p-2 hover:bg-slate-700 rounded"><ChevronRight className="w-5 h-5"/></button>
               <button onClick={() => { setAnimationStep(0); setIsPlaying(false); }} className="p-2 hover:bg-slate-700 rounded"><Repeat className="w-5 h-5"/></button>
               <div className="flex-grow">
                 <input 
                   type="range" min="100" max="2000" step="100" 
                   value={2100 - playbackSpeed} 
                   onChange={(e) => setPlaybackSpeed(2100 - Number(e.target.value))}
                   className="w-full accent-indigo-500"
                 />
               </div>
               <span className="text-xs text-slate-400 font-mono">Step {animationStep + 1} / {analysis.animationData.highlightSequence.length}</span>
            </div>
          </div>
        );
      case 'Narration':
        return (
          <div className="bg-slate-900 p-6 rounded-xl h-[500px] overflow-auto border border-slate-700 space-y-4">
            {analysis.narration.map((step, i) => (
              <div key={i} className="flex gap-4 p-4 bg-slate-800/40 rounded-lg items-start border border-slate-800">
                <div className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full font-bold text-sm">{i+1}</div>
                <p className="text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto h-full ${fullScreen ? 'fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto' : ''}`}>
      {/* Editor Section */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFullScreen(!fullScreen)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow min-h-[300px] bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm text-emerald-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar resize-none mb-4"
            spellCheck={false}
          />
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Program Input</label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter program input here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {analysis && (
              <div className="animate-fadeIn">
                <label className="text-xs text-indigo-400 font-bold uppercase mb-1 flex items-center gap-2">
                   <Terminal className="w-3 h-3" /> Program Output
                </label>
                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/20 font-mono text-emerald-400 text-sm overflow-auto max-h-40 min-h-[60px] custom-scrollbar shadow-inner">
                  {analysis.output ? analysis.output : <span className="text-slate-600 italic">No standard output generated.</span>}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Play className="w-5 h-5 fill-white" />}
            Analyze & Visualize
          </button>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 h-full flex flex-col">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.name 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex-grow relative">
            {!analysis && !loading && (
              <div className="h-[500px] flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
                <FastForward className="w-16 h-16" />
                <p className="text-lg">Write some code and hit "Analyze" to see magic</p>
              </div>
            )}
            
            {loading && (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6">
                <div className="relative w-24 h-24">
                   <div className="absolute inset-0 rounded-full border-4 border-indigo-600/20"></div>
                   <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-indigo-400 font-bold text-lg animate-pulse">Gemini is parsing logic...</p>
                  <p className="text-slate-500 text-sm">Building state tables and flow diagrams</p>
                </div>
              </div>
            )}

            {!loading && analysis && renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerVisualizer;
