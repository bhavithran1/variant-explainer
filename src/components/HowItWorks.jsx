const steps = [
  {
    number: '01',
    icon: '📋',
    title: 'Get your report',
    desc: 'Find your medical test results — a blood test printout, genetic report, urine test, cholesterol panel, anything. You can take a photo of it with your phone.',
  },
  {
    number: '02',
    icon: '📤',
    title: 'Upload or type it in',
    desc: 'Drag and drop a photo of your report, or type a specific code from your results. Our AI reads it and looks up everything automatically.',
  },
  {
    number: '03',
    icon: '💬',
    title: 'Get a plain-English explanation',
    desc: 'We explain every result in everyday words — what it measures, whether it\'s normal, and what to discuss with your doctor. Then download it as a PDF.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How it works</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">Three simple steps and you'll have a clear picture of your medical results.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
              <div className="text-5xl font-black text-blue-50 dark:text-blue-950 absolute top-4 right-6 select-none">{step.number}</div>
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
