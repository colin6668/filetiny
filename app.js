const $ = (selector) => document.querySelector(selector);

const lang = document.documentElement.lang && document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
const copy = {
  en: {
    download: 'Download',
    chooseImages: 'Choose one or more images first.',
    working: 'Working...',
    done: 'Done.',
    compressing: (done, total) => `Compressing ${done} of ${total} images...`,
    compressed: (done, total) => `Compressed ${done} of ${total} images.`,
    couldNotCompress: (name) => `Could not compress ${name}`,
    original: 'Original',
    compressedSize: 'Compressed',
    choosePdfImages: 'Choose at least one image first.',
    pdfLoadFail: 'PDF library failed to load. Check your connection and try again.',
    pdfCreated: (count) => `Created ${count} page PDF. `,
    choosePdfFile: 'Choose a PDF file first.',
    choosePdfFiles: 'Choose one or more PDF files first.',
    pdfTextLoadFail: 'PDF text library failed to load. Check your connection and try again.',
    pdfLibLoadFail: 'PDF editing library failed to load. Check your connection and try again.',
    extractingPdfText: (done, total) => `Extracting page ${done} of ${total}...`,
    renderingPdfPage: (done, total) => `Rendering page ${done} of ${total}...`,
    pdfTextDone: (pages, chars) => `Extracted ${chars} characters from ${pages} pages.`,
    pdfTextEmpty: 'No selectable text was found. This PDF may be scanned and require OCR.',
    pdfTextCopied: 'Text copied to clipboard.',
    pdfTextCopyFail: 'Could not copy automatically. Select the text and copy it manually.',
    pdfCompressed: (before, after) => `Created a rebuilt PDF version: ${before} to ${after}. Text may be flattened because pages are rebuilt as images. `,
    pdfMerged: (count, pages) => `Merged ${count} PDFs into one file with ${pages} pages. `,
    pdfSplit: (pages) => `Created a new PDF with ${pages} pages. `,
    invalidPages: 'Enter valid page numbers, for example 1-3,5,8.',
    qrEmpty: 'Enter text or a link first.',
    qrLoadFail: 'QR code library failed to load. Check your connection and try again.',
    qrDone: 'QR code generated. ',
    qrDownloadReady: 'Use the download buttons to save it as PNG or SVG.',
    converting: (done, total) => `Converting ${done} of ${total} images...`,
    converted: (done, total) => `Converted ${done} of ${total} images.`,
    resizing: (done, total) => `Resizing ${done} of ${total} images...`,
    resized: (done, total) => `Resized ${done} of ${total} images.`,
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
    working: '正在处理...',
    done: '已完成。',
    compressing: (done, total) => `正在压缩 ${done}/${total} 张图片...`,
    compressed: (done, total) => `已压缩 ${done}/${total} 张图片。`,
    couldNotCompress: (name) => `无法压缩 ${name}`,
    original: '原始大小',
    compressedSize: '压缩后',
    choosePdfImages: '请先选择至少一张图片。',
    pdfLoadFail: 'PDF 组件加载失败，请检查网络后重试。',
    pdfCreated: (count) => `已生成 ${count} 页 PDF。`,
    choosePdfFile: '请先选择一个 PDF 文件。',
    choosePdfFiles: '请先选择一个或多个 PDF 文件。',
    pdfTextLoadFail: 'PDF 文字提取组件加载失败，请检查网络后重试。',
    pdfLibLoadFail: 'PDF 编辑组件加载失败，请检查网络后重试。',
    extractingPdfText: (done, total) => `正在提取第 ${done}/${total} 页...`,
    renderingPdfPage: (done, total) => `正在渲染第 ${done}/${total} 页...`,
    pdfTextDone: (pages, chars) => `已从 ${pages} 页中提取 ${chars} 个字符。`,
    pdfTextEmpty: '没有找到可选择文字。这个 PDF 可能是扫描图片版，需要 OCR。',
    pdfTextCopied: '文字已复制到剪贴板。',
    pdfTextCopyFail: '无法自动复制，请手动选择文本复制。',
    pdfCompressed: (before, after) => `已生成重建后的 PDF：${before} 到 ${after}。页面会重建为图片，文字可能不再可选择。`,
    pdfMerged: (count, pages) => `已合并 ${count} 个 PDF，共 ${pages} 页。`,
    pdfSplit: (pages) => `已生成包含 ${pages} 页的新 PDF。`,
    invalidPages: '请输入有效页码，例如 1-3,5,8。',
    qrEmpty: '请先输入文字或链接。',
    qrLoadFail: '二维码组件加载失败，请检查网络后重试。',
    qrDone: '二维码已生成。',
    qrDownloadReady: '可以用下载按钮保存为 PNG 或 SVG。',
    converting: (done, total) => `正在转换 ${done}/${total} 张图片...`,
    converted: (done, total) => `已转换 ${done}/${total} 张图片。`,
    resizing: (done, total) => `正在处理 ${done}/${total} 张图片...`,
    resized: (done, total) => `已处理 ${done}/${total} 张图片。`,
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

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadImage(file) {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file);
  }
  const dataUrl = await fileToDataUrl(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

function getImageSize(image) {
  return {
    width: image.width || image.naturalWidth,
    height: image.height || image.naturalHeight
  };
}

function closeImage(image) {
  image.close?.();
}

function imageFilename(file, suffix, extension) {
  return `${file.name.replace(/\.[^.]+$/, '')}${suffix}.${extension}`;
}

function renderFileResult(row, filename, beforeSize, afterSize, link) {
  const name = document.createElement('strong');
  name.textContent = filename;
  row.replaceChildren(
    name,
    document.createTextNode(` ${copy.original}: ${bytesToSize(beforeSize)} | ${copy.compressedSize}: ${bytesToSize(afterSize)} | `),
    link
  );
}

const compressedImages = [];
const convertedImages = [];
const resizedImages = [];
let latestQrSvg = '';

async function compressImageFile(file, quality, maxWidth) {
  const image = await loadImage(file);
  const size = getImageSize(image);
  const scale = Math.min(1, maxWidth / size.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(size.width * scale));
  canvas.height = Math.max(1, Math.round(size.height * scale));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  closeImage(image);

  const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  if (!blob) throw new Error(copy.couldNotCompress(file.name));
  const filename = imageFilename(file, '-compressed', 'jpg');
  const { url, link } = downloadBlob(blob, filename);
  return { file, blob, filename, url, link };
}

const qualityRange = $('#qualityRange');
const qualityValue = $('#qualityValue');
qualityRange?.addEventListener('input', () => {
  qualityValue.textContent = qualityRange.value;
});

$('#compressBtn')?.addEventListener('click', async () => {
  const files = Array.from($('#compressInput').files || []);
  const result = $('#compressResult');
  const downloadAllBtn = $('#downloadAllBtn');
  if (!files.length) {
    result.textContent = copy.chooseImages;
    return;
  }

  for (const item of compressedImages.splice(0)) URL.revokeObjectURL(item.url);
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
      renderFileResult(row, compressed.filename, file.size, compressed.blob.size, compressed.link);
    } catch (error) {
      row.textContent = `${file.name}: ${error.message}`;
    }

    status.textContent = copy.compressed(i + 1, files.length);
  }

  downloadAllBtn.disabled = compressedImages.length === 0;
});

$('#downloadAllBtn')?.addEventListener('click', () => {
  for (const item of compressedImages) {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.filename;
    document.body.append(link);
    link.click();
    link.remove();
  }
});

async function convertImageFile(file, type, quality) {
  const image = await loadImage(file);
  const size = getImageSize(image);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  canvas.getContext('2d').drawImage(image, 0, 0);
  closeImage(image);

  const extension = type.split('/')[1].replace('jpeg', 'jpg');
  const blob = await canvasToBlob(canvas, type, quality);
  if (!blob) throw new Error(copy.couldNotCompress(file.name));
  const filename = imageFilename(file, '-converted', extension);
  const { url, link } = downloadBlob(blob, filename);
  return { file, blob, filename, url, link };
}

$('#convertBtn')?.addEventListener('click', async () => {
  const files = Array.from($('#convertInput').files || []);
  const result = $('#convertResult');
  if (!files.length) {
    result.textContent = copy.chooseImages;
    return;
  }

  for (const item of convertedImages.splice(0)) URL.revokeObjectURL(item.url);
  const type = $('#convertFormat').value;
  const quality = Number($('#convertQuality').value) / 100;
  const status = document.createElement('div');
  const list = document.createElement('div');
  list.className = 'file-results';
  result.replaceChildren(status, list);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const row = document.createElement('div');
    row.className = 'file-result-row';
    row.textContent = `${file.name}: ${copy.converting(i, files.length)}`;
    list.append(row);
    try {
      const converted = await convertImageFile(file, type, quality);
      convertedImages.push(converted);
      renderFileResult(row, converted.filename, file.size, converted.blob.size, converted.link);
    } catch (error) {
      row.textContent = `${file.name}: ${error.message}`;
    }
    status.textContent = copy.converted(i + 1, files.length);
  }
});

async function resizeImageFile(file, options) {
  const image = await loadImage(file);
  const source = getImageSize(image);
  const targetWidth = Math.max(1, Number(options.width) || source.width);
  const targetHeight = Math.max(1, Number(options.height) || Math.round(source.height * (targetWidth / source.width)));
  const crop = options.mode === 'crop';
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (crop) {
    const sourceRatio = source.width / source.height;
    const targetRatio = targetWidth / targetHeight;
    let sx = 0;
    let sy = 0;
    let sw = source.width;
    let sh = source.height;
    if (sourceRatio > targetRatio) {
      sw = source.height * targetRatio;
      sx = (source.width - sw) / 2;
    } else {
      sh = source.width / targetRatio;
      sy = (source.height - sh) / 2;
    }
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  } else {
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
  }

  closeImage(image);
  const type = $('#resizeFormat').value;
  const extension = type.split('/')[1].replace('jpeg', 'jpg');
  const blob = await canvasToBlob(canvas, type, Number($('#resizeQuality').value) / 100);
  if (!blob) throw new Error(copy.couldNotCompress(file.name));
  const filename = imageFilename(file, crop ? '-cropped' : '-resized', extension);
  const { url, link } = downloadBlob(blob, filename);
  return { file, blob, filename, url, link };
}

$('#resizeBtn')?.addEventListener('click', async () => {
  const files = Array.from($('#resizeInput').files || []);
  const result = $('#resizeResult');
  if (!files.length) {
    result.textContent = copy.chooseImages;
    return;
  }

  for (const item of resizedImages.splice(0)) URL.revokeObjectURL(item.url);
  const options = {
    width: $('#resizeWidth').value,
    height: $('#resizeHeight').value,
    mode: $('#resizeMode').value
  };
  const status = document.createElement('div');
  const list = document.createElement('div');
  list.className = 'file-results';
  result.replaceChildren(status, list);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const row = document.createElement('div');
    row.className = 'file-result-row';
    row.textContent = `${file.name}: ${copy.resizing(i, files.length)}`;
    list.append(row);
    try {
      const resized = await resizeImageFile(file, options);
      resizedImages.push(resized);
      renderFileResult(row, resized.filename, file.size, resized.blob.size, resized.link);
    } catch (error) {
      row.textContent = `${file.name}: ${error.message}`;
    }
    status.textContent = copy.resized(i + 1, files.length);
  }
});

$('#pdfBtn')?.addEventListener('click', async () => {
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
    const dataUrl = await fileToDataUrl(file);
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

async function compressPdfFile(file) {
  if (!window.jspdf || !window.pdfjsLib) throw new Error(copy.pdfLoadFail);
  const result = $('#pdfCompressResult');
  const { jsPDF } = window.jspdf;
  const quality = Number($('#pdfCompressQuality').value) / 100;
  const maxWidth = Number($('#pdfCompressWidth').value) || 1200;
  const source = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let outputPdf = null;

  for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
    result.textContent = copy.renderingPdfPage(pageNumber, source.numPages);
    const page = await source.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(2, maxWidth / baseViewport.width);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    const image = canvas.toDataURL('image/jpeg', quality);
    const pageSize = [baseViewport.width, baseViewport.height];
    if (!outputPdf) {
      outputPdf = new jsPDF({ unit: 'pt', format: pageSize });
    } else {
      outputPdf.addPage(pageSize);
    }
    outputPdf.addImage(image, 'JPEG', 0, 0, baseViewport.width, baseViewport.height);
  }

  return outputPdf.output('blob');
}

$('#pdfCompressBtn')?.addEventListener('click', async () => {
  const file = $('#pdfCompressInput').files[0];
  const result = $('#pdfCompressResult');
  if (!file) {
    result.textContent = copy.choosePdfFile;
    return;
  }
  try {
    result.textContent = copy.working;
    const blob = await compressPdfFile(file);
    const filename = file.name.replace(/\.[^.]+$/, '') + '-compressed.pdf';
    const { link } = downloadBlob(blob, filename);
    result.replaceChildren(document.createTextNode(copy.pdfCompressed(bytesToSize(file.size), bytesToSize(blob.size))), link);
  } catch (error) {
    result.textContent = error.message;
  }
});

async function loadPdfLibDocument(file) {
  if (!window.PDFLib) throw new Error(copy.pdfLibLoadFail);
  return window.PDFLib.PDFDocument.load(await file.arrayBuffer());
}

$('#pdfMergeBtn')?.addEventListener('click', async () => {
  const files = Array.from($('#pdfMergeInput').files || []);
  const result = $('#pdfMergeResult');
  if (!files.length) {
    result.textContent = copy.choosePdfFiles;
    return;
  }
  try {
    result.textContent = copy.working;
    const merged = await window.PDFLib.PDFDocument.create();
    let pages = 0;
    for (const file of files) {
      const source = await loadPdfLibDocument(file);
      const copied = await merged.copyPages(source, source.getPageIndices());
      copied.forEach((page) => merged.addPage(page));
      pages += copied.length;
    }
    const bytes = await merged.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const { link } = downloadBlob(blob, 'merged.pdf');
    result.replaceChildren(document.createTextNode(copy.pdfMerged(files.length, pages)), link);
  } catch (error) {
    result.textContent = error.message;
  }
});

function parsePageRanges(input, totalPages) {
  const pages = new Set();
  const parts = input.split(',').map((part) => part.trim()).filter(Boolean);
  for (const part of parts) {
    const match = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(copy.invalidPages);
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end < start || end > totalPages) throw new Error(copy.invalidPages);
    for (let page = start; page <= end; page += 1) pages.add(page - 1);
  }
  return [...pages].sort((a, b) => a - b);
}

$('#pdfSplitBtn')?.addEventListener('click', async () => {
  const file = $('#pdfSplitInput').files[0];
  const result = $('#pdfSplitResult');
  if (!file) {
    result.textContent = copy.choosePdfFile;
    return;
  }
  try {
    result.textContent = copy.working;
    const source = await loadPdfLibDocument(file);
    const pageInput = $('#pdfSplitPages').value.trim() || `1-${source.getPageCount()}`;
    const selected = parsePageRanges(pageInput, source.getPageCount());
    const output = await window.PDFLib.PDFDocument.create();
    const copied = await output.copyPages(source, selected);
    copied.forEach((page) => output.addPage(page));
    const bytes = await output.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const filename = file.name.replace(/\.[^.]+$/, '') + '-pages.pdf';
    const { link } = downloadBlob(blob, filename);
    result.replaceChildren(document.createTextNode(copy.pdfSplit(copied.length)), link);
  } catch (error) {
    result.textContent = error.message;
  }
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

$('#extractPdfTextBtn')?.addEventListener('click', async () => {
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

$('#copyPdfTextBtn')?.addEventListener('click', async () => {
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

$('#downloadPdfTextBtn')?.addEventListener('click', () => {
  const file = $('#pdfTextInput').files[0];
  const output = $('#pdfTextOutput');
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
  const { link } = downloadBlob(blob, file ? getPdfTextFilename(file) : 'pdf-text.txt');
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
});

async function generateQrCode() {
  const input = $('#qrInput');
  const canvas = $('#qrCanvas');
  const result = $('#qrResult');
  const pngBtn = $('#qrDownloadPngBtn');
  const svgBtn = $('#qrDownloadSvgBtn');
  const text = input.value.trim();
  const size = Math.min(1024, Math.max(128, Number($('#qrSize').value) || 256));
  const errorCorrectionLevel = $('#qrErrorLevel').value || 'M';

  pngBtn.disabled = true;
  svgBtn.disabled = true;
  latestQrSvg = '';

  if (!text) {
    result.textContent = copy.qrEmpty;
    return;
  }
  if (!window.QRCode) {
    result.textContent = copy.qrLoadFail;
    return;
  }

  canvas.width = size;
  canvas.height = size;
  const options = {
    width: size,
    margin: 2,
    errorCorrectionLevel,
    color: {
      dark: '#111827',
      light: '#ffffff'
    }
  };

  try {
    await window.QRCode.toCanvas(canvas, text, options);
    latestQrSvg = await window.QRCode.toString(text, {
      ...options,
      type: 'svg'
    });
    pngBtn.disabled = false;
    svgBtn.disabled = false;
    result.textContent = `${copy.qrDone} ${copy.qrDownloadReady}`;
  } catch (error) {
    result.textContent = error.message;
  }
}

$('#qrGenerateBtn')?.addEventListener('click', generateQrCode);

$('#qrDownloadPngBtn')?.addEventListener('click', () => {
  const canvas = $('#qrCanvas');
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'filetiny-qr-code.png';
  document.body.append(link);
  link.click();
  link.remove();
});

$('#qrDownloadSvgBtn')?.addEventListener('click', () => {
  if (!latestQrSvg) return;
  const blob = new Blob([latestQrSvg], { type: 'image/svg+xml;charset=utf-8' });
  const { link } = downloadBlob(blob, 'filetiny-qr-code.svg');
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
});

if ($('#qrInput')) {
  $('#qrInput').value = lang === 'zh' ? 'https://filetiny.com/zh' : 'https://filetiny.com/';
  generateQrCode();
}

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

$('#wordInput')?.addEventListener('input', updateWordStats);
if ($('#wordInput')) updateWordStats();

$('#loanBtn')?.addEventListener('click', () => {
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

$('#loanBtn')?.click();
