
import React, { useState } from 'react';
import { generateNotes } from '../services/geminiService';
import { NoteData } from '../types';
import MermaidChart from './MermaidChart';
import { Search, Book, Code, AlertTriangle, Lightbulb, Zap, CheckCircle, XCircle, Trophy } from 'lucide-react';

const NotesGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<NoteData | null>(null);
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const data = await generateNotes(topic);
      setNotes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    if (!notes) return 0;
    let score = 0;
    notes.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
          <Book className="w-6 h-6" /> AI Notes Generator
        </h2>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter any topic (e.g., React Hooks, Python Dictionaries, Quicksort)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Zap className="w-5 h-5" />}
            Generate
          </button>
        </div>
      </div>

      {notes && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn pb-20">
          {/* Concept Card */}
          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-indigo-300">
              <Lightbulb className="w-5 h-5" /> Concept
            </h3>
            <p className="text-slate-300 leading-relaxed">{notes.concept}</p>
            {notes.types && notes.types.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-slate-400 mb-2">Types:</h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {notes.types.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </section>

          {/* Syntax Card */}
          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-indigo-300">
              <Code className="w-5 h-5" /> Syntax
            </h3>
            <pre className="bg-slate-900 p-4 rounded-xl text-emerald-400 overflow-x-auto text-sm border border-slate-700">
              {notes.syntax}
            </pre>
          </section>

          {/* Flowchart Card */}
          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-3 text-indigo-300">Visual Flowchart</h3>
            <MermaidChart chart={notes.flowchartMermaid} id="notes-flow" />
          </section>

          {/* Programs */}
          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-emerald-400">Example Program</h3>
            <pre className="bg-slate-900 p-4 rounded-xl text-slate-200 overflow-x-auto text-sm border border-slate-700">
              {notes.exampleProgram}
            </pre>
          </section>

          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Error-Prone Program
            </h3>
            <pre className="bg-slate-900 p-4 rounded-xl text-slate-200 overflow-x-auto text-sm border border-slate-700">
              {notes.errorProneProgram}
            </pre>
          </section>

          {/* Usage & Use Cases */}
          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg col-span-1 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-300">How to use it</h3>
                <p className="text-slate-400 text-sm mb-4">{notes.howToUse}</p>
                <h4 className="font-semibold text-slate-300 mb-2">Restrictions</h4>
                <p className="text-slate-400 text-sm">{notes.restrictions}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-300">Use Cases in Problems</h3>
                <ul className="space-y-2">
                  {notes.useCases.map((uc, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm text-slate-300">
                      <span className="bg-indigo-600/30 text-indigo-400 px-2 rounded-md font-bold">{i+1}</span>
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Exam Section */}
          <section className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-amber-400">
              <Trophy className="w-7 h-7" /> Knowledge Check (Exam)
            </h3>
            
            <div className="space-y-8">
              {notes.quiz.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                  <p className="text-lg text-white font-medium mb-4">{qIdx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, oIdx) => {
                      const isSelected = quizAnswers[qIdx] === oIdx;
                      const isCorrect = oIdx === q.correctAnswer;
                      let btnClass = "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700";
                      
                      if (quizSubmitted) {
                        if (isCorrect) btnClass = "bg-emerald-900/40 border-emerald-500 text-emerald-400";
                        else if (isSelected) btnClass = "bg-rose-900/40 border-rose-500 text-rose-400";
                        else btnClass = "bg-slate-800/50 border-slate-800 text-slate-600 opacity-50";
                      } else if (isSelected) {
                        btnClass = "bg-indigo-600 border-indigo-500 text-white";
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${btnClass}`}
                        >
                          <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-black/20 font-bold text-xs uppercase">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          {option}
                          {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 ml-auto" />}
                          {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="mt-4 p-4 bg-slate-950/50 rounded-lg text-sm border-l-4 border-indigo-500 text-slate-400">
                      <strong className="text-indigo-400">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-700 pt-8">
              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < notes.quiz.length}
                  className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Submit Exam
                </button>
              ) : (
                <div className="flex items-center gap-6 w-full">
                  <div className="flex-grow bg-slate-900 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-xs uppercase font-bold">Your Score</p>
                      <p className="text-3xl font-black text-white">{calculateScore()} / {notes.quiz.length}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${calculateScore() === notes.quiz.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {calculateScore() === notes.quiz.length ? 'Perfect!' : 'Keep Learning!'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-xl transition-all"
                  >
                    Reset Quiz
                  </button>
                </div>
              )}
              <p className="text-slate-500 text-sm max-w-xs italic">
                Tip: If you missed any, review the "Syntax" and "Concept" sections above!
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default NotesGenerator;
