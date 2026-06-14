import { useState, useRef } from 'react';
import { Search, Upload, Camera, Loader, HelpCircle, Key, X, Eye, EyeOff } from 'lucide-react';

const EXAMPLES = [
  { label: 'BRCA1 c.5266dupC', desc: 'Breast cancer gene variant' },
  { label: 'rs80357906', desc: 'By rsID code' },
  { label: 'TP53 R175H', desc: 'Common p53 change' },
  { label: 'CFTR F508del', desc: 'Cystic fibrosis variant' },
  { label: 'APOE e4', desc: 'Alzheimer risk allele' },
];

export default function UploadSection({ onSearch, onAnalyzeImage, loading }) {
  const [query, setQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(null); // { base64, mimeType }
  const [imageProcessing, setImageProcessing] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('gs_api_key') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiInput, setShowApiInput] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  function saveApiKey(val) {
    setApiKey(val);
    sessionStorage.setItem('gs_api_key', val);
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      setImageError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    setImageError(null);
    setImageProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];
      setUploadedImage(dataUrl);
      setImageData({ base64, mimeType: file.type });
      setImageProcessing(false);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  function clearImage() {
    setUploadedImage(null);
    setImageData(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }

  function handleAnalyze() {
    if (!imageData) return;
    if (!apiKey.trim()) {
      setShowApiInput(true);
      return;
    }
    onAnalyzeImage(imageData.base64, imageData.mimeType, apiKey.trim());
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <section id="try-it" className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Try it yourself</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Upload a photo of <strong className="text-gray-700 dark:text-gray-300">any medical test report</strong> — blood test, urine test, genetics, and more.
            Or type in a specific genetic variant code.
          </p>
        </div>

        {/* --- IMAGE UPLOAD --- */}
        {!uploadedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="mb-6 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {imageProcessing ? (
              <div className="flex flex-col items-center gap-3 text-blue-500">
                <Loader className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Loading image…</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-4 mb-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                    <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 font-medium mb-1">Drag & drop your report photo here</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">Blood tests · Genetics · Urine · Cholesterol · Any lab report</p>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                  className="text-xs px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take a photo with your camera
                </button>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="mb-6 rounded-2xl overflow-hidden border border-blue-200 dark:border-blue-800 relative">
            <img src={uploadedImage} alt="Uploaded report" className="w-full max-h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5">
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">Report uploaded ✓</p>
                <p className="text-white/70 text-xs mt-0.5">Ready to analyze with AI</p>
              </div>
              <button onClick={clearImage} className="text-white/60 hover:text-white text-xs flex items-center gap-1">
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        )}

        {imageError && <p className="text-red-500 text-sm mb-4 text-center">{imageError}</p>}

        {/* API key section */}
        {uploadedImage && (
          <div className="mb-5">
            {!showApiInput && !apiKey ? (
              <button
                onClick={() => setShowApiInput(true)}
                className="w-full py-3 px-4 flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800 rounded-2xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-sm font-medium"
              >
                <Key className="w-4 h-4" />
                Add your Claude API key to analyze this report with AI
              </button>
            ) : showApiInput || !apiKey ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-3">
                <div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                    <Key className="w-4 h-4" /> Your Claude API Key
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                    Required to analyze images with AI. Your key is only used in your browser and never sent to our servers.
                    Get one free at{' '}
                    <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline">console.anthropic.com</a>.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={e => saveApiKey(e.target.value)}
                      placeholder="sk-ant-api03-..."
                      className="w-full px-3 py-2.5 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowApiInput(false)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-2.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl">
                <span className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <Key className="w-4 h-4" /> API key saved for this session
                </span>
                <button onClick={() => setShowApiInput(true)} className="text-xs text-green-600 dark:text-green-500 underline">Change</button>
              </div>
            )}
          </div>
        )}

        {/* Analyze button */}
        {uploadedImage && (
          <button
            onClick={handleAnalyze}
            disabled={loading || !imageData}
            className="w-full mb-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
          >
            {loading ? (
              <><Loader className="w-5 h-5 animate-spin" /> Analyzing your report…</>
            ) : (
              '✦ Analyze My Report with AI'
            )}
          </button>
        )}

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-400">
              {uploadedImage ? 'or search for a specific genetic variant' : 'or search for a specific genetic variant'}
            </span>
          </div>
        </div>

        {/* Text search */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. BRCA1 c.5266dupC, rs80357906, TP53 R175H…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-750 text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl font-semibold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Explain'}
          </button>
        </form>

        {showHelp && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-2xl text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
            <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">What can I type?</p>
            <p>• <strong>Gene + variant:</strong> BRCA1 c.5266dupC or TP53 R175H</p>
            <p>• <strong>rsID code:</strong> rs80357906 (starts with "rs")</p>
            <p>• <strong>Just a gene name:</strong> BRCA1 (shows common variants)</p>
            <p>• <strong>HGVS notation:</strong> NM_007294.4:c.5266dup</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-xs text-gray-400 self-center">Genetic examples:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => { setQuery(ex.label); onSearch(ex.label); }}
              className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg transition-colors"
              title={ex.desc}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
