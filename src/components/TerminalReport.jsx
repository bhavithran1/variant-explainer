import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { significancePlainLanguage, frequencyLabel } from '../utils/api';
import { downloadReportAsPDF } from '../utils/downloadPDF';

// Build lines from ClinVar results
function buildClinVarLines(variants, geneInfo) {
  if (!variants || variants.length === 0) {
    return [
      '> No variants found in ClinVar database.',
      '> Try a different search term (e.g., BRCA1, rs80357906).',
      '> Analysis complete.',
    ];
  }
  const v = variants[0];
  const sig = v.clinical_significance?.description || 'Unknown';
  const info = significancePlainLanguage(sig);
  const gene = v.genes?.map(g => g.symbol).join(', ') || '';
  const variantName = v.title || v.variation_set?.[0]?.variation_name || 'Unknown Variant';
  const conditions = v.trait_set?.map(t => t.trait_name).filter(Boolean) || [];
  const freq = v.population_frequency?.allele_frequency;
  const reviewStatus = v.review_status;

  const lines = [
    '> Initializing GeneSimple analysis engine...',
    '> Connecting to ClinVar database...',
    '> Cross-referencing scientific literature...',
    '',
    `> ✓ Variant identified: ${variantName}`,
    gene ? `> ✓ Gene: ${gene}` : null,
    `> ✓ Classification: ${sig.toUpperCase()}`,
    reviewStatus ? `> ✓ Review status: ${reviewStatus.replace(/_/g, ' ')}` : null,
    '',
    '> ─────────────────────────────────────',
    '> WHAT THIS MEANS FOR YOU',
    '> ─────────────────────────────────────',
    `> ${info.explanation}`,
    '',
  ].filter(l => l !== null);

  if (conditions.length > 0) {
    lines.push('> Associated conditions:');
    conditions.slice(0, 3).forEach(c => lines.push(`>   • ${c}`));
    lines.push('');
  }
  if (freq !== undefined && freq !== null) {
    lines.push('> How rare is this variant?');
    lines.push(`>   ${frequencyLabel(freq)} — found in ${(freq * 100).toFixed(4)}% of the population.`);
    lines.push('');
  }
  if (geneInfo?.summary) {
    const summary = geneInfo.summary.slice(0, 200) + (geneInfo.summary.length > 200 ? '...' : '');
    lines.push(`> About the ${gene} gene:`);
    lines.push(`>   ${summary}`);
    lines.push('');
  }
  lines.push('> ─────────────────────────────────────');
  lines.push('> IMPORTANT: Always discuss results with your doctor');
  lines.push('> or a certified genetic counselor before making any');
  lines.push('> medical decisions.');
  lines.push('> ─────────────────────────────────────');
  lines.push('> Analysis complete. ✓');
  if (variants.length > 1) {
    lines.push(`> (${variants.length - 1} additional result${variants.length > 2 ? 's' : ''} found in ClinVar)`);
  }
  return lines;
}

// Convert AI plain text into terminal lines
function buildAILines(aiText) {
  const intro = [
    '> Initializing GeneSimple AI analysis...',
    '> Processing your medical report...',
    '> Translating medical terms to plain English...',
    '',
  ];
  const body = aiText.split('\n').map(line => {
    if (line.trim() === '') return '';
    return '> ' + line;
  });
  return [...intro, ...body, '', '> ─────────────────────────────────────', '> Analysis complete. ✓'];
}

function lineColor(line) {
  if (line.includes('─────') || /^> (REPORT TYPE|YOUR RESULTS|OVERALL PICTURE|THINGS TO MENTION|IMPORTANT REMINDER)/i.test(line))
    return 'text-blue-400';
  if (line.startsWith('> ✓') || (line.includes('complete') && line.includes('✓')))
    return 'text-green-400';
  if (/^> IMPORTANT|> ─────.*IMPORTANT/i.test(line))
    return 'text-yellow-400';
  if (line.startsWith('> •') || line.startsWith('>   •'))
    return 'text-cyan-300';
  return 'text-gray-300';
}

export default function TerminalReport({ variants, geneInfo, query, aiText }) {
  const isAI = Boolean(aiText);
  const lines = isAI ? buildAILines(aiText) : buildClinVarLines(variants, geneInfo);
  const fullText = isAI ? aiText : lines.map(l => l.replace(/^> /, '')).join('\n');

  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setDisplayed([]);
    setCurrentLine(0);
    setCurrentChar(0);
    setDone(false);
  }, [variants, geneInfo, aiText]);

  useEffect(() => {
    if (done || currentLine >= lines.length) {
      if (currentLine >= lines.length) setDone(true);
      return;
    }
    const line = lines[currentLine];
    if (line === '') {
      const t = setTimeout(() => {
        setDisplayed(p => [...p, '']);
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 60);
      return () => clearTimeout(t);
    }
    if (currentChar < line.length) {
      const speed = line.startsWith('> ─') ? 5 : isAI ? 8 : 12;
      const t = setTimeout(() => setCurrentChar(c => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed(p => [...p, line]);
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 30);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar, done, lines, isAI]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [displayed]);

  const currentTyping = !done && currentLine < lines.length ? lines[currentLine].slice(0, currentChar) : null;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-gray-400 font-mono flex-1">
          GeneSimple — {isAI ? 'AI medical report analysis' : 'genetic variant lookup'}
          {query && <span className="text-blue-400"> — {query}</span>}
        </span>
        {done && (
          <button
            onClick={() => downloadReportAsPDF(fullText, query || 'Medical Report')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        )}
      </div>

      {/* Terminal body */}
      <div className="bg-gray-950 p-5 min-h-48 max-h-[480px] overflow-y-auto font-mono text-sm leading-relaxed">
        {displayed.map((line, i) => (
          <div key={i} className={lineColor(line)}>
            {line || ' '}
          </div>
        ))}
        {currentTyping !== null && (
          <div className="text-gray-300">
            {currentTyping}<span className="animate-pulse text-blue-400">▋</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
