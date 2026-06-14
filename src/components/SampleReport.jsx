import { useState, useEffect, useRef } from 'react';

const SAMPLE_LINES = [
  '> Initializing GeneSimple AI analysis engine...',
  '> Reading your medical report...',
  '> Translating medical terms to plain English...',
  '',
  '> ─────────────────────────────────────',
  '> REPORT TYPE',
  '> ─────────────────────────────────────',
  '> Blood test — Complete Blood Count (CBC)',
  '> (This checks the different types of cells in your blood)',
  '',
  '> ─────────────────────────────────────',
  '> YOUR RESULTS',
  '> ─────────────────────────────────────',
  '> • Red Blood Cells (RBC): 4.8 million/µL → Normal.',
  '>   These carry oxygen around your body. Yours look healthy.',
  '',
  '> • Haemoglobin: 14.2 g/dL → Normal.',
  '>   The protein in red cells that carries oxygen. Good level.',
  '',
  '> • White Blood Cells (WBC): 11.5 thousand/µL → Slightly high.',
  '>   These fight infections. A mildly elevated count can mean',
  '>   your body is fighting something like a cold or mild infection.',
  '',
  '> • Platelets: 210 thousand/µL → Normal.',
  '>   These help your blood clot when you get a cut.',
  '',
  '> ─────────────────────────────────────',
  '> OVERALL PICTURE',
  '> ─────────────────────────────────────',
  '> Most of your results look normal and healthy. Your white',
  '> blood cell count is slightly above the usual range, which',
  '> often just means your body is fighting a mild infection.',
  '',
  '> ─────────────────────────────────────',
  '> THINGS TO MENTION TO YOUR DOCTOR',
  '> ─────────────────────────────────────',
  '> • White blood cells (WBC) are mildly elevated — worth',
  '>   mentioning at your next appointment.',
  '',
  '> ─────────────────────────────────────',
  '> Analysis complete. ✓',
];

function lineColor(line) {
  if (line.includes('─────') || /^> (REPORT TYPE|YOUR RESULTS|OVERALL PICTURE|THINGS TO MENTION)/i.test(line))
    return 'text-blue-400';
  if (line.startsWith('> ✓') || (line.includes('complete') && line.includes('✓')))
    return 'text-green-400';
  if (line.startsWith('> •'))
    return 'text-cyan-300';
  return 'text-gray-300';
}

export default function SampleReport() {
  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || done || currentLine >= SAMPLE_LINES.length) {
      if (started && currentLine >= SAMPLE_LINES.length) setDone(true);
      return;
    }
    const line = SAMPLE_LINES[currentLine];
    if (line === '') {
      const t = setTimeout(() => {
        setDisplayed(p => [...p, '']);
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 60);
      return () => clearTimeout(t);
    }
    if (currentChar < line.length) {
      const speed = line.startsWith('> ─') ? 5 : 10;
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
  }, [started, currentLine, currentChar, done]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayed, currentChar]);

  const currentTyping = !done && started && currentLine < SAMPLE_LINES.length
    ? SAMPLE_LINES[currentLine].slice(0, currentChar)
    : null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors" ref={sectionRef}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">See a real example</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Here's what a GeneSimple analysis looks like — a blood test explained in plain English.</p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-gray-400 font-mono">GeneSimple — AI medical report analysis — sample_blood_test.jpg</span>
          </div>

          <div ref={containerRef} className="bg-gray-950 p-6 h-96 overflow-y-auto font-mono text-sm leading-7">
            {displayed.map((line, i) => (
              <div key={i} className={lineColor(line)}>{line || ' '}</div>
            ))}
            {currentTyping !== null && (
              <div className="text-gray-300">
                {currentTyping}<span className="animate-pulse text-blue-400">▋</span>
              </div>
            )}
            {!started && (
              <div className="text-gray-600 text-xs">Scroll down to start the demo...</div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
          Example using a simulated blood test report — the kind you might get from your GP
        </p>
      </div>
    </section>
  );
}
