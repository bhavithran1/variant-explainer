# Plain-Language Variant Explainer

Translates genetic test variant results into plain, understandable summaries using the public ClinVar and MyVariant.info databases. Includes careful "not medical advice" guardrails throughout.

## The Problem

When patients receive a genetic test report, they see terms like "Pathogenic", "VUS", or "c.5266dupC" — but these mean very little without a genetics background. This tool bridges that gap.

## Features

- Search by gene name, rsID, HGVS notation, or variant description
- Plain-language explanation of each classification (Pathogenic, VUS, Benign, etc.)
- Associated conditions listed in readable format
- Population frequency with intuitive labels (Rare, Common, etc.)
- Background on the affected gene from MyGene.info
- Prominent "not medical advice" disclaimers throughout
- Links to certified genetic counselors (NSGC)

## Data Sources (all free, no API key)

| Source | What is used |
|--------|-------------|
| NCBI ClinVar via E-utilities | Variant classifications, conditions |
| MyVariant.info | Cross-database variant annotations |
| MyGene.info | Gene summaries and background |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/
    VariantSearchBar.jsx  - Search input with format examples
    VariantCard.jsx       - Plain-language variant result card
    Disclaimer.jsx        - Prominent medical advice disclaimer
  utils/
    api.js                - ClinVar/MyVariant API helpers + plain-language mappings
  App.jsx                 - Main layout and search orchestration
```

## Ethical Design Choices

- Every result page shows the "not medical advice" disclaimer
- Uncertain significance variants get extra explanation (very common, can change)
- Link to find certified genetic counselors on every result
- No user tracking or data retention

## Planned Improvements

- Add OMIM disease descriptions
- ClinGen dosage sensitivity data
- Show variant submission history (who classified it and when)
- Inheritance pattern explanation (autosomal dominant, recessive, etc.)
- Family risk calculator for dominant pathogenic variants
- Printable summary for healthcare provider visits
