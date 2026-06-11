import { useEffect, useState } from 'react';
import { ExternalLink, Loader, AlertCircle } from 'lucide-react';

// ClinGen Dosage Sensitivity Map uses a public REST API
// https://dosage.clinicalgenome.org/clingen_gene.curation_list.tsv or search
const SCORE_INFO = {
  '3': { label: 'Sufficient evidence for haploinsufficiency', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', plain: 'Strong evidence that losing one copy of this gene causes disease.' },
  '2': { label: 'Emerging evidence for haploinsufficiency', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', plain: 'Some evidence suggests one copy may not be enough for normal function.' },
  '1': { label: 'Little evidence for haploinsufficiency', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', plain: 'Very limited evidence for dosage sensitivity.' },
  '0': { label: 'No evidence for haploinsufficiency', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', plain: 'No current evidence that losing one copy causes disease.' },
  '30': { label: 'Gene associated with autosomal recessive phenotype', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', plain: 'This gene is linked to a recessive condition (two copies must be altered).' },
  '40': { label: 'Dosage sensitivity unlikely', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', plain: 'Unlikely that gene copy number changes cause disease.' },
};

export default function ClinGenDosage({ gene }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gene) return;
    setData(null);
    setError(null);
    setLoading(true);

    // ClinGen Gene Dosage Sensitivity API (public endpoint)
    fetch(`https://search.clinicalgenome.org/kb/gene-dosage?page=1&pageSize=5&search=${encodeURIComponent(gene)}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(json => {
        const results = json?.data || json?.results || [];
        const entry = Array.isArray(results)
          ? results.find(g => g.gene_symbol === gene || g.label === gene)
          : null;
        setData(entry || null);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [gene]);

  if (loading) return (
    <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
      <Loader className="w-3 h-3 animate-spin" /> Checking ClinGen dosage sensitivity…
    </div>
  );

  if (!data) return null;

  const haplo = String(data.haploinsufficiency_score ?? data.hi_score ?? '');
  const triplo = String(data.triplosensitivity_score ?? data.ts_score ?? '');
  const hiInfo = SCORE_INFO[haplo];
  const tsInfo = SCORE_INFO[triplo];

  if (!hiInfo && !tsInfo) return null;

  return (
    <div className="mb-4 p-4 bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800/30 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wide">
          ClinGen Gene Dosage Sensitivity
        </p>
        <a
          href={`https://dosage.clinicalgenome.org/clingen_gene.curation_list.tsv`}
          target="_blank" rel="noopener noreferrer"
          className="text-xs text-violet-500 hover:underline flex items-center gap-0.5"
        >
          ClinGen <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="space-y-2">
        {hiInfo && (
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Haploinsufficiency (1 copy loss):</p>
            <span className={"text-xs px-2 py-1 rounded-lg font-medium " + hiInfo.color}>{hiInfo.label}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hiInfo.plain}</p>
          </div>
        )}
        {tsInfo && haplo !== triplo && (
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Triplosensitivity (extra copy):</p>
            <span className={"text-xs px-2 py-1 rounded-lg font-medium " + tsInfo.color}>{tsInfo.label}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tsInfo.plain}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 mt-2">
        <AlertCircle className="w-3 h-3 text-violet-400 shrink-0" />
        <p className="text-xs text-violet-400">ClinGen expert curation. Confirm with a clinical geneticist.</p>
      </div>
    </div>
  );
}
