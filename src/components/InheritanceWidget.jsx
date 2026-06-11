import { Users, AlertCircle } from 'lucide-react';

const PATTERNS = {
  'Autosomal dominant': {
    icon: '👨‍👩‍👧',
    plain: 'One copy of the changed gene (from either parent) is enough to cause the condition. Each child of an affected parent has a 50% chance of inheriting it.',
    risk: '50% per child',
    color: 'border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800/30',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  'Autosomal recessive': {
    icon: '👨‍👩‍👦‍👦',
    plain: 'Two copies of the changed gene (one from each parent) are needed to cause the condition. Parents are usually unaffected "carriers". Each child has a 25% chance of being affected.',
    risk: '25% per child (if both parents are carriers)',
    color: 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800/30',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  'X-linked dominant': {
    icon: '🧬',
    plain: 'The changed gene is on the X chromosome and one copy is enough to cause the condition. Can affect both males and females.',
    risk: 'Varies by parent sex',
    color: 'border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800/30',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  'X-linked recessive': {
    icon: '🧬',
    plain: 'The changed gene is on the X chromosome. Males need only one copy to be affected. Females usually need two copies but can be carriers.',
    risk: '50% of sons affected if mother is carrier',
    color: 'border-pink-200 bg-pink-50 dark:bg-pink-900/10 dark:border-pink-800/30',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
  'Mitochondrial': {
    icon: '⚡',
    plain: 'The changed gene is in mitochondrial DNA, which is inherited entirely from the mother. All children of an affected mother may be affected.',
    risk: 'All children of affected mother potentially at risk',
    color: 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800/30',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
};

export default function InheritanceWidget({ variant }) {
  // Try to infer inheritance from variant data
  const inheritanceModes = variant.inheritance_modes || [];
  const conditions = variant.trait_set || [];
  const gene = variant.genes?.[0]?.symbol || '';

  // Common gene→inheritance mapping
  const KNOWN = {
    'BRCA1': 'Autosomal dominant', 'BRCA2': 'Autosomal dominant',
    'TP53': 'Autosomal dominant', 'CFTR': 'Autosomal recessive',
    'HEXA': 'Autosomal recessive', 'HBB': 'Autosomal recessive',
    'F8': 'X-linked recessive', 'DMD': 'X-linked recessive',
    'MECP2': 'X-linked dominant', 'MTM1': 'X-linked recessive',
  };

  const mode = inheritanceModes[0] || KNOWN[gene] || null;
  if (!mode || !PATTERNS[mode]) return null;

  const pattern = PATTERNS[mode];

  return (
    <div className={"rounded-xl border p-4 mb-4 " + pattern.color}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{pattern.icon}</span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + pattern.badge}>{mode}</span>
            <span className="text-xs text-gray-500">Inheritance pattern</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{pattern.plain}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            <strong>Family risk:</strong> {pattern.risk}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <AlertCircle className="w-3 h-3 shrink-0" />
            Consult a genetic counsellor for personalised family risk assessment.
          </div>
        </div>
      </div>
    </div>
  );
}
