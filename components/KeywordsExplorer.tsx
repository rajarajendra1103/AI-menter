
import React, { useState, useEffect } from 'react';
import { getLanguageKeywords, getKeywordExplanation } from '../services/geminiService';
import { KeywordDetail } from '../types';
import { Key, Search, BookOpen, Code, Info, ChevronRight, Globe } from 'lucide-react';

const KeywordsExplorer: React.FC = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [detail, setDetail] = useState<KeywordDetail | null>(null);

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'SQL', 'Ruby', 'Swift', 'Go', 'PHP', 'Rust'];

  const fetchKeywords = async (lang: string) => {
    setLoading(true);
    try {
      const list = await getLanguageKeywords(lang);
      setKeywords(list);
      setSelectedKeyword(null);
      setDetail(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (kw: string) => {
    setDetailLoading(true);
    setSelectedKeyword(kw);
    try {
      const data = await getKeywordExplanation(language, kw);
      setDetail(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords(language);
  }, [language]);

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
      {/* Language Selection Bar */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600/20 p-2 rounded-lg">
              <Key className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Keyword Explorer</h2>
              <p className="text-slate-400 text-sm">Discover and master reserved words</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  language === lang 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Keywords Grid */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 h-[600px] flex flex-col">
            <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> {language} Keywords
            </h3>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {keywords.map(kw => (
                    <button
                      key={kw}
                      onClick={() => fetchDetail(kw)}
                      className={`flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                        selectedKeyword === kw 
                          ? 'bg-emerald-600 text-white shadow-lg' 
                          : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-slate-700/50'
                      }`}
                    >
                      <span className="font-mono text-sm">{kw}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-8">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 min-h-[600px] flex flex-col">
            {!selectedKeyword ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-500 text-center space-y-4 opacity-50">
                <Globe className="w-16 h-16" />
                <div>
                  <p className="text-lg font-bold">Pick a Keyword</p>
                  <p className="text-sm">Select any word from the list to see its deep analysis</p>
                </div>
              </div>
            ) : detailLoading ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
                <p className="text-emerald-500 font-bold animate-pulse">Consulting AI Mentor...</p>
              </div>
            ) : detail && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-700 pb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-black text-white font-mono">{detail.keyword}</h2>
                    <p className="text-emerald-400 font-medium mt-1 uppercase tracking-widest text-xs">{language} Keyword</p>
                  </div>
                  <div className="bg-emerald-600/10 text-emerald-400 px-4 py-2 rounded-lg font-bold text-sm border border-emerald-600/20">
                    Built-in
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-indigo-400 font-bold flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5" /> Concept
                      </h4>
                      <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        {detail.concept}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-amber-400 font-bold flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5" /> How to use it
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {detail.howToUse}
                      </p>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h4 className="text-violet-400 font-bold flex items-center gap-2 mb-3">
                        <Globe className="w-5 h-5" /> Where to use
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-800">
                        {detail.whereToUse}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-emerald-400 font-bold flex items-center gap-2 mb-3">
                        <Code className="w-5 h-5" /> Small Example
                      </h4>
                      <pre className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-emerald-300 font-mono text-sm overflow-x-auto shadow-inner">
                        {detail.example}
                      </pre>
                    </section>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordsExplorer;
