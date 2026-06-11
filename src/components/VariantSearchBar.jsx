import { useState } from 'react';
import { Search, Loader, HelpCircle } from 'lucide-react';

const EXAMPLES = [
  { label: 'BRCA1 c.5266dupC', desc: 'BRCA1 pathogenic variant' },
  { label: 'rs80357906', desc: 'dbSNP rsID' },
  { label: 'TP53 R175H', desc: 'p53 hotspot mutation' },
  { label: 'CFTR F508del', desc: 'Cystic fibrosis variant' },
  { label: 'APOE e4', desc: 'Alzheimer risk allele' },
];

export default function VariantSearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter variant (e.g., BRCA1 c.5266dupC, rs80357906, TP53 R175H)…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          title="How to search"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Explain'}
        </button>
      </form>

      {showHelp && (
        <div className="mt-3 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/30 rounded-xl text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p className="font-semibold text-violet-700 dark:text-violet-400 mb-2">Supported search formats:</p>
          <p>• <strong>Gene + variant name:</strong> BRCA1 c.5266dupC or TP53 R175H</p>
          <p>• <strong>dbSNP rsID:</strong> rs80357906</p>
          <p>• <strong>Gene symbol:</strong> BRCA1 (shows common variants)</p>
          <p>• <strong>HGVS notation:</strong> NM_007294.4:c.5266dup</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-gray-400">Examples:</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex.label}
            onClick={() => { setQuery(ex.label); onSearch(ex.label); }}
            className="text-xs px-2 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded hover:bg-violet-100 transition-colors"
            title={ex.desc}
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}
