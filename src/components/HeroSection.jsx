export default function HeroSection({ onScrollToUpload }) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-20 pb-24 transition-colors">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-50 dark:bg-blue-950/30 opacity-70" />
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-blue-50 dark:bg-blue-950/20 opacity-50" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Free · No account needed · Plain English
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          Your medical report,<br />
          <span className="text-blue-600 dark:text-blue-400">explained simply.</span>
        </h1>

        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Got a test result full of confusing numbers and medical terms? Upload a photo of any report
          — blood test, genetics, urine — and we'll explain exactly what it means in plain, honest English.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onScrollToUpload}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-base transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
          >
            Analyze My Report →
          </button>
          <a
            href="#how-it-works"
            className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl text-base border border-gray-200 dark:border-gray-700 transition-colors"
          >
            How does it work?
          </a>
        </div>

        <p className="mt-10 text-sm text-gray-400 dark:text-gray-500">
          Powered by Claude AI · ClinVar · MyVariant.info · NCBI — the same databases doctors use
        </p>
      </div>
    </section>
  );
}
