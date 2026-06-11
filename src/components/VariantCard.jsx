import { ExternalLink, Info, Users, Shield, AlertTriangle, BookOpen } from 'lucide-react';
import InheritanceWidget from './InheritanceWidget';
import ClinGenDosage from './ClinGenDosage';
import { significancePlainLanguage, frequencyLabel } from '../utils/api';

const colorClasses = {
  red: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800/30', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800/30', text: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/30', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/30', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  green: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800/30', text: 'text-green-700 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800/30', text: 'text-purple-700 dark:text-purple-400', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  gray: { bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700', text: 'text-gray-600 dark:text-gray-400', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
};

export default function VariantCard({ variant, geneInfo }) {
  const sig = variant.clinical_significance?.description || variant.germline_classification?.last_evaluated || 'Unknown';
  const info = significancePlainLanguage(sig);
  const colors = colorClasses[info.color] || colorClasses.gray;

  const variantName = variant.title || variant.variation_set?.[0]?.variation_name || 'Unknown Variant';
  const gene = variant.genes?.map(g => g.symbol).join(', ') || '';
  const conditions = variant.trait_set?.map(t => t.trait_name).filter(Boolean) || [];
  const rsId = variant.variation_set?.[0]?.allele_id;
  const uid = variant.uid;
  const reviewStatus = variant.review_status;
  const lastEvaluated = variant.clinical_significance?.last_evaluated;

  const freq = variant.population_frequency?.allele_frequency;

  return (
    <div className={"rounded-2xl border p-6 " + colors.bg + " " + colors.border}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">{variantName}</h3>
          {gene && (
            <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mt-1">Gene: {gene}</p>
          )}
        </div>
        <div className={"text-center px-4 py-2 rounded-xl " + colors.badge}>
          <div className="text-xl">{info.emoji}</div>
          <div className="text-xs font-bold mt-1">{info.label}</div>
        </div>
      </div>

      {/* Plain-language explanation box */}
      <div className={"rounded-xl p-4 mb-4 border " + colors.border + " bg-white/60 dark:bg-gray-900/40"}>
        <div className="flex items-start gap-2">
          <Info className={"w-4 h-4 mt-0.5 shrink-0 " + colors.text} />
          <div>
            <p className={"text-sm font-semibold " + colors.text + " mb-1"}>What this means in plain language:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{info.explanation}</p>
          </div>
        </div>
      </div>

      {/* Conditions */}
      {conditions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Associated Conditions
          </p>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Population frequency */}
      {freq !== undefined && (
        <div className="mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Population frequency: <strong>{frequencyLabel(freq)}</strong>
            {freq !== null && <span className="text-gray-400"> ({(freq * 100).toFixed(4)}%)</span>}
          </span>
        </div>
      )}

      <InheritanceWidget variant={variant} />
      {gene && <ClinGenDosage gene={gene} />}

      {/* Gene summary */}
      {geneInfo?.summary && (
        <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> About the {gene} gene
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4">
            {geneInfo.summary}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
        {reviewStatus && <span>Review: {reviewStatus.replace(/_/g, ' ')}</span>}
        {lastEvaluated && <span>Last evaluated: {lastEvaluated}</span>}
        {uid && (
          <a href={"https://www.ncbi.nlm.nih.gov/clinvar/variation/" + uid + "/"}
            target="_blank" rel="noopener noreferrer"
            className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            ClinVar <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {gene && (
          <a href={"https://www.omim.org/search?search=" + encodeURIComponent(gene)}
            target="_blank" rel="noopener noreferrer"
            className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            OMIM diseases <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {gene && (
          <a href={"https://www.ncbi.nlm.nih.gov/gene?term=" + encodeURIComponent(gene) + "[gene]+AND+9606[Taxonomy]"}
            target="_blank" rel="noopener noreferrer"
            className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            NCBI Gene <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
