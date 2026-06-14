export function downloadReportAsPDF(analysisText, reportType = 'Medical Report Analysis') {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const lines = analysisText.split('\n');

  const htmlLines = lines.map(line => {
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (/^(REPORT TYPE|YOUR RESULTS|OVERALL PICTURE|THINGS TO MENTION|IMPORTANT REMINDER)$/i.test(line.trim())) {
      return `<h2 class="section-heading">${escaped}</h2>`;
    }
    if (line.trim().startsWith('•')) {
      return `<div class="result-item">${escaped}</div>`;
    }
    if (line.trim() === '') return '<div class="spacer"></div>';
    return `<p class="body-text">${escaped}</p>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GeneSimple — ${reportType}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.7;
      color: #1a1a2e;
      background: #fff;
      padding: 48px 56px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 18px;
      margin-bottom: 28px;
    }
    .logo { font-size: 20px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }
    .logo span { color: #1a1a2e; }
    .meta { text-align: right; font-size: 11px; color: #6b7280; line-height: 1.6; }
    h2.section-heading {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #2563eb;
      margin-top: 24px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #dbeafe;
    }
    .result-item {
      background: #f8faff;
      border-left: 3px solid #2563eb;
      padding: 8px 12px;
      margin-bottom: 6px;
      border-radius: 0 6px 6px 0;
      font-size: 12.5px;
    }
    .body-text { margin-bottom: 6px; color: #374151; }
    .spacer { height: 8px; }
    .disclaimer {
      margin-top: 36px;
      padding: 14px 16px;
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      font-size: 11.5px;
      color: #92400e;
      line-height: 1.6;
    }
    .disclaimer strong { color: #78350f; }
    .footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid #e5e7eb;
      font-size: 10.5px;
      color: #9ca3af;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 24px 32px; }
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Gene<span>Simple</span></div>
      <div style="font-size:11px;color:#6b7280;margin-top:3px;">Plain-language medical report summary</div>
    </div>
    <div class="meta">
      Generated: ${date}<br/>
      For educational use only
    </div>
  </div>

  ${htmlLines}

  <div class="disclaimer">
    <strong>⚠ Important:</strong> This summary is for educational purposes only and is NOT medical advice.
    Always discuss your actual test results with your doctor or a qualified healthcare professional
    before making any health decisions. Test result interpretations can vary based on your personal health history.
  </div>

  <div class="footer">
    <span>GeneSimple · genesimple.app</span>
    <span>Powered by Claude AI · ClinVar · MyVariant.info</span>
  </div>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (!w) {
    alert('Please allow pop-ups to download the PDF.');
    return;
  }
  w.document.write(html);
  w.document.close();
  w.onload = () => {
    w.focus();
    w.print();
  };
}
