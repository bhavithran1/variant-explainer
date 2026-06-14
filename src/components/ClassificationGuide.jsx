const CLASSIFICATIONS = [
  {
    emoji: '⚠️',
    label: 'Harmful',
    clinicalName: 'Pathogenic',
    color: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-400',
    desc: 'Strong scientific evidence that this variant causes a specific condition. Doesn\'t mean you will definitely get sick — talk to your doctor about what it means for you personally.',
  },
  {
    emoji: '🔶',
    label: 'Probably Harmful',
    clinicalName: 'Likely Pathogenic',
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-400',
    desc: 'Evidence points to this being harmful, but scientists aren\'t 100% certain yet. Research is ongoing.',
  },
  {
    emoji: '❓',
    label: 'Uncertain',
    clinicalName: 'Variant of Uncertain Significance (VUS)',
    color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
    desc: 'Not enough evidence to say either way. Very common result — many variants are still being studied. Classifications can change as science advances.',
  },
  {
    emoji: '🔵',
    label: 'Probably Fine',
    clinicalName: 'Likely Benign',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-400',
    desc: 'Evidence suggests this variant is harmless, though researchers aren\'t yet fully certain.',
  },
  {
    emoji: '✅',
    label: 'Harmless',
    clinicalName: 'Benign',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-400',
    desc: 'Normal variation found in healthy people. Not related to any disease. Nothing to worry about.',
  },
];

export default function ClassificationGuide() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What the labels mean</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Genetic reports use specific words. Here's what they actually mean in plain terms.
          </p>
        </div>
        <div className="space-y-3">
          {CLASSIFICATIONS.map(c => (
            <div key={c.label} className={`flex items-start gap-5 p-5 rounded-2xl border ${c.color} transition-colors`}>
              <div className="text-3xl shrink-0">{c.emoji}</div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className={`font-bold text-base ${c.textColor}`}>{c.label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">({c.clinicalName})</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
