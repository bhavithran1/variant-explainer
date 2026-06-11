import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Not Medical Advice</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            This tool provides plain-language summaries of public genetic variant data from ClinVar and MyVariant.info.
            It is designed for educational purposes only. Variant classifications can change as new research emerges.
            <strong> Always discuss your genetic test results with a certified genetic counselor or physician.</strong>
            Never make medical decisions based on this tool alone.
          </p>
          <div className="mt-2 flex gap-3 text-xs">
            <a href="https://www.nsgc.org/FindaGeneticCounselor" target="_blank" rel="noopener noreferrer"
               className="text-amber-600 hover:underline">Find a Genetic Counselor →</a>
            <a href="https://www.ncbi.nlm.nih.gov/clinvar/" target="_blank" rel="noopener noreferrer"
               className="text-amber-600 hover:underline">ClinVar Database →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
