import { useState, useRef } from 'react';
import { Dna, Loader, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import UploadSection from './components/UploadSection';
import TerminalReport from './components/TerminalReport';
import SampleReport from './components/SampleReport';
import ClassificationGuide from './components/ClassificationGuide';
import FAQSection from './components/FAQSection';
import { searchClinVar, searchMyVariant, getGeneInfo } from './utils/api';
import { analyzeReportWithClaude } from './utils/analyzeReport';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Try it', href: '#try-it' },
  { label: 'FAQ', href: '#faq' },
];

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);     // ClinVar results
  const [geneInfo, setGeneInfo] = useState(null);
  const [aiText, setAiText] = useState(null);        // AI analysis text
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const resultsRef = useRef(null);

  function scrollToUpload() {
    document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToResults() {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async function handleSearch(q) {
    setLoading(true);
    setError(null);
    setResults(null);
    setAiText(null);
    setGeneInfo(null);
    setQuery(q);
    try {
      const clinvarResults = await searchClinVar(q);
      try { await searchMyVariant(q); } catch (_) {}
      const geneSymbol = clinvarResults[0]?.genes?.[0]?.symbol || q.match(/^([A-Z][A-Z0-9]+)/)?.[1];
      if (geneSymbol) {
        try { setGeneInfo(await getGeneInfo(geneSymbol)); } catch (_) {}
      }
      setResults(clinvarResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      scrollToResults();
    }
  }

  async function handleAnalyzeImage(base64, mimeType, apiKey) {
    setLoading(true);
    setError(null);
    setResults(null);
    setAiText(null);
    setGeneInfo(null);
    setQuery('');
    try {
      const text = await analyzeReportWithClaude(base64, mimeType, apiKey);
      setAiText(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      scrollToResults();
    }
  }

  const hasResult = results !== null || aiText !== null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">GeneSimple</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={scrollToUpload}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Try it free
            </button>
          </div>
        </div>
      </header>

      <HeroSection onScrollToUpload={scrollToUpload} />
      <HowItWorks />
      <UploadSection onSearch={handleSearch} onAnalyzeImage={handleAnalyzeImage} loading={loading} />

      {/* Results */}
      <div ref={resultsRef}>
        {loading && (
          <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
            <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                {aiText === null && results === null ? 'Analyzing your report with AI…' : 'Looking up your variant…'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">This may take a few seconds</p>
            </div>
          </section>
        )}

        {error && (
          <section className="py-8 bg-white dark:bg-gray-900 transition-colors">
            <div className="max-w-3xl mx-auto px-6">
              <div className="flex items-start gap-3 p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Something went wrong</p>
                  <p className="text-sm">{error}</p>
                  {error.toLowerCase().includes('api') && (
                    <p className="text-xs mt-2 text-red-500 dark:text-red-400">
                      Check that your API key is correct and has credits available at{' '}
                      <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline">
                        console.anthropic.com
                      </a>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {hasResult && !loading && (
          <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
            <div className="max-w-3xl mx-auto px-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {aiText ? 'Your Report Analysis' : results?.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}
                </h3>
                <button
                  onClick={() => { setResults(null); setAiText(null); setQuery(''); }}
                  className="text-sm text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  ← New search
                </button>
              </div>

              {results?.length === 0 && !aiText ? (
                <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">This variant wasn't found in ClinVar.</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                    Try searching by gene name (e.g. "BRCA1"), rsID, or upload a photo of your report to analyze it with AI.
                  </p>
                  <a href={"https://www.ncbi.nlm.nih.gov/clinvar/?term=" + encodeURIComponent(query)}
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Search directly on ClinVar →
                  </a>
                </div>
              ) : (
                <>
                  <TerminalReport
                    variants={results}
                    geneInfo={geneInfo}
                    query={query}
                    aiText={aiText}
                  />
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-700 dark:text-amber-400">
                      <strong>Not medical advice.</strong> This is for educational purposes only.
                      Always talk to your doctor or a{' '}
                      <a href="https://www.nsgc.org/FindaGeneticCounselor" target="_blank" rel="noopener noreferrer"
                        className="underline">certified genetic counselor</a> about your results.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </div>

      <SampleReport />
      <ClassificationGuide />
      <div id="faq"><FAQSection /></div>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Dna className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">GeneSimple</span>
            <span className="text-gray-400 text-sm ml-2">· For educational use only</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="https://www.ncbi.nlm.nih.gov/clinvar/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">ClinVar</a>
            <a href="https://myvariant.info/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">MyVariant.info</a>
            <a href="https://www.nsgc.org/FindaGeneticCounselor" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">Find a Counselor</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
