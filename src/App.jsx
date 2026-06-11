import { useDarkMode } from './hooks/useDarkMode';
import DarkToggle from './components/DarkToggle';
import { useState } from 'react';
import { Dna, Loader, AlertTriangle, BookOpen } from 'lucide-react';
import VariantSearchBar from './components/VariantSearchBar';
import VariantCard from './components/VariantCard';
import Disclaimer from './components/Disclaimer';
import { searchClinVar, searchMyVariant, getGeneInfo } from './utils/api';

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [geneInfo, setGeneInfo] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  async function handleSearch(q) {
    setLoading(true);
    setError(null);
    setResults(null);
    setGeneInfo(null);
    setQuery(q);
    try {
      // Try ClinVar first
      const clinvarResults = await searchClinVar(q);

      // Also try myvariant.info for additional data
      let myvariantData = null;
      try {
        myvariantData = await searchMyVariant(q);
      } catch (e) { /* non-critical */ }

      // Extract gene symbol to get gene background
      const geneSymbol = clinvarResults[0]?.genes?.[0]?.symbol
        || q.match(/^([A-Z][A-Z0-9]+)/)?.[1];
      if (geneSymbol) {
        try {
          const gInfo = await getGeneInfo(geneSymbol);
          setGeneInfo(gInfo);
        } catch (e) { /* non-critical */ }
      }

      setResults(clinvarResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="p-2 bg-violet-600 rounded-lg">
            <Dna className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-none">Plain-Language Variant Explainer</h1>
            <p className="text-xs text-gray-400 mt-0.5">ClinVar · MyVariant.info · NCBI</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Understand Your Genetic Variant</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">
            Translate genetic test results into plain language using the public ClinVar database — no medical jargon, no fee.
          </p>
        </div>

        <Disclaimer />
        <VariantSearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className="flex items-center justify-center gap-2 py-12">
            <Loader className="w-6 h-6 text-violet-500 animate-spin" />
            <span className="text-sm text-gray-500">Looking up variant in ClinVar…</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {results !== null && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                  : `No variants found for "${query}"`}
              </h3>
              <button onClick={() => { setResults(null); setQuery(''); }}
                className="text-xs text-gray-400 hover:text-violet-600 transition-colors">
                ← New search
              </button>
            </div>
            {results.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">This variant was not found in ClinVar.</p>
                <p className="text-xs mt-1">Try searching by gene name, rsID, or HGVS notation.</p>
                <a href={"https://www.ncbi.nlm.nih.gov/clinvar/?term=" + encodeURIComponent(query)}
                   target="_blank" rel="noopener noreferrer"
                   className="text-xs text-violet-600 hover:underline mt-2 inline-block">
                  Search directly on ClinVar →
                </a>
              </div>
            )}
            {results.map((v, i) => (
              <VariantCard key={v.uid || i} variant={v} geneInfo={geneInfo} />
            ))}
          </div>
        )}


        {results === null && !loading && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '🧬', title: 'Plain Language', desc: 'We translate clinical jargon like "Pathogenic" into words that make sense' },
                { icon: '📊', title: 'Population Context', desc: 'See how common or rare your variant is across the general population' },
                { icon: '🔬', title: 'Gene Background', desc: 'Learn what the affected gene normally does in your body' },
              ].map(f => (
                <div key={f.title} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-500" /> Understanding Variant Classifications
              </h4>
              <div className="space-y-2">
                {[
                  { emoji: '⚠️', label: 'Pathogenic', desc: 'Strong scientific evidence that this variant causes a specific condition' },
                  { emoji: '🔶', label: 'Likely Pathogenic', desc: 'Probably harmful, but not yet confirmed with the same certainty' },
                  { emoji: '❓', label: 'Variant of Uncertain Significance (VUS)', desc: 'Not enough evidence yet — very common result, and classifications can change' },
                  { emoji: '🔵', label: 'Likely Benign', desc: 'Probably harmless, based on current evidence' },
                  { emoji: '✅', label: 'Benign', desc: 'Normal variation found in healthy people; not disease-causing' },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-3 text-sm">
                    <span className="text-lg shrink-0">{row.emoji}</span>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{row.label}: </span>
                      <span className="text-gray-500 dark:text-gray-400">{row.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
