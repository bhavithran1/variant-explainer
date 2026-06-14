import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What types of medical reports can I upload?',
    a: 'You can upload almost any medical test result — blood tests (CBC, metabolic panel), cholesterol panels, urine tests, genetic/DNA reports, thyroid tests, liver function tests, and more. As long as the image is clear and readable, our AI can analyze it.',
  },
  {
    q: 'What is a genetic variant?',
    a: 'A genetic variant is a small difference in your DNA compared to the most common version. Think of your DNA as a very long instruction manual — a variant is like a typo or a slightly different word. Most variants are completely harmless. Some are linked to health conditions, and others scientists are still studying.',
  },
  {
    q: 'What does "Pathogenic" mean?',
    a: '"Pathogenic" means scientists have strong evidence that this variant is linked to a health condition. It does NOT automatically mean you will develop that condition — genetics is complicated, and your environment, lifestyle, and other genes all play a role. Always talk to your doctor about what it means for you.',
  },
  {
    q: 'What is a "Variant of Uncertain Significance" (VUS)?',
    a: 'A VUS means scientists found this variant but don\'t yet have enough evidence to say whether it\'s harmful or harmless. This is very common — science is still learning. Your classification can change over time as more research is done. If you got a VUS result, don\'t panic: it\'s not necessarily bad news.',
  },
  {
    q: 'Can I use this tool instead of seeing a doctor?',
    a: 'No — and please don\'t try. GeneSimple is a learning tool to help you understand what\'s in your report before or after speaking with a healthcare professional. Always discuss your results with your doctor or a certified genetic counselor before making any health decisions.',
  },
  {
    q: 'Why do I need a Claude API key for image analysis?',
    a: 'Reading and interpreting images requires AI, which costs money to run. Rather than charging you directly, we let you use your own Claude API key (from Anthropic). You can get one free at console.anthropic.com. Your key stays in your browser — we never see it or store it on any server.',
  },
  {
    q: 'Is my data safe? Do you store my information?',
    a: 'GeneSimple does not store or collect any information you enter. When you search for a variant, your browser contacts public scientific databases directly. When you use AI image analysis, the image goes from your browser to Anthropic\'s API — it is not stored by us.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Common questions</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">If you're wondering about something, others probably are too.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
        </div>
        <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-950/40 rounded-2xl text-center border border-blue-100 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-300 font-semibold mb-2">Still have questions?</p>
          <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">A certified genetic counselor can walk you through your results one-on-one.</p>
          <a
            href="https://www.nsgc.org/FindaGeneticCounselor"
            target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            Find a Genetic Counselor near you →
          </a>
        </div>
      </div>
    </section>
  );
}
