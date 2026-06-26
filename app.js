const $ = (selector) => document.querySelector(selector);

const lang = document.documentElement.lang && document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
const copy = {
  en: {
    download: 'Download',
    chooseImages: 'Choose one or more images first.',
    compressing: (done, total) => `Compressing ${done} of ${total} images...`,
    compressed: (done, total) => `Compressed ${done} of ${total} images.`,
    couldNotCompress: (name) => `Could not compress ${name}`,
    original: 'Original',
    compressedSize: 'Compressed',
    choosePdfImages: 'Choose at least one image first.',
    pdfLoadFail: 'PDF library failed to load. Check your connection and try again.',
    pdfCreated: (count) => `Created ${count} page PDF. `,
    choosePdfFile: 'Choose a PDF file first.',
    pdfTextLoadFail: 'PDF text library failed to load. Check your connection and try again.',
    extractingPdfText: (done, total) => `Extracting page ${done} of ${total}...`,
    pdfTextDone: (pages, chars) => `Extracted ${chars} characters from ${pages} pages.`,
    pdfTextEmpty: 'No selectable text was found. This PDF may be scanned and require OCR.',
    pdfTextCopied: 'Text copied to clipboard.',
    pdfTextCopyFail: 'Could not copy automatically. Select the text and copy it manually.',
    words: 'Words',
    characters: 'Characters',
    sentences: 'Sentences',
    readingTime: 'Reading time',
    paragraphs: 'Paragraphs',
    min: 'min',
    topTerms: 'Top terms',
    topTermsEmpty: 'Top terms will appear here.',
    invalidLoan: 'Enter a valid amount, rate, and term.',
    monthlyPayment: 'Monthly payment',
    totalPayment: 'Total payment',
    totalInterest: 'Total interest'
  },
  zh: {
    download: '下载',
    chooseImages: '请先选择一张或多张图片。',
    compressing: (done, total) => `正在压缩 ${done}/${total} 张图片...`,
    compressed: (done, total) => `已压缩 ${done}/${total} 张图片。`,
    couldNotCompress: (name) => `无法压缩 ${name}`,
    original: '原始大小',
    compressedSize: '压缩后',
    choosePdfImages: '请先选择至少一张图片。',
    pdfLoadFail: 'PDF 组件加载失败，请检查网络后重试。',
    pdfCreated: (count) => `已生成 ${count} 页 PDF。`,
    choosePdfFile: '请先选择一个 PDF 文件。',
    pdfTextLoadFail: 'PDF 文字提取组件加载失败，请检查网络后重试。',
    extractingPdfText: (done, total) => `正在提取第 ${done}/${total} 页...`,
    pdfTextDone: (pages, chars) => `已从 ${pages} 页中提取 ${chars} 个字符。`,
    pdfTextEmpty: '没有找到可选择文字。这个 PDF 可能是扫描图片版，需要 OCR。',
    pdfTextCopied: '文字已复制到剪贴板。',
    pdfTextCopyFail: '无法自动复制，请手动选择文本复制。',
    words: '词数',
    characters: '字符数',
    sentences: '句子数',
    readingTime: '阅读时间',
    paragraphs: '段落数',
    min: '分钟',
    topTerms: '高频词',
    topTermsEmpty: '高频词会显示在这里。',
    invalidLoan: '请输入有效的金额、利率和期限。',
    monthlyPayment: '每月还款',
    totalPayment: '总还款',
    totalInterest: '总利息'
  }
}[lang];

const qualityRange = $('#qualityRange');
const qualityValue = $('#qualityValue');
qualityRange.addEventListener('input', () => {
  qualityValue.textContent = qualityRange.value;
});

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs-worker.js';
}

function bytesToSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.textContent = `${copy.download} ${filename}`;
  return { url, link };
}

const compressedImages = [];

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

async function compressImageFile(file, quality, maxWidth) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  if (!blob) throw new Error(copy.couldNotCompress(file.name));
  const filename = file.name.replace(/\.[^.]+$/, '') + '-compressed.jpg';
  const { url, link } = downloadBlob(blob, filename);
  return { file, blob, filename, url, link };
}

$('#compressBtn').addEventListener('click', async () => {
  const files = Array.from($('#compressInput').files || []);
  const result = $('#compressResult');
  const downloadAllBtn = $('#downloadAllBtn');
  if (!files.length) {
    result.textContent = copy.chooseImages;
    return;
  }

  for (const item of compressedImages.splice(0)) {
    URL.revokeObjectURL(item.url);
  }
  downloadAllBtn.disabled = true;
  result.textContent = copy.compressing(0, files.length);

  const maxWidth = Number($('#maxWidthInput').value) || 1600;
  const quality = Number(qualityRange.value) / 100;
  const status = document.createElement('div');
  const list = document.createElement('div');
  list.className = 'file-results';
  result.replaceChildren(status, list);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const row = document.createElement('div');
    row.className = 'file-result-row';
    row.textContent = `${file.name}: ${copy.compressing(i, files.length)}`;
    list.append(row);

    try {
      const compressed = await compressImageFile(file, quality, maxWidth);
      compressedImages.push(compressed);
      const name = document.createElement('strong');
      name.textContent = compressed.filename;
      row.replaceChildren(
        name,
        document.createTextNode(` ${copy.original}: ${bytesToSize(file.size)} | ${copy.compressedSize}: ${bytesToSize(compressed.blob.size)} | `),
        compressed.link
      );
    } catch (error) {
      row.textContent = `${file.name}: ${error.message}`;
    }

    status.textContent = copy.compressed(i + 1, files.length);
  }

  downloadAllBtn.disabled = compressedImages.length === 0;
});

$('#downloadAllBtn').addEventListener('click', () => {
  for (const item of compressedImages) {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.filename;
    document.body.append(link);
    link.click();
    link.remove();
  }
});

$('#pdfBtn').addEventListener('click', async () => {
  const files = Array.from($('#pdfInput').files || []);
  const result = $('#pdfResult');
  if (!files.length) {
    result.textContent = copy.choosePdfImages;
    return;
  }
  if (!window.jspdf) {
    result.textContent = copy.pdfLoadFail;
    return;
  }

  const { jsPDF } = window.jspdf;
  const format = $('#pageSize').value;
  const pdf = new jsPDF({ unit: 'pt', format });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });
    if (i > 0) pdf.addPage(format);
    const margin = 32;
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const width = img.width * ratio;
    const height = img.height * ratio;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;
    pdf.addImage(dataUrl, file.type.includes('png') ? 'PNG' : 'JPEG', x, y, width, height);
  }

  const blob = pdf.output('blob');
  const { link } = downloadBlob(blob, 'images-to-pdf.pdf');
  result.replaceChildren(document.createTextNode(copy.pdfCreated(files.length)), link);
});

function getPdfTextFilename(file) {
  return file.name.replace(/\.[^.]+$/, '') + '.txt';
}

async function extractPdfText(file) {
  const data = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data }).promise;
  const pages = [];
  const result = $('#pdfTextResult');

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    result.textContent = copy.extractingPdfText(pageNumber, pdf.numPages);
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    pages.push(text);
  }

  return {
    pageCount: pdf.numPages,
    text: pages.filter(Boolean).join('\n\n')
  };
}

$('#extractPdfTextBtn').addEventListener('click', async () => {
  const file = $('#pdfTextInput').files[0];
  const output = $('#pdfTextOutput');
  const result = $('#pdfTextResult');
  const copyBtn = $('#copyPdfTextBtn');
  const downloadBtn = $('#downloadPdfTextBtn');

  copyBtn.disabled = true;
  downloadBtn.disabled = true;

  if (!file) {
    result.textContent = copy.choosePdfFile;
    return;
  }
  if (!window.pdfjsLib) {
    result.textContent = copy.pdfTextLoadFail;
    return;
  }

  try {
    output.value = '';
    const extracted = await extractPdfText(file);
    output.value = extracted.text;
    if (!extracted.text) {
      result.textContent = copy.pdfTextEmpty;
      return;
    }
    result.textContent = copy.pdfTextDone(extracted.pageCount, extracted.text.length);
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
  } catch (error) {
    result.textContent = error.message;
  }
});

$('#copyPdfTextBtn').addEventListener('click', async () => {
  const output = $('#pdfTextOutput');
  const result = $('#pdfTextResult');
  try {
    await navigator.clipboard.writeText(output.value);
    result.textContent = copy.pdfTextCopied;
  } catch (error) {
    output.focus();
    output.select();
    result.textContent = copy.pdfTextCopyFail;
  }
});

$('#downloadPdfTextBtn').addEventListener('click', () => {
  const file = $('#pdfTextInput').files[0];
  const output = $('#pdfTextOutput');
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
  const { link } = downloadBlob(blob, file ? getPdfTextFilename(file) : 'pdf-text.txt');
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
});

function updateWordStats() {
  const text = $('#wordInput').value;
  const words = text.trim().match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?|[\u4e00-\u9fff]/g) || [];
  const sentences = text.trim().match(/[^.!?\n。！？]+[.!?。！？]+/g) || [];
  const paragraphs = text.split(/\n+/).filter((line) => line.trim()).length;
  const minutes = Math.max(0, Math.ceil(words.length / 225));
  $('#wordStats').innerHTML = `
    <span>${copy.words}: ${words.length}</span>
    <span>${copy.characters}: ${text.length}</span>
    <span>${copy.sentences}: ${sentences.length}</span>
    <span>${copy.readingTime}: ${minutes} ${copy.min}</span>
    <span>${copy.paragraphs}: ${paragraphs}</span>
  `;

  const counts = new Map();
  for (const raw of words) {
    const word = raw.toLowerCase();
    if (word.length < 3) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  $('#keywordResult').textContent = top.length
    ? `${copy.topTerms}: ${top.map(([word, count]) => `${word} (${count})`).join(', ')}`
    : copy.topTermsEmpty;
}

$('#wordInput').addEventListener('input', updateWordStats);
updateWordStats();

$('#loanBtn').addEventListener('click', () => {
  const amount = Number($('#loanAmount').value);
  const annualRate = Number($('#loanRate').value) / 100;
  const years = Number($('#loanYears').value);
  const result = $('#loanResult');
  if (!amount || !years || annualRate < 0) {
    result.textContent = copy.invalidLoan;
    return;
  }
  const months = years * 12;
  const monthlyRate = annualRate / 12;
  const payment = monthlyRate === 0
    ? amount / months
    : amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  const total = payment * months;
  const interest = total - amount;
  result.innerHTML = `
    <strong>${copy.monthlyPayment}:</strong> ${payment.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}<br>
    <strong>${copy.totalPayment}:</strong> ${total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}<br>
    <strong>${copy.totalInterest}:</strong> ${interest.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
  `;
});

$('#loanBtn').click();
