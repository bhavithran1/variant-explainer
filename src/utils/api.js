// Free public APIs for genetic variant information

const CLINVAR_ESEARCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const CLINVAR_EFETCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
const CLINVAR_ESUMMARY = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
const MYVARIANT = 'https://myvariant.info/v1';
const MYGENE = 'https://mygene.info/v3';

// Search ClinVar by variant name or rsID
export async function searchClinVar(query) {
  const searchUrl = `${CLINVAR_ESEARCH}?db=clinvar&term=${encodeURIComponent(query)}&retmax=10&retmode=json`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const ids = searchData.esearchresult?.idlist || [];
  if (ids.length === 0) return [];

  const summaryUrl = `${CLINVAR_ESUMMARY}?db=clinvar&id=${ids.join(',')}&retmode=json`;
  const summaryRes = await fetch(summaryUrl);
  const summaryData = await summaryRes.json();
  const result = summaryData.result || {};
  return ids.map(id => result[id]).filter(Boolean);
}

// Search MyVariant.info by rsID or HGVS
export async function searchMyVariant(query) {
  const url = `${MYVARIANT}/query?q=${encodeURIComponent(query)}&fields=clinvar,dbsnp,cadd,gnomad,gene&size=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyVariant.info query failed: ${res.status}`);
  return res.json();
}

// Get gene info from MyGene.info
export async function getGeneInfo(symbol) {
  const url = `${MYGENE}/query?q=symbol:${encodeURIComponent(symbol)}&species=human&fields=name,summary,alias,pathway,go,omim,ensembl&size=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.hits?.[0] || null;
}

// Map ClinVar significance to plain language
export function significancePlainLanguage(sig) {
  const map = {
    'Pathogenic': {
      label: 'Harmful',
      color: 'red',
      emoji: '⚠️',
      explanation: 'This variant is classified as harmful. It is strongly associated with the reported genetic condition based on scientific evidence.',
    },
    'Likely pathogenic': {
      label: 'Probably Harmful',
      color: 'orange',
      emoji: '🔶',
      explanation: 'Evidence suggests this variant is probably harmful, though researchers are not yet 100% certain.',
    },
    'Uncertain significance': {
      label: 'Uncertain',
      color: 'amber',
      emoji: '❓',
      explanation: 'There is not yet enough scientific evidence to determine whether this variant is harmful or harmless. This is very common — science is still learning.',
    },
    'Likely benign': {
      label: 'Probably Harmless',
      color: 'blue',
      emoji: '🔵',
      explanation: 'Evidence suggests this variant is probably harmless and not disease-causing.',
    },
    'Benign': {
      label: 'Harmless',
      color: 'green',
      emoji: '✅',
      explanation: 'This variant is classified as harmless. It is a normal variation found in healthy people.',
    },
    'Conflicting interpretations of pathogenicity': {
      label: 'Conflicting Evidence',
      color: 'purple',
      emoji: '⚡',
      explanation: 'Different laboratories have reported different classifications. More research is needed.',
    },
  };
  return map[sig] || {
    label: sig || 'Unknown',
    color: 'gray',
    emoji: '❔',
    explanation: 'The significance of this variant is not established in current databases.',
  };
}

export function frequencyLabel(freq) {
  if (freq === undefined || freq === null) return 'Unknown';
  if (freq < 0.0001) return 'Very rare (<0.01%)';
  if (freq < 0.001) return 'Rare (0.01–0.1%)';
  if (freq < 0.01) return 'Uncommon (0.1–1%)';
  if (freq < 0.05) return 'Low frequency (1–5%)';
  return 'Common (>5%)';
}
